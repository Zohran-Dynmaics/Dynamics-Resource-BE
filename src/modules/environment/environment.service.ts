import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Environment } from "./environment.entity";
import { Model, Schema, Types } from "mongoose";
import { CreateEnvironmentDto, UpdateEnvironmentDto } from "./environment.dto";

@Injectable()
export class EnvironmentService {
  constructor(
    @InjectModel(Environment.name) private envModel: Model<Environment>,
  ) { }

  async create(createEnvDto: CreateEnvironmentDto): Promise<Environment> {
    try {
      const { env_name } = createEnvDto;
      const env = await this.envModel.findOne({ env_name }).exec();

      if (env) {
        throw new HttpException(
          "Environment with this name already exists",
          HttpStatus.BAD_REQUEST,
        );
      }
      return await this.envModel.create({
        ...createEnvDto,
        env_name: env_name.toLowerCase(),
      });
    } catch (error) {
      throw error;
    }
  }

  async update(updateEnvDto: UpdateEnvironmentDto): Promise<Environment> {
    try {
      const { _id, env_name } = updateEnvDto;
      return await this.envModel.findByIdAndUpdate(
        _id,
        { ...updateEnvDto, env_name: env_name.toLowerCase() },
        { new: true },
      );
    } catch (error) {
      throw error;
    }
  }

  async findByName(env_name: string): Promise<Environment> {
    return this.envModel.findOne({ env_name }).exec();
  }

  async findByBaseUrl(base_url: string): Promise<any> {
    return this.envModel.findOne({ base_url }).exec();
  }

  async findById(_id: string | Types.ObjectId): Promise<Environment> {
    return this.envModel.findById(_id).exec();
  }
}
