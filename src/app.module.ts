import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [ConfigModule.forRoot(),MongooseModule.forRoot('mongodb://localhost:27017/nest_js'),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '6000s' },
    }),
    AuthModule,
    MailerModule.forRoot({
      transport: {
        service:"gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      }
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
