import { Body, Controller, Get, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto, SignInDto, SignUpDto } from './dto/auth.dto';
import { ResetPasswordDto } from './dto/auth.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/guard/roles.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Controller('auth')
export class AuthController {
  constructor(@InjectModel(User.name) 
    private userModule: Model<User>,
    private readonly authService: AuthService) {}
  //  Get All Users
  @Get()
  @UseGuards(AuthGuard)
  @Roles(['user'])
  async getAll(){
    return this.userModule.find()
  }
  // sign-up
  @Post('sign-up')
  signUp(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) SignUpDto:SignUpDto,@Res() res){
    return this.authService.signUp(SignUpDto,res);
  }
  // sign-in
  @Post('sign-in')
  signIn(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) SignInDto:SignInDto,@Res() res){
    return this.authService.signIn(SignInDto,res);
  }
  // logout
  @Post('logout')
  logout(@Req() req,@Res() res){
    return this.authService.logout(req,res)
  }
  // refreshAccessToken
  @Post('refreshAccessToken')
  refreshAccessToken(@Req() req){
    return this.authService.refreshAccessToken(req)
  }
  // reset-password
  @Post('reset-password')
  resetPassword(@Body(new ValidationPipe({forbidNonWhitelisted:true,whitelist:true})) ResetPasswordDto:ResetPasswordDto){
    return this.authService.resetPassword(ResetPasswordDto)
  }
  // changePassword
  @Post('changePassword')
  changePassword(@Body(new ValidationPipe({forbidNonWhitelisted:true,whitelist:true}))
   ChangePasswordDto:ChangePasswordDto,@Req() req){
    return this.authService.changePassword(ChangePasswordDto,req)
  }
  

}