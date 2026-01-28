// src/middleware/auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.auth_token; // expect token in cookie
    console.log(token,"middleware")
    if (!token) {
      return res.redirect('/login');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecret');
      (req as any).user = decoded; // attach user to request
      next();
    } catch (err) {
      return res.redirect('/login');
    }
  }
}
