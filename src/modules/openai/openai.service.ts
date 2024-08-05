import { Injectable } from '@nestjs/common';
import { chatCompletion } from './utility';

@Injectable()
export class OpenaiService {


    async generateAnswer(question: string, context?: string): Promise<any> {
        const messages: any = [
            {
                role: "user",
                content: question,
            },
        ];
        const chat = await chatCompletion(messages);
        return chat;
    }
}
