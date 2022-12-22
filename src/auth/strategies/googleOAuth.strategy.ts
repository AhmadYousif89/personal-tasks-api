import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private config: ConfigService) {
    super({
      clientID: config.get('CLIENT_ID'),
      clientSecret: config.get('CLIENT_SECRET'),
      callbackURL: 'http://localhost:8520/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { name, picture: image, email } = profile._json;
    const payload = { name, image, email, provider: profile.provider };
    console.log('payload: ', payload);
    return payload;
  }
}
