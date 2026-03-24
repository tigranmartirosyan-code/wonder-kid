import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { StudentsService } from '../students/students.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly studentsService: StudentsService) {
    super({
      clientID: process.env.FACEBOOK_APP_ID || '',
      clientSecret: process.env.FACEBOOK_APP_SECRET || '',
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3000/auth/facebook/callback',
      scope: ['email', 'public_profile'],
      profileFields: ['id', 'displayName', 'emails', 'photos'],
      graphAPIVersion: 'v19.0',
      enableProof: true,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any) => void,
  ): Promise<void> {
    try {
      const facebookId = profile.id;
      const fullName = profile.displayName || 'Facebook User';
      const email = profile.emails?.[0]?.value || `fb_${facebookId}@facebook.com`;
      const image = profile.photos?.[0]?.value || null;

      let student = await this.studentsService.findByFacebookId(facebookId);

      if (!student) {
        student = await this.studentsService.findByEmail(email);

        if (student) {
          await this.studentsService.update(student.id, { facebookId } as any);
        } else {
          const created = await this.studentsService.create({
            fullName,
            email,
            image,
            facebookId,
            password: null,
            age: 0,
            groupName: '',
            phones: '',
          } as any);
          student = Array.isArray(created) ? created[0] : created;
        }
      }

      done(null, student);
    } catch (err) {
      done(err, null);
    }
  }
}
