import { Document } from 'mongoose';

export interface UsersGoogle extends Document {
  readonly name: string; 
  readonly email: string; 
  readonly photo: string;
}
