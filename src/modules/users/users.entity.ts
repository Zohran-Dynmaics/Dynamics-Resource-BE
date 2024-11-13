import { IsEmail, IsOptional } from "class-validator";
import { UserRole } from "../../shared/enum";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret.resetPasswordRequested;
      delete ret.resetPasswordOtp;
      delete ret.resetPasswordOtpExpiry;
      return ret;
    }
  }
})
export class User {
  @Prop({ required: true, type: String })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({
    type: String,
    required: false,
    IsEmail: true,
    // unique: true,
    nullable: true
  })
  email?: string;

  @Prop({ type: String, required: false })
  resourceId?: string;

  @Prop({ type: String, required: false })
  project?: string;

  @Prop({ type: Boolean, default: false })
  resetPasswordRequested?: boolean;

  @Prop({ type: String, required: false })
  resetPasswordOtp?: string;

  @Prop({ type: Date, required: false })
  resetPasswordOtpExpiry?: Date;

  @Prop({ type: String, required: true })
  envName: string;

  @Prop({ type: String, required: false })
  account?: string;

  @Prop({ type: String, required: false })
  department?: string;

  @Prop({ type: String, required: true, default: UserRole.TECHNICIAN })
  role: string;

  @Prop({ required: false, type: [String] })
  access?: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
