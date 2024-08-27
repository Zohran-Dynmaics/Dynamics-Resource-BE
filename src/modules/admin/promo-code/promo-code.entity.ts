import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PromoStatusType, PromoType } from "./dto";

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class PromoCode {
    @Prop({ required: true, type: String })
    title: string;

    @Prop({ required: true, type: String })
    code: string;

    @Prop({ required: true, type: String })
    description: string;

    @Prop({ required: true, type: Number, })
    limit: number;

    @Prop({ required: true, enum: PromoType, default: PromoType.FIXED })
    type: PromoType;

    @Prop({ required: true, type: Number })
    value: number;

    @Prop({ required: true, type: Number })
    max_discount: number;

    @Prop({ required: true, type: Number })
    min_order: number;

    @Prop({ required: true, type: Date })
    start_date: Date;

    @Prop({ required: true, type: Date })
    end_date: Date;

    @Prop({ required: true, type: [String] })
    users: string[];

    @Prop({ required: true, type: [String] })
    categories: string[];

    @Prop({ required: true, type: [String] })
    products_services: string[];

    @Prop({ required: true, type: [String] })
    accounts: string[];

    @Prop({ required: true, type: Date })
    start_date_2: Date;

    @Prop({ required: true, type: Date })
    end_date_2: Date;

    @Prop({ required: false, enum: PromoStatusType, default: PromoStatusType.ACTIVE })
    status: PromoStatusType;

    @Prop({ required: false, type: Number, default: 0 })
    usage_count: number;

    @Prop({ required: false, type: [String], default: [] })
    used_promo_code_users: string[];


}

export const PromoSchema = SchemaFactory.createForClass(PromoCode);

