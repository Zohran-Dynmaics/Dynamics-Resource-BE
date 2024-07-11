import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { User } from "./users.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Mongoose, MongooseError } from "mongoose";
import { SearchUserDto, UpdateUserDto } from "./users.dto";
import { generateHash } from "src/shared/utility";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async create(email: string, password: string) {
    return await this.userModel.create({ email, password });
  }

  async update(updateUserDto: UpdateUserDto): Promise<User> {
    const { _id, password = null } = updateUserDto;
    try {
      const user = await this.findOne({ _id });
      if (!user) {
        throw new NotFoundException(`User ${_id} not found`);
      }
      if (password) {
        updateUserDto.password = await generateHash(password);
      }
      // TODO: update User on crm here.
      return await this.userModel
        .findByIdAndUpdate(_id, updateUserDto, { new: true })
        .exec();
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  async findOne(searchUserDto: SearchUserDto): Promise<User> {
    try {
      if (!Object.keys(searchUserDto).length) {
        throw new HttpException(
          "At least one search parameter should be provided. (_id, email, project)",
          HttpStatus.BAD_REQUEST
        );
      }

      return await this.userModel.findOne(searchUserDto).exec();
    } catch (error) {
      throw error;
    }
  }
}
