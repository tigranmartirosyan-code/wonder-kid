import { Controller, Post, Body, Get, Redirect } from '@nestjs/common';
import { EmailService } from "./EmailService";
import { EmailSendDto } from './dto/email-send.dto';


@Controller('email')
export class EmailController {
    constructor(private readonly emailService: EmailService) {}

    @Post('/send')
    @Redirect('/')
    async sendEmail(@Body() emailData: EmailSendDto) {
        console.log(emailData);
        try {
            await this.emailService.sendEmail(emailData);
            return { message: 'Email sent successfully' };
        } catch (error) {
            throw new Error('Failed to send email: ' + error.message);
        }
    }
}