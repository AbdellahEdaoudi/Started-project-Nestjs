import { Injectable, HttpException, HttpStatus, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto, SignInDto, SignUpDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordDto } from './dto/auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from './user.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) 
  private userModule: Model<User>,
  private jwtService: JwtService,
  private readonly emailService: MailerService
) {}

async signUp(SignUpDto: SignUpDto, res:any) {
  const existingUser = await this.userModule.findOne({ email: SignUpDto.email });
  if (existingUser) {
    throw new HttpException('User already exists', 400);
  }
  const saltOrRounds = 10;
  const password = await bcrypt.hash(SignUpDto.password, saltOrRounds);
  const newUser = await this.userModule.create({
    ...SignUpDto,
    password,
    role: 'user',
    active: true,
  });
  const payload = { _id: newUser._id, email: newUser.email, role: newUser.role };
  const accessToken = await this.jwtService.signAsync(payload, {
    secret: process.env.JWT_SECRET,
    expiresIn: '30m',
  });
  const refreshToken = await this.jwtService.signAsync(payload, {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '7d',
  });
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: 60 * 60 * 24 ,
  });
  return res.status(201).json({
    status: 201,
    message: 'User created successfully',
    access_token: accessToken,
  });
}


async signIn(SignInDto: SignInDto, res: any) {
  const user = await this.userModule.findOne({ email: SignInDto.email });
  if (!user) {
    throw new NotFoundException('User Not Found');
  }

  const passwordMatches = await bcrypt.compare(SignInDto.password, user.password);
  if (!passwordMatches) {
    throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST);
  }

  // Generate JWT Token
  const payload = { _id: user._id, email: user.email, role: user.role };
  const accessToken = await this.jwtService.signAsync(payload, { 
    secret: process.env.JWT_SECRET,
    expiresIn: '30m', // Expiry for access token
  });
  const refreshToken = await this.jwtService.signAsync(payload, { 
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '7d', // Expiry for refresh token
  });

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: 60 * 60 * 24 * 7,
  });

  return res.status(HttpStatus.OK).json({
    message: 'Login successful',
    access_token: accessToken
  });
}

async logout(req:any,res:any) {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    secure: process.env.NODE_ENV === 'production',
  });
  res.json({ message: 'Cookie cleared' });
}

  async refreshAccessToken(req) {
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) {
      throw new HttpException('Refresh token not found', 401);
    }
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const newAccessToken = await this.jwtService.signAsync(
        { _id: payload._id, email: payload.email, role: payload.role },
        { secret: process.env.JWT_SECRET, expiresIn: '30m' }
      );
  
      return { access_token: newAccessToken };
    } catch (error) {
      throw new HttpException('Invalid refresh token', 403);
    }
  }

  async resetPassword(ResetPasswordDto:ResetPasswordDto) {
    const user = await this.userModule.findOne({email:ResetPasswordDto.email});
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = await this.jwtService.signAsync({id:user._id},{
      secret:process.env.RESET_PASSWORD_TOKEN_SECRET,
      expiresIn: '30m'
    })
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
    this.emailService.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: `Reset Password`,
      html:`
      <p>
      Click the link below to reset your password:
      </p>
      <a href="${resetLink}">${resetLink}
      </a>`
    })
    return {
      status :200 ,
      message : `sent successfully`
    }
}

 async changePassword(ChangePasswordDto:ChangePasswordDto,req:any){
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    throw new UnauthorizedException()
  }
  const token = authorizationHeader.split(' ')[1];
  const decoded = await this.jwtService.verifyAsync(token,
    {
      secret: process.env.RESET_PASSWORD_TOKEN_SECRET
    }
  )
  const user = await this.userModule.findById(decoded.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  const hashedPassword = await bcrypt.hash(ChangePasswordDto.password, 10);
  user.password = hashedPassword;
  await user.save();
  return {
    status: 200,
    message: "Password has been reset successfully.",
  };

 }

}
