import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { generateHash, getEnvironmentNameFromEmail } from "src/shared/utility/utility";
import { CmsService } from "../cms/cms.service";
import { EnvironmentService } from "../environment/environment.service";
import { SearchUserDto, UpdateUserDto } from "./users.dto";
import { User } from "./users.entity";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private envService: EnvironmentService, private cmsService: CmsService) { }

  async create(email: string, password: string, resourceId: string) {
    return await this.userModel.create({ email, password, resourceId });
  }

  async update(updateUserDto: UpdateUserDto, crmToken?: string): Promise<User> {
    const { _id, password = null } = updateUserDto;
    try {
      const user = await this.findOne({ _id });
      if (!user) {
        throw new NotFoundException(`User ${_id} not found`);
      }
      if (password) {
        updateUserDto.password = await generateHash(password);

        const env = await this.envService.findByName(
          getEnvironmentNameFromEmail(user?.email)
        );
        const access_token = env?.token ?? (await this.cmsService.getCrmToken(env)).access_token;

        await this.cmsService.updateBookaableResource(access_token, env?.base_url, user?.resourceId, { cafm_password: password });

      }
      // TODO: update User on crm here.
      return await this.userModel.findByIdAndUpdate(_id, { ...updateUserDto }, { new: true }).exec();
    } catch (error) {
      throw error;
    }
  }

  async delete(_id: string | Types.ObjectId): Promise<boolean> {
    try {
      const user = await this.findOne({ _id });
      if (!user) {
        throw new NotFoundException(`User ${_id} not found`);
      }
      await this.userModel.findByIdAndDelete(_id).exec();
      return true
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
