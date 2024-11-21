import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  SocketConnection,
  SocketConnectionSchema
} from "./entities/location.entity";
import { LocationService } from "./location.service";
import { LocationGateway } from "./location.gateway";
import {
  CustomerTechnicianMap,
  CustomerTechnicianMapSchema
} from "./entities/customer_technician_map.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SocketConnection.name, schema: SocketConnectionSchema },
      { name: CustomerTechnicianMap.name, schema: CustomerTechnicianMapSchema }
    ])
  ],

  providers: [LocationService, LocationGateway]
})
export class LocationModule {}
