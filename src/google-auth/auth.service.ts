import {Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersGoogle } from './user.interfaces';
type UserData = {
  email: string;
  name: string;
  photo: string;
};

@Injectable() 
export class GoogleAuthService {
    constructor(@InjectModel("UsersGoogle") private userModule: Model<UsersGoogle>) {}
    // google/callback
    async validateUser(userData: UserData): Promise<any> {
      console.time('GoogleAuthService');
      const user = await this.userModule.findOne({ email: userData.email }); 
      if (user) {
        return user; 
      }
      console.log('User not found. Creating...');
      const newUser = new this.userModule({
        name: userData.name,
        email: userData.email,
        photo: userData.photo,
      });
      
      await newUser.save();
      return {
        message : "User created successfully:",
        data : newUser
      };
    }
}