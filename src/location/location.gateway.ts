import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
export class LocationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // In-memory mappings
  private customerSocketMap = new Map<string, string>();
  private technicianCustomerMap = new Map<string, string>();

  handleConnection(client: Socket) {
    const { customerId, technicianId } = client.handshake.query;
    console.log("🚀 ~ handleConnection ~ technicianId:", technicianId);
    console.log("🚀 ~ handleConnection ~ customerId:", customerId);

    if (customerId) {
      this.customerSocketMap.set(customerId as string, client.id);
      console.log(
        `Customer ${customerId} connected with socket ID ${client.id}`
      );
    }

    if (technicianId) {
      console.log(`Technician ${technicianId} connected.`);
      // Optionally, add technician-specific logic here
    }
    console.log("🚀 ~ customerSocketMap:", this.customerSocketMap);
  }

  handleDisconnect(client: Socket) {
    const customerId = [...this.customerSocketMap.entries()].find(
      ([, socketId]) => socketId === client.id
    )?.[0];
    if (customerId) {
      this.customerSocketMap.delete(customerId);
      console.log(`Customer ${customerId} disconnected.`);
    }
  }

  @SubscribeMessage("startTraveling")
  handleStartTraveling(
    client: Socket,
    payload: { technicianId: string; customerId: string }
  ) {
    console.log("🚀 ~ payload:", payload);
    // Map technician to customer
    this.technicianCustomerMap.set(payload.technicianId, payload.customerId);
    console.log(
      `Technician ${payload.technicianId} traveling to customer ${payload.customerId}`,
      "------------------------",
      this.technicianCustomerMap
    );
  }

  @SubscribeMessage("updateLocation")
  handleLocationUpdate(
    client: Socket,
    payload: { technicianId: string; lat: number; lng: number }
  ) {
    const customerId = this.technicianCustomerMap.get(payload.technicianId);
    if (customerId) {
      const customerSocketId = this.customerSocketMap.get(customerId);
      if (customerSocketId) {
        this.server.to(customerSocketId).emit("locationUpdate", payload);
        console.log(`Location update sent to customer ${customerId}:`, payload);
      } else {
        console.warn(`Customer ${customerId} is not connected.`);
      }
    } else {
      console.warn(`No customer found for technician ${payload.technicianId}.`);
    }
  }
}
