import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";

import { CustomRequest } from "src/shared/custom-interface";

@Controller("cms/product")
export class ProductController {
  constructor(private productService: ProductService) { }

  @Get("price-list/:product_id")
  async getPriceList(@Req() req: CustomRequest): Promise<any> {
    const { env, params, query } = req;
    return await this.productService.productRateList(
      env?.token,
      env?.base_url,
      params?.product_id,
      query,
    );
  }

  @Get("price-level/:product_id")
  async productPriceLevel(@Req() req: CustomRequest): Promise<any> {
    const { env, params, query } = req;
    return await this.productService.productPriceLevels(
      env?.token,
      env?.base_url,
      params?.product_id,
      query,
    );
  }

  @Get("inventory-products")
  async getInventoryProducts(@Req() req: CustomRequest): Promise<any> {
    const { env, query } = req;
    return await this.productService.inventoryProducts(
      env?.token,
      env?.base_url,
      query,
    );
  }
}
