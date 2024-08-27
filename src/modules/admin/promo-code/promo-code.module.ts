import { Module } from '@nestjs/common';
import { PromoCodeController } from './promo-code.controller';
import { PromoCodeService } from './promo-code.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PromoCode, PromoSchema } from './promo-code.entity';
import { ApiModule } from 'src/modules/api/api.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: PromoCode.name, schema: PromoSchema }]), ApiModule],
    controllers: [PromoCodeController],
    providers: [PromoCodeService]
})
export class PromoCodeModule { }
