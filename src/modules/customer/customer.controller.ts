import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req
} from "@nestjs/common";
import { CustomerService } from "./customer.service";
import { Customer } from "./customer.entity";
import { ObjectId } from "mongoose";
import { CustomRequest } from "src/shared/custom-interface";
import { UpdateCustomerDto, UpdatePassword } from "./dto";

@Controller("customer")
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get("stats")
  async getStats(): Promise<any> {
    // Fetch user statistics from your database or external API
    // Replace this line with your actual logic
    return await this.customerService.getStats();
  }

  @Get()
  async getAllCustomers(): Promise<Customer[]> {
    return this.customerService.getAllCustomers();
  }

  @Get("/:id")
  async getCustomer(@Param() param: { id: ObjectId }): Promise<Customer> {
    const { id } = param;
    return await this.customerService.findById(id.toString());
  }

  @Patch()
  async updateCustomer(
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Req() req: CustomRequest
  ): Promise<Customer> {
    const { env, user } = req;
    return await this.customerService.update(updateCustomerDto, env, user);
  }

  @Patch("/update-password")
  async updatePassword(
    @Body() updatePassword: UpdatePassword,
    @Req() req: CustomRequest
  ): Promise<Customer> {
    const { user } = req;
    return await this.customerService.updatePasswordInternally(
      user?._id.toString(),
      updatePassword
    );
  }

  @Delete("/:id")
  async deleteAccount(@Param() param: { id: string }): Promise<string> {
    const { id } = param;
    return await this.customerService.deleteAccount(id);
  }
}
