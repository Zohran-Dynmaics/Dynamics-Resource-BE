import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isMongoId } from 'class-validator';

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform {
    transform(value: any) {
        if (!isMongoId(value)) {
            throw new BadRequestException('Invalid ObjectId');
        }
        return value;
    }
}