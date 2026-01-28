import { Module } from '@nestjs/common';
import {EmailController} from "./EmailController";
import {EmailService} from "./EmailService";

@Module({
    controllers: [EmailController], // Add your EmailController to the controllers array
    providers: [EmailService],
    exports: [EmailService]
})

export class EmailModule {}