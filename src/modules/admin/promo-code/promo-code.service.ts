import { Injectable } from '@nestjs/common';
import { PromoCode } from './promo-code.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePromoCode } from './dto';
import { ApiService } from 'src/modules/api/api.service';

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
                    endpoint: 'bookableresourcecategories',
                    filter: 'name',

                },
                {
                    endpoint: 'products',
                    filter: 'name'
                },
                {
                    endpoint: 'contacts',
                    filter: 'fullname'
                },
                {
                    endpoint: 'accounts',
                    filter: 'name'
                }
            ]

            const [categories, products_services, contacts, accounts]: any = await Promise.all(endPoints.map(async (endpoint) => {
                const response = await this.apiService.request({
                    url: `${base_url}/api/data/v9.1/${endpoint.endpoint}?$select=${endpoint.filter}`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return response;

            }))



            return { categories: categories?.value.map(category => ({ label: category?.name, value: category?.bookableresourcecategoryid })), products_services: products_services?.value.map((product_service: any) => ({ label: product_service?.name, value: product_service?.productid })), contacts: contacts?.value.map((contact: any) => ({ label: contact?.fullname, value: contact?.contactid })), accounts: accounts?.value.map((accounts: any) => ({ label: accounts?.name, value: accounts?.accountid })) };

        } catch (error) {
            throw error;
        }
    }
}
