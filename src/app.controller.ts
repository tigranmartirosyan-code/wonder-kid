import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { StudentsService } from './students/students.service';
import { CoursesService } from './courses/courses.service';
import { CandidatesService } from './candidates/candidates.service';
import { TrainersService } from './trainers/trainers.service';
import { BlogsService } from './blogs/blogs.service';
import { SchedulesService } from './schedules/schedules.service';
import { SeoService } from './seo/seo.service';
import { FaqService } from './faq/faq.service';
import { PagesService } from './pages/pages.service';
import express from 'express';
import * as jwt from 'jsonwebtoken';


@Controller()
export class AppController {
  constructor(
    private readonly usersService: UsersService,
    private readonly studentsService: StudentsService,
    private readonly coursesService: CoursesService,
    private readonly candidatesService: CandidatesService,
    private readonly trainersService: TrainersService,
    private readonly blogsService: BlogsService,
    private readonly schedulesService: SchedulesService,
    private readonly seoService: SeoService,
    private readonly faqService: FaqService,
    private readonly pagesService: PagesService,
  ) {}


  @Get()
  @Render('index')
  async root() {
    const trainers = await this.trainersService.findAll(['schedules']);
    const courses = await this.coursesService.findAll();
    const blogs = await this.blogsService.findAll();
    const seo = await this.seoService.findByPageName('home');

    return {
      title: seo?.metaTitle || 'Wonder Kid',
      metaDescription: seo?.metaDescription || '',
      metaKeywords: seo?.metaKeywords || '',
      ogImage: seo?.ogImage || '',
      canonicalUrl: seo?.canonicalUrl || '',
      courses,
      trainers,
      blogs,
    };
  }

  @Get('/login')
  login(@Req() req: express.Request, @Res() res: express.Response) {
    const token = req.cookies?.auth_token;
    if (token) {
      try {
        const secret = process.env.JWT_SECRET || 'mysecret';
        const decoded = jwt.verify(token, secret) as any;
        if (decoded.role === 'student') {
          return res.redirect('/profile');
        }
        return res.redirect('/admin');
      } catch (err) {}
    }
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.render('login', { title: 'Wonder Kid' });
  }

  @Get('/admin')
  async admin(@Req() req: express.Request, @Res() res: express.Response) {
    const token = req.cookies['auth_token'];
    const secret = process.env.JWT_SECRET || 'mysecret';
    const decoded = jwt.verify(token, secret) as any;
    const role = decoded.role || 'admin';

    const isAdmin = role === 'admin';
    const isTrainer = role === 'trainer';

    // Get current user info for profile display
    let currentUserName = '';
    let currentUserImage = '';
    if (isAdmin) {
      const user = await this.usersService.findByEmail(decoded.username);
      currentUserName = user?.fullName || decoded.username;
    } else if (isTrainer) {
      const trainer = await this.trainersService.findByEmail(decoded.username);
      currentUserName = trainer?.fullName || decoded.username;
      currentUserImage = (trainer as any)?.image || '';
    }

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.render('admin', {
      title: 'Wonder Kid Admin Panel',
      role,
      isAdmin,
      isTrainer,
      currentUserName,
      currentUserImage,
    });
  }

  @Get('/profile')
  async profile(@Req() req: express.Request, @Res() res: express.Response) {
    const token = req.cookies['auth_token'];
    const secret = process.env.JWT_SECRET || 'mysecret';
    const decoded = jwt.verify(token, secret) as any;
    const trainers = await this.trainersService.findAll();
    const tasks = [
      {
        title: 'Project Alpha Launch',
        description:
          'Finalize all pre-launch checklists, including marketing materials, server readiness, and user feedback integration.',
        shortDescription:
          'Finalize pre-launch checklists and integrate user feedback.',
        image: '/images/task1.jpg',
      },
      {
        title: 'Client Meeting Prep',
        description:
          'Prepare the quarterly performance report for the main client.',
        shortDescription:
          'Prepare quarterly performance report for the upcoming client meeting.',
        image: '/images/task2.jpg',
      },
      {
        title: 'Backend System Overhaul',
        description:
          'Initiate the full overhaul of the legacy backend system.',
        shortDescription:
          'Migrate legacy systems and implement new security protocols for the backend.',
        image: '/images/task3.jpg',
      },
    ];
    const student = await this.studentsService.findByEmail(decoded['username']);
    const members = await this.studentsService.findByGroupName(student ? student.groupName : '');

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.render('profile', {
      members,
      trainers,
      tasks,
      student,
      title: 'My Profile',
    });
  }
}
