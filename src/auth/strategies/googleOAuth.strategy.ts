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
      callbackURL:
        process.env.NODE_ENV === 'production'
          ? config.get('GOOGLE_CALLBACK_URL_VECERL') ||
            config.get('GOOGLE_CALLBACK_URL_RENDER')
          : config.get('GOOGLE_CALLBACK_URL_DEV'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { name, picture: image, email } = profile._json;
    const payload = { name, image, email, provider: profile.provider };
    return payload;
  }
}
