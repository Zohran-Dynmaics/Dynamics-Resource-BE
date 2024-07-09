import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  toJSON: {
    transform: (doc, ret) => {
      delete ret.token;
      delete ret.__v;
      return ret;
    },
  },
})
export class Environment {
  @Prop({ required: true, type: String })
  env_name: string;

  @Prop({ type: String, required: true })
  client_id: string;

  @Prop({ type: String, required: true })
  client_secret: string;

  @Prop({ type: String, required: true })
  tenant_id: string;

  @Prop({ type: String, required: true })
  base_url: string;

  @Prop({ type: String, required: false })
  token: string;
}

export const EnvironmentSchema = SchemaFactory.createForClass(Environment);
