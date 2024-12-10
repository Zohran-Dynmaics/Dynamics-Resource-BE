import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import moment from "moment";
import { Model } from "mongoose";
import { ApiService } from "src/modules/api/api.service";
import { CreatePromoCode, PromoStatusType, ValidatePromoCode } from "./dto";
import { PromoCode } from "./promo-code.entity";

@Injectable()
export class PromoCodeService {
  constructor(
    @InjectModel(PromoCode.name)
    private promocodeModel: Model<PromoCode>,
    private apiService: ApiService
  ) { }

  async getAllPromoCodes(): Promise<PromoCode[]> {
    return await this.promocodeModel.find({}).exec();
  }

  async createPromoCode(promoCode: CreatePromoCode): Promise<PromoCode> {
    try {
      return await this.promocodeModel.create(promoCode);
    } catch (error) {
      throw error;
    }
  }

  async getPromoCodeDropDowns(base_url: string, token: string): Promise<any> {
    try {
      const endPoints = [
        {
          endpoint: "bookableresourcecategories",
          filter: "name"
        },
        {
          endpoint: "products",
          filter: "name"
        },
        {
          endpoint: "contacts",
          filter: "fullname"
        },
        {
          endpoint: "accounts",
          filter: "name"
        }
      ];

      const [categories, products_services, contacts, accounts]: any =
        await Promise.all(
          endPoints.map(async (endpoint) => {
            const response = await this.apiService.request({
              url: `${base_url}/api/data/v9.1/${endpoint.endpoint}?$select=${endpoint.filter}`,
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            return response;
          })
        );

      return {
        categories: categories?.value.map((category) => ({
          label: category?.name,
          value: category?.bookableresourcecategoryid
        })),
        products_services: products_services?.value.map(
          (product_service: any) => ({
            label: product_service?.name,
            value: product_service?.productid
          })
        ),
        contacts: contacts?.value.map((contact: any) => ({
          label: contact?.fullname,
          value: contact?.contactid
        })),
        accounts: accounts?.value.map((accounts: any) => ({
          label: accounts?.name,
          value: accounts?.accountid
        }))
      };
    } catch (error) {
      throw error;
    }
  }

  async validatePromoCode(
    data: ValidatePromoCode,
    user_id: string
  ): Promise<any> {
    try {
      const {
        promocode,
        orderAmount,
        category = null,
        product_service = null,
        account = null
      } = data;
      const today = new Date();

      const promoCodeData = await this.findPromoCodeByName(promocode);
      if (!promoCodeData) throw new Error("Promo code not found.");

      if (promoCodeData?.status != PromoStatusType.ACTIVE)
        throw new Error("Promo code is inactive/expired.");

      if (
        promoCodeData?.used_promo_code_users?.length > 0 &&
        promoCodeData?.used_promo_code_users?.includes(user_id)
      ) {
        throw new Error("Promo code has already been used.");
      }

      if (!moment(promoCodeData?.end_date).diff(moment(today))) {
        await this.updatePromoCode(promoCodeData?._id, {
          status: PromoStatusType.EXPIRED
        });
        throw new Error("Promo code is expired.");
      }

      if (orderAmount < promoCodeData?.min_order)
        throw new Error(
          `Order amount is below the minimum required. Minimum order amount is ${promoCodeData?.min_order}`
        );

      if (promoCodeData?.limit.toLocaleLowerCase() !== "unlimited") {
        const limit = parseInt(promoCodeData?.limit);
        if (promoCodeData?.usage_count == limit) {
          await this.updatePromoCode(promoCodeData?._id, {
            status: PromoStatusType.EXPIRED
          });
          throw new Error("Promo code usage limit reached.");
        }
      }

      if (
        account &&
        promoCodeData?.accounts.length > 0 &&
        promoCodeData?.accounts?.[0] != "All"
      ) {
        if (!promoCodeData?.accounts.includes(account))
          throw new Error("Account not authorized for this promo code.");
      }
      if (
        product_service &&
        promoCodeData?.products_services.length > 0 &&
        promoCodeData?.products_services?.[0] != "All"
      ) {
        if (!promoCodeData?.products_services.includes(product_service))
          throw new Error(
            "Product/Service not authorized for this promo code."
          );
      }

      if (
        category &&
        promoCodeData?.categories.length > 0 &&
        promoCodeData?.categories?.[0] != "All"
      ) {
        if (!promoCodeData?.categories.includes(category))
          throw new Error("Category not authorized for this promo code.");
      }

      await this.updatePromoCode(promoCodeData?._id, {
        usage_count: promoCodeData?.usage_count + 1,
        $push: { used_promo_code_users: user_id }
      });
      return promoCodeData;
    } catch (error) {
      throw error;
    }
  }

  async findPromoCodeByName(code: string): Promise<any> {
    try {
      return await this.promocodeModel.findOne({ code }).exec();
    } catch (error) {
      throw error;
    }
  }

  async updatePromoCode(id: string, data: any): Promise<PromoCode> {
    try {
      return await this.promocodeModel
        .findByIdAndUpdate(id, { ...data }, { new: true })
        .exec();
    } catch (error) {
      throw error;
    }
  }
}
