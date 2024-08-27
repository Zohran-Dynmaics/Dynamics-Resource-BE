import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { ApiModule } from "src/modules/api/api.module";
import { EnvironmentModule } from "src/modules/admin/environment/environment.module";

@Module({
  imports: [ApiModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule { }
