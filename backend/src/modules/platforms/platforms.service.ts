import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConnectedAccount } from '../auth/entities/connected-account.entity';

@Injectable()
export class PlatformsService {
  constructor(
    @InjectRepository(ConnectedAccount) private accountRepository: Repository<ConnectedAccount>,
  ) {}

  async getConnectedPlatforms(userId: string) {
    return this.accountRepository.find({
      where: { user_id: userId },
    });
  }

  async disconnectPlatform(userId: string, accountId: string) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId, user_id: userId },
    });

    if (!account) {
      throw new Error('Conta não encontrada');
    }

    await this.accountRepository.remove(account);
    return { message: 'Conta desconectada com sucesso' };
  }

  async getAccountByPlatform(userId: string, platform: string) {
    return this.accountRepository.findOne({
      where: { user_id: userId, platform },
    });
  }

  async getAllAccountsOfUser(userId: string) {
    return this.accountRepository.find({
      where: { user_id: userId },
    });
  }
}
