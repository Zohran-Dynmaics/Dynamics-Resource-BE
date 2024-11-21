import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  timestamps: { createdAt: true, updatedAt: true }
})
export class CustomerTechnicianMap {
  @Prop({ type: String, required: true })
  customerId: string;

  @Prop({ type: String, required: true })
  technicianId: string;

  @Prop({ type: String, required: true })
  socketId: string;
}

export const CustomerTechnicianMapSchema = SchemaFactory.createForClass(
  CustomerTechnicianMap
);
