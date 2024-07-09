import { IsEmail, IsOptional } from "class-validator";
import { UserRole } from "../../shared/enum";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true, type: String })
  @IsEmail()
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true, default: UserRole.USER })
  roles: [];
}

export const UserSchema = SchemaFactory.createForClass(User);
