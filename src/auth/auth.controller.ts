import { Controller, Get, Post, Render, Body, Res, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { StudentsService } from '../students/students.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('login')
  @Render('login') // views/login.hbs
  loginPage() {
    return { title: 'Login' };
  }

  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const { username, password } = body;
    console.log(body);
    // Replace with real DB check
    if (username === 'admin@admin.com' && password === '1234') {
      const token = jwt.sign(
        { username },
        process.env.JWT_SECRET || 'mysecret',
        { expiresIn: '1h' },
      );
      console.log(token);

      res.cookie('auth_token', token, { httpOnly: true });
      return res.json({ success: true, message: 'Logged in successfully' });
    }

    const students = await this.studentsService.findByEmail(username);
    console.log(students, 'ddddddddddddd');

    if (students && password === students.password) {
      const token = jwt.sign(
        { username },
        process.env.JWT_SECRET || 'mysecret',
        { expiresIn: '1h' },
      );
      console.log(token);

      res.cookie('auth_token', token, { httpOnly: true });
      return res.json({ success: true, message: 'Logged in successfully' });
    }

    return res.render('login', {
      title: 'Login',
      error: 'Invalid credentials',
    });
  }
}
