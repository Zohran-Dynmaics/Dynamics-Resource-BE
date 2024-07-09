import { Injectable } from "@nestjs/common";
import { User } from "./users.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(email: string, password: string) {
    return await this.userModel.create({ email, password });
  }

  findAll() {
    return `This action returns all users`;
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }
}
