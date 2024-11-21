import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { LocationService } from "./location.service";
import { ConnectionRole } from "./location.dto";

@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
export class LocationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  // constructor(private readonly socketLocationService: LocationService) {}
  @WebSocketServer()
  server: Server;

  // In-memory mappings
  private customerSocketMap = new Map<string, string>();
  private technicianCustomerMap = new Map<string, string>();

  async handleConnection(client: Socket) {
    const { customerId, technicianId } = client.handshake.query;

    if (customerId) {
      this.customerSocketMap.set(customerId as string, client.id);
      // await this.socketLocationService.createSocketConnection({
      //   userId: customerId.toString(),
      //   socketId: client?.id,
      //   role: ConnectionRole.CUSTOMER
      // });

      // const customerTechnicianMap =
      //   await this.socketLocationService.getCustomerTechnicianMapByCustomerId(
      //     customerId.toString()
      //   );

      // if (customerTechnicianMap) {
      //   await this.socketLocationService.updateCustomerTechnicianMap(
      //     customerId.toString(),
      //     client?.id
      //   );
      // }
    }

    if (technicianId) {
      // await this.socketLocationService.createSocketConnection({
      //   userId: technicianId.toString(),
      //   socketId: client?.id,
      //   role: ConnectionRole.TECHNICIAN
      // });
      // Optionally, add technician-specific logic here
    }
    // console.log("🚀 ~ customerSocketMap:", this.customerSocketMap);
  }

  async handleDisconnect(client: Socket) {
    const customerId = [...this.customerSocketMap.entries()].find(
      ([, socketId]) => socketId === client.id
    )?.[0];
    // const socketRecord: any =
    //   await this.socketLocationService.getSocketConnectionBySocketId(
    //     client?.id
    //   );
    if (customerId) {
      this.customerSocketMap.delete(customerId);
      // await this.socketLocationService.deleteConnectionById(
      //   socketRecord?._id.toString()
      // );
      // console.log(`Customer ${customerId} disconnected.`);
    }
  }

  @SubscribeMessage("startTraveling")
  async handleStartTraveling(
    client: Socket,
    payload: { technicianId: string; customerId: string }
  ) {
    // console.log("🚀 ~ payload:", payload);
    // Map technician to customer
    this.technicianCustomerMap.set(payload.technicianId, payload.customerId);
    // const socketConnection =
    //   await this.socketLocationService.getSocketConnectionByUserId(
    //     payload?.customerId,
    //     ConnectionRole?.CUSTOMER
    //   );

    // if (socketConnection) {
    //   await this.socketLocationService.createCustomerTechnicianMap({
    //     customerId: payload?.customerId,
    //     technicianId: payload?.technicianId,
    //     socketId: socketConnection?.socketId
    //   });
    // }
    // console.log(
    //   `Technician ${payload.technicianId} traveling to customer ${payload.customerId}`,
    //   "------------------------",
    //   this.technicianCustomerMap
    // );
  }

  @SubscribeMessage("updateLocation")
  async handleLocationUpdate(
    client: Socket,
    payload: { technicianId: string; lat: number; lng: number }
  ) {
    const customerId = this.technicianCustomerMap.get(payload.technicianId);
    // const customerTechnicianMapRecord =
    //   await this.socketLocationService.getCustomerTechnicianMapByTechnicianId(
    //     payload?.technicianId
    //   );
    if (customerId) {
      const customerSocketId = this.customerSocketMap.get(customerId);
      // const customerSocketRecord =
      //   await this.socketLocationService.getSocketConnectionByUserId(
      //     customerTechnicianMapRecord?.customerId,
      //     ConnectionRole?.CUSTOMER
      //   );

      if (customerSocketId) {
        // this.server.to(customerSocketId).emit("locationUpdate", payload);
        this.server.to(customerSocketId).emit("locationUpdate", payload);
        // console.log(`Location update sent to customer ${customerId}:`, payload);
      } else {
        console.warn(`Customer ${customerId} is not connected.`);
      }
    } else {
      console.warn(`No customer found for technician ${payload.technicianId}.`);
    }
  }
}
