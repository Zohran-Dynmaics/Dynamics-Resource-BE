import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";

import { CustomRequest } from "src/shared/custom-interface";

@Controller("cms")
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get("products")
  async getProduct(@Req() req: CustomRequest): Promise<any> {
    const { env, query } = req;
    return await this.productService.getProduct(
      env?.token,
      env?.base_url,
      query,
    );
  }

  @Get("products/:product_id")
  async getProductWithId(@Req() req: CustomRequest): Promise<any> {
    const { env, params, query } = req;
    return await this.productService.getProductWithId(
      env?.token,
      env?.base_url,
      params?.product_id,
      query,
    );
  }

  @Get("productpricelevels")
  async getProductPriceLevels(@Req() req: CustomRequest): Promise<any> {
    const { env, query } = req;
    return await this.productService.productPriceLevels(
      env?.token,
      env?.base_url,
      query,
    );
  }

  @Get("productpricelevels/:product_id")
  async getProductPriceLevelsWithId(@Req() req: CustomRequest): Promise<any> {
    const { env, query, params } = req;
    return await this.productService.productPriceLevelsWithId(
      env?.token,
      env?.base_url,
      params?.product_id,
      query,
    );
  }
}
