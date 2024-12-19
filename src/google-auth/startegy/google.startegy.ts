import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth2';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:process.env.GOOGLE_CALLBACK ,
      scope: ['profile', 'email'],
    });
  }
    async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user = {
      accessToken,
      profile,
    };
    return user;
  }
//   async validate(accessToken: string, refreshToken: string, profile: Profile) {
//     const { name, emails, photos } = profile;
//     const user = {
//       email: emails[0].value,
//       name: name.givenName,
//       profileImg: photos[0].value,
//     };
//     return user;
//   }
  


}