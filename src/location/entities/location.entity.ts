import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ConnectionRole } from "../location.dto";

@Schema({
  timestamps: { createdAt: true, updatedAt: true }
})
export class SocketConnection {
  @Prop({ type: String, required: true, unique: true })
  socketId: string;

  @Prop({ type: String, required: true, unique: true })
  userId: string;

  @Prop({ type: String, required: true, enum: ConnectionRole })
  role: string;
}

export const SocketConnectionSchema =
  SchemaFactory.createForClass(SocketConnection);
