import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(),MongooseModule.forRoot('mongodb://localhost:27017/nest_js')],
  controllers: [],
  providers: [],
})
export class AppModule {}
