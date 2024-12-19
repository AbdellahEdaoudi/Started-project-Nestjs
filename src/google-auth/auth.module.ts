import { Module } from '@nestjs/common';
import { ClientHomePage, GoogleAuthController } from './auth.controller';
import { GoogleAuthService } from './auth.service';
import { GoogleAuthStrategy } from './startegy/google.startegy';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersGoogleSchema } from './user.schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: "UsersGoogle", schema: UsersGoogleSchema }])],
  controllers: [GoogleAuthController,ClientHomePage],
  providers:[GoogleAuthStrategy,GoogleAuthService]
})
export class GoogleAuthModule {}
