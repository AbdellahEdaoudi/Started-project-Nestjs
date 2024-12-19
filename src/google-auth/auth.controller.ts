import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {Response } from 'express';
import { GoogleAuthService } from './auth.service';

@Controller('auth')
export class GoogleAuthController {
  constructor(private readonly GoogleAuthService: GoogleAuthService) {}
       
      @Get('login')
      clientSideComponent(@Res() res: Response) {
        return res.send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login Page | OAuth</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: 'Roboto', Arial, sans-serif;
                background: radial-gradient(circle, #1e3c72, #2a5298);
                color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
              }
              .container {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
                text-align: center;
                max-width: 400px;
                width: 90%;
              }
              .container h1 {
                font-size: 2rem;
                margin-bottom: 20px;
              }
              .btn {
                background: linear-gradient(90deg, #ff7e5f, #feb47b);
                color: white;
                padding: 12px 20px;
                border: none;
                border-radius: 25px;
                font-size: 1rem;
                cursor: pointer;
                transition: transform 0.3s ease;
                margin-bottom: 20px;
                display: block;
                width: 100%;
              }
              .btn:hover {
                transform: scale(1.05);
              }
              form {
                display: flex;
                flex-direction: column;
                gap: 15px;
              }
              form input {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                padding: 12px;
                border-radius: 25px;
                font-size: 1rem;
                color: #fff;
                text-align: center;
                outline: none;
              }
              form input::placeholder {
                color: #ddd;
              }
              form input[type="submit"] {
                background: linear-gradient(90deg, #43cea2, #185a9d);
                color: white;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.3s ease;
              }
              form input[type="submit"]:hover {
                background: linear-gradient(90deg, #185a9d, #43cea2);
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Login to Your Account</h1>
              <button class="btn" onclick="window.location.href='http://localhost:3000/api/auth/google/login'">Login with Google</button>
              <form>
                <input type="email" placeholder="Enter your email" required />
                <input type="password" placeholder="Enter your password" required />
                <input type="submit" value="Login" />
              </form>
            </div>
          </body>
          </html>
          `);
          
      }
        

    // http://localhost:3000/api/auth/google/login
    @Get("google/login")
    @UseGuards(AuthGuard('google'))
    googleLogin(){
        return { msg: 'Google Authentication' };
    }

    // http://localhost:3000/api/auth/google/callback
    @Get("google/callback")
    @UseGuards(AuthGuard('google'))
    async googleCallBack(@Req() req: any, @Res() res: Response){
        const userObj = req.user as any;
        const user = {
          // userId: userObj.profile.id,
          name: userObj.profile.displayName,
          email: userObj.profile.emails[0].value,
          photo: userObj.profile.photos[0].value,
        };
        console.log('User data:', user);
        await this.GoogleAuthService.validateUser(user);
       return res.redirect(process.env.MAIN_CLIENT);
    }


    
}

@Controller('home')
export class ClientHomePage {
  @Get()
  homePage(@Res() res: Response) {
    return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome | Home</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Poppins', Arial, sans-serif;
              background: linear-gradient(120deg, #3498db, #8e44ad);
              color: #fff;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              overflow: hidden;
            }
            .container {
              text-align: center;
              max-width: 600px;
              padding: 40px;
              background: rgba(255, 255, 255, 0.15);
              border-radius: 15px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
              backdrop-filter: blur(10px);
            }
            h1 {
              font-size: 2.5rem;
              margin-bottom: 20px;
              font-weight: 700;
              text-transform: uppercase;
            }
            p {
              font-size: 1.2rem;
              margin-bottom: 30px;
              line-height: 1.6;
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              font-size: 1rem;
              color: #3498db;
              background: #fff;
              border-radius: 25px;
              text-decoration: none;
              font-weight: bold;
              transition: all 0.3s ease;
            }
            .button:hover {
              background: #f39c12;
              color: #fff;
              transform: translateY(-5px);
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to Our Home Page</h1>
            <p>We’re excited to have you here! Explore our features and make the most of your experience with us.</p>
            <a href="#" class="button">Get Started</a>
          </div>
        </body>
        </html>
      `);
  }
}


