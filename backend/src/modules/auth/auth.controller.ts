import { Controller, Get, Post, Body, UseGuards, Req, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { OAuthCallbackDto } from './dtos/oauth-callback.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('oauth/meta/callback')
  async metaOAuthCallback(@Query('code') code: string, @Query('state') state: string) {
    return this.authService.handleMetaOAuthCallback(code, state);
  }

  @Get('oauth/tiktok/callback')
  async tiktokOAuthCallback(@Query('code') code: string, @Query('state') state: string) {
    return this.authService.handleTikTokOAuthCallback(code, state);
  }

  @Get('oauth/youtube/callback')
  async youtubeOAuthCallback(@Query('code') code: string, @Query('state') state: string) {
    return this.authService.handleYoutubeOAuthCallback(code, state);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() req) {
    return req.user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req) {
    // Pode implementar blacklist de tokens se necessário
    return { message: 'Logout realizado com sucesso' };
  }

  @Get('oauth/meta/url')
  async getMetaOAuthUrl() {
    return this.authService.getMetaOAuthUrl();
  }

  @Get('oauth/tiktok/url')
  async getTikTokOAuthUrl() {
    return this.authService.getTikTokOAuthUrl();
  }

  @Get('oauth/youtube/url')
  async getYoutubeOAuthUrl() {
    return this.authService.getYoutubeOAuthUrl();
  }
}
