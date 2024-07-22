import { IsEmail, IsOptional } from "class-validator";
import { UserRole } from "../../shared/enum";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.__v;
      delete ret.resourceId;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true, type: String })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  resourceId: string;

  @Prop({ type: String, required: false })
  project?: string

  @Prop({ type: Boolean, default: false })
  resetPasswordRequested?: boolean;

  @Prop({ type: String, required: false })
  resetPasswordOtp?: string;

  @Prop({ type: Date, required: false })
  resetPasswordOtpExpiry?: Date;

  @Prop({ type: String, required: true, default: UserRole.TECHNICIAN })
  roles: [];
}

export const UserSchema = SchemaFactory.createForClass(User);

// TODO [1]: 1. Add Token Field to environments entity 2.Check the token in SignIn api whether a token is available against environment or not 3. If token is available then skip this step else generate a new token store it environment table for that environment. 4. Get the users of that environment using token 5. Verify user 6. if Valid user -> Store in User table along with the role (technician)

// TODO [2]: Update the auth middleware to update the token. 