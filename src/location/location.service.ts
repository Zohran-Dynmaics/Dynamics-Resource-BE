import { Injectable } from "@nestjs/common";
import { SocketConnection } from "./entities/location.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ConnectionRole } from "./location.dto";
import { CustomerTechnicianMap } from "./entities/customer_technician_map.entity";

@Injectable()
export class LocationService {
  constructor(
    // @InjectModel(SocketPayload.name) private readonly socketPayloadModel: Model<SocketPayload>,
    @InjectModel(SocketConnection.name)
    private readonly socketConnectionModel: Model<SocketConnection>,
    @InjectModel(CustomerTechnicianMap.name)
    private readonly customerTechnicianMapModel: Model<CustomerTechnicianMap>
  ) {}

  async createSocketConnection(
    socketConnection: SocketConnection
  ): Promise<SocketConnection> {
    // console.log("🚀 ~ LocationService ~ socketConnection:", socketConnection);
    try {
      const socketUser = await this.socketConnectionModel.findOne({
        userId: socketConnection?.userId
      });
      // console.log("🚀 ~ LocationService ~ socketUser:", socketUser);
      if (socketUser) {
        throw new Error("User already connected");
      }
      return await this.socketConnectionModel.create(socketConnection);
    } catch (error) {
      throw error;
    }
  }

  async getSocketConnectionByUserId(
    id: string,
    role: ConnectionRole
  ): Promise<SocketConnection | null> {
    try {
      return await this.socketConnectionModel.findOne({ userId: id, role });
    } catch (error) {
      throw error;
    }
  }

  async deleteConnectionByUserId(
    id: string,
    role: ConnectionRole
  ): Promise<void> {
    try {
      await this.socketConnectionModel.deleteOne({ userId: id, role });
      return;
    } catch (error) {
      throw error;
    }
  }

  async deleteConnectionById(id: string): Promise<void> {
    try {
      await this.socketConnectionModel.findByIdAndDelete(id);
      return;
    } catch (error) {
      throw error;
    }
  }

  async getSocketConnectionBySocketId(
    socketId: string
  ): Promise<SocketConnection> {
    try {
      return await this.socketConnectionModel.findOne({ socketId });
    } catch (error) {
      throw error;
    }
  }

  async createCustomerTechnicianMap(
    customerTechnicianMap: CustomerTechnicianMap
  ): Promise<CustomerTechnicianMap> {
    try {
      return await this.customerTechnicianMapModel.create({
        customerTechnicianMap
      });
    } catch (error) {
      throw error;
    }
  }

  async updateCustomerTechnicianMap(
    customerId: string,
    socketId: string
  ): Promise<CustomerTechnicianMap> {
    try {
      return await this.customerTechnicianMapModel.findOneAndUpdate(
        { customerId },
        { $set: { socketId } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async getCustomerTechnicianMapByCustomerId(
    customerId: string
  ): Promise<CustomerTechnicianMap> {
    try {
      return await this.customerTechnicianMapModel.findOne({ customerId });
    } catch (error) {
      throw error;
    }
  }

  async getCustomerTechnicianMapByTechnicianId(
    technicianId: string
  ): Promise<CustomerTechnicianMap> {
    try {
      return await this.customerTechnicianMapModel.findOne({ technicianId });
    } catch (error) {
      throw error;
    }
  }

  async deleteCustomerTechnicianMap(technicianId: string): Promise<void> {
    try {
      await this.customerTechnicianMapModel.findOneAndDelete({ technicianId });
    } catch (error) {
      throw error;
    }
  }
}
