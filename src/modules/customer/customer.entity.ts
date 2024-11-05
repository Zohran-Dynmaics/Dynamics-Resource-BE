import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserRole } from "../../shared/enum";

@Schema({
  timestamps: { createdAt: true, updatedAt: true },

  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.__v;
      delete ret.otp;
      delete ret.verified;
      delete ret.role;
      delete ret.createdAt;
      delete ret.updatedAt;
      delete ret.resetPasswordRequested;
      delete ret.resetPasswordOtp;
      delete ret.resetPasswordOtpExpiry;
      return ret;
    }
  }
})
export class Customer {
  @Prop({ type: String, required: false })
  profile?: string;

  @Prop({ required: false, type: String })
  firstName: string;

  @Prop({ required: false, nullable: true, type: String })
  lastName?: string;

  @Prop({ required: false, type: String })
  fullName: string;

  @Prop({ type: String, required: false })
  password: string;

  @Prop({
    type: String,
    required: false,
    IsEmail: true
  })
  email?: string;

  @Prop({ required: true, type: String, unique: true })
  phoneNumber: string;

  @Prop({ required: false, type: String })
  project: string;

  @Prop({ required: false, type: String, nullable: true })
  building?: string;

  @Prop({ required: false, type: String, nullable: true })
  buildingId?: string;

  @Prop({ required: false, type: String })
  apartment: string;

  @Prop({ required: false, type: String })
  unit: string;

  @Prop({ required: false, type: String })
  device: string;

  @Prop({ required: false, nullable: true, default: "1234", type: String })
  otp: string;

  @Prop({ required: true, default: false, type: Boolean })
  verified: boolean;

  @Prop({ required: true, default: new Date(), type: String })
  lastActivity: string;

  @Prop({ required: false, type: String })
  contactId: string;

  @Prop({ required: false, type: String })
  customerNumber: string;

  @Prop({ required: false, type: String })
  area: string;

  @Prop({ required: false, type: String })
  appName: string;

  @Prop({ required: false, type: String })
  accountId: string;

  @Prop({ required: false, type: String })
  account: string;

  @Prop({ required: false, type: String, nullable: true })
  location?: string;

  @Prop({ required: false, type: String, nullable: true })
  locationId?: string;

  @Prop({ required: false, type: String, nullable: true })
  zone?: string;

  @Prop({ required: false, type: String, nullable: true })
  zoneId?: string;

  @Prop({ required: false, type: String })
  address: string;

  @Prop({ required: false, type: String, nullable: true })
  floor?: string;

  @Prop({ required: false, type: String, nullable: true })
  floorId?: string;

  @Prop({ required: false, type: String, default: null })
  downloadedOn: string;

  @Prop({ type: Boolean, default: false })
  resetPasswordRequested?: boolean;

  @Prop({ type: String, required: false })
  resetPasswordOtp?: string;

  @Prop({ type: Date, required: false })
  resetPasswordOtpExpiry?: Date;

  @Prop({ type: String, required: true, default: UserRole.CUSTOMER })
  role: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.pre<Customer>("save", function (next) {
  if (this.firstName || this.lastName) {
    this.fullName = `${this.firstName || ""} ${this.lastName || ""}`.trim();
  }
  next();
});

CustomerSchema.pre<any>("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  const query = this.getQuery();
  const docToUpdate = await this.model.findOne(query).exec();
  if (update.firstName || update.lastName) {
    update.fullName =
      `${update.firstName || docToUpdate.firstName || ""} ${update.lastName || docToUpdate.lastName || ""}`.trim();
  }
  next();
});
