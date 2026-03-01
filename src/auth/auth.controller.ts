import { Controller, Get, Post, Render, Body, Res, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { StudentsService } from '../students/students.service';
import { TrainersService } from '../trainers/trainers.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly trainersService: TrainersService,
    private readonly usersService: UsersService,
  ) {}

  @Get('login')
  @Render('login')
  loginPage() {
    return { title: 'Login' };
  }

  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const { username, password } = body;
      const secret = process.env.JWT_SECRET || 'mysecret';

      // 1. Check users table (admin role)
      const user = await this.usersService.findByEmail(username);
      if (user && password === user.password) {
        const role = user.role || 'admin';
        const token = jwt.sign(
          { username, role, userId: user.id },
          secret,
          { expiresIn: '1h' },
        );
        res.cookie('auth_token', token, { httpOnly: true, sameSite: 'lax' });
        return res.json({ success: true, role, message: 'Logged in successfully' });
      }

      // 2. Check trainers table
      const trainer = await this.trainersService.findByEmail(username);
      if (trainer && password === (trainer as any).password) {
        const token = jwt.sign(
          { username, role: 'trainer', trainerId: trainer.id },
          secret,
          { expiresIn: '1h' },
        );
        res.cookie('auth_token', token, { httpOnly: true, sameSite: 'lax' });
        return res.json({ success: true, role: 'trainer', message: 'Logged in successfully' });
      }

      // 3. Check students table
      const student = await this.studentsService.findByEmail(username);
      if (student && password === student.password) {
        const token = jwt.sign(
          { username, role: 'student', studentId: student.id },
          secret,
          { expiresIn: '1h' },
        );
        res.cookie('auth_token', token, { httpOnly: true, sameSite: 'lax' });
        return res.json({ success: true, role: 'student', message: 'Logged in successfully' });
      }

      // No match
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ success: false, message: 'Server error during login' });
    }
  }

  @Post('register')
  async register(
    @Body() body: { fullName: string; email: string; phone: string; password: string; role: string },
    @Res() res: Response,
  ) {
    const { fullName, email, phone, password, role } = body;

    if (!fullName || !email || !phone || !password || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!['admin', 'student', 'trainer'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');
    const armenianPhoneRegex = /^(\+374|0)(10|11|12|33|41|43|44|46|47|49|55|77|91|93|94|95|96|97|98|99)\d{6}$/;
    if (!armenianPhoneRegex.test(cleanedPhone)) {
      return res.status(400).json({ success: false, message: 'Enter a valid Armenian phone number' });
    }

    try {
      if (role === 'admin') {
        const existing = await this.usersService.findByEmail(email);
        if (existing) {
          return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        await this.usersService.create({
          fullName,
          email,
          phone,
          password,
          role: 'admin',
          work_type: '',
        });
      } else if (role === 'student') {
        const existing = await this.studentsService.findByEmail(email);
        if (existing) {
          return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        await this.studentsService.create({
          fullName,
          email,
          password,
          age: 0,
          groupName: '',
          phones: phone,
        } as any);
      } else if (role === 'trainer') {
        const existing = await this.trainersService.findByEmail(email);
        if (existing) {
          return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        await this.trainersService.create({
          fullName,
          email,
          password,
          phone,
          role: 'trainer',
          description: '',
          image: '',
        } as any);
      }

      return res.json({ success: true, message: 'Registration successful' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Registration failed' });
    }
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('auth_token');
    return res.json({ success: true, message: 'Logged out successfully' });
  }
}
