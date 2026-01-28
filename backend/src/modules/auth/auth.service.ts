import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import axios from 'axios';

import { User } from './entities/user.entity';
import { ConnectedAccount } from './entities/connected-account.entity';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(ConnectedAccount) private accountRepository: Repository<ConnectedAccount>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email já registrado');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.userRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      password_hash: hashedPassword,
    });

    await this.userRepository.save(user);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      access_token: this.jwtService.sign({ sub: user.id, email: user.email }),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      access_token: this.jwtService.sign({ sub: user.id, email: user.email }),
    };
  }

  // OAuth2 - Meta (Facebook/Instagram/WhatsApp)
  getMetaOAuthUrl() {
    const state = crypto.randomBytes(16).toString('hex');
    // Guardar state no Redis para validação depois
    const params = new URLSearchParams({
      client_id: process.env.META_APP_ID,
      redirect_uri: `${process.env.BACKEND_URL}/auth/oauth/meta/callback`,
      state,
      scope: 'instagram_business_management,pages_manage_metadata,instagram_manage_messages,whatsapp_business_messaging,whatsapp_business_management',
      response_type: 'code',
    });

    return {
      url: `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`,
      state,
    };
  }

  async handleMetaOAuthCallback(code: string, state: string) {
    try {
      // Validar state
      // ... (implementar validação com Redis)

      // Trocar código por token
      const tokenResponse = await axios.post('https://graph.instagram.com/v18.0/oauth/access_token', {
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        redirect_uri: `${process.env.BACKEND_URL}/auth/oauth/meta/callback`,
        code,
      });

      const { access_token, user_id } = tokenResponse.data;

      // Buscar informações do usuário
      const userInfo = await axios.get(
        `https://graph.instagram.com/v18.0/${user_id}?fields=id,name,email&access_token=${access_token}`,
      );

      // Criar ou atualizar usuário
      let user = await this.userRepository.findOne({
        where: { email: userInfo.data.email },
      });

      if (!user) {
        user = this.userRepository.create({
          email: userInfo.data.email,
          name: userInfo.data.name,
        });
        await this.userRepository.save(user);
      }

      // Salvar conta conectada
      const account = this.accountRepository.create({
        user_id: user.id,
        platform: 'instagram',
        platform_account_id: user_id,
        access_token,
        business_name: userInfo.data.name,
      });

      await this.accountRepository.save(account);

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        access_token: this.jwtService.sign({ sub: user.id, email: user.email }),
      };
    } catch (error) {
      throw new BadRequestException('Erro ao conectar com Meta: ' + error.message);
    }
  }

  // OAuth2 - TikTok
  getTikTokOAuthUrl() {
    const state = crypto.randomBytes(16).toString('hex');
    const params = new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY,
      response_type: 'code',
      scope: 'user.info.basic,video.list,comment.read',
      redirect_uri: `${process.env.BACKEND_URL}/auth/oauth/tiktok/callback`,
      state,
    });

    return {
      url: `https://www.tiktok.com/v2/oauth/authorize?${params.toString()}`,
      state,
    };
  }

  async handleTikTokOAuthCallback(code: string, state: string) {
    try {
      const tokenResponse = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', {
        client_key: process.env.TIKTOK_CLIENT_KEY,
        client_secret: process.env.TIKTOK_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.BACKEND_URL}/auth/oauth/tiktok/callback`,
      });

      const { access_token, open_id } = tokenResponse.data.data;

      // Aqui você faria buscar informações do usuário TikTok
      // Por enquanto, vamos retornar o token

      return {
        platform: 'tiktok',
        open_id,
        access_token,
      };
    } catch (error) {
      throw new BadRequestException('Erro ao conectar com TikTok: ' + error.message);
    }
  }

  // OAuth2 - YouTube
  getYoutubeOAuthUrl() {
    const state = crypto.randomBytes(16).toString('hex');
    const params = new URLSearchParams({
      client_id: process.env.YOUTUBE_CLIENT_ID,
      redirect_uri: `${process.env.BACKEND_URL}/auth/oauth/youtube/callback`,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
      access_type: 'offline',
      state,
    });

    return {
      url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
      state,
    };
  }

  async handleYoutubeOAuthCallback(code: string, state: string) {
    try {
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: process.env.YOUTUBE_CLIENT_ID,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.BACKEND_URL}/auth/oauth/youtube/callback`,
      });

      const { access_token, refresh_token } = tokenResponse.data;

      // Buscar informações do canal
      const channelInfo = await axios.get(
        'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&access_token=' + access_token,
      );

      return {
        platform: 'youtube',
        access_token,
        refresh_token,
        channel: channelInfo.data.items[0],
      };
    } catch (error) {
      throw new BadRequestException('Erro ao conectar com YouTube: ' + error.message);
    }
  }
}
