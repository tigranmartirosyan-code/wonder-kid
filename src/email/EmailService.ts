import {Injectable} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import { EmailSendDto } from './dto/email-send.dto';

@Injectable()
export class EmailService {
    async sendEmail({username, phone, email, subject, message}: EmailSendDto) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            secure: false,
            auth: {
                user: 'martirosyantigran.developer@gmail.com',
                pass: 'ykfdutujwwemidsh',
            },
        });

        const emailTemplateSource = fs.readFileSync("src/email/email-template.hbs", 'utf8');
        const template = handlebars.compile(emailTemplateSource);

        const html = template({
            subject,
            message,
            email,
            phone,
            username,
        });

        const mailOptions = {
            from: email,
            to: "martirosyantigran.developer@gmail.com",
            subject: subject,
            html
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}