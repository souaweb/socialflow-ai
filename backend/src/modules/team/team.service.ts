import { Injectable } from '@nestjs/common';
import { InviteTeamDto } from './dtos/invite-team.dto';

@Injectable()
export class TeamService {
  
  async getTeamMembers(businessId: string) {
    // Retorna todos os membros do time
    return {
      businessId,
      members: [
        {
          id: 'tm_001',
          email: 'admin@empresa.com',
          name: 'Admin Principal',
          role: 'admin',
          permissions: ['manage_all'],
          isActive: true,
          invitedAt: new Date('2025-01-01'),
          acceptedAt: new Date('2025-01-02'),
          lastLogin: new Date()
        },
        {
          id: 'tm_002',
          email: 'gerente@empresa.com',
          name: 'Gerente de Redes',
          role: 'manager',
          permissions: ['manage_posts', 'manage_chat', 'manage_automations'],
          isActive: true,
          invitedAt: new Date('2025-02-01'),
          acceptedAt: new Date('2025-02-03'),
          lastLogin: new Date('2026-01-25')
        },
        {
          id: 'tm_003',
          email: 'analista@empresa.com',
          name: 'Analista de Dados',
          role: 'analyst',
          permissions: ['view_reports', 'view_analytics'],
          isActive: true,
          invitedAt: new Date('2025-03-01'),
          acceptedAt: new Date('2025-03-05'),
          lastLogin: new Date('2026-01-20')
        }
      ],
      total: 3,
      activeCount: 3
    };
  }

  async inviteTeamMember(businessId: string, dto: InviteTeamDto) {
    // Envia convite para novo membro
    return {
      success: true,
      message: `Convite enviado para ${dto.email}`,
      member: {
        id: 'tm_' + Math.random().toString(36).substr(2, 9),
        email: dto.email,
        role: dto.role,
        permissions: dto.permissions || this.getDefaultPermissions(dto.role),
        isActive: false,
        invitedAt: new Date(),
        acceptedAt: null
      },
      inviteLink: `https://socialflow.com/accept-invite?token=invite_${Date.now()}`,
      expiresIn: '7 days'
    };
  }

  async updateTeamMember(
    businessId: string,
    memberId: string,
    role: string,
    permissions?: string[]
  ) {
    // Atualiza role e permissões do membro
    return {
      success: true,
      message: `Membro ${memberId} atualizado`,
      member: {
        id: memberId,
        role,
        permissions: permissions || this.getDefaultPermissions(role),
        updatedAt: new Date()
      }
    };
  }

  async removeTeamMember(businessId: string, memberId: string) {
    // Remove membro do time
    return {
      success: true,
      message: `Membro ${memberId} removido do time`,
      removedAt: new Date()
    };
  }

  async getAvailableRoles() {
    // Retorna roles disponíveis e suas permissões
    return [
      {
        role: 'admin',
        description: 'Controle total do negócio',
        permissions: [
          'manage_all',
          'manage_team',
          'manage_billing',
          'view_reports',
          'manage_settings'
        ]
      },
      {
        role: 'manager',
        description: 'Gerenciar posts, chats e automações',
        permissions: [
          'manage_posts',
          'manage_chat',
          'manage_automations',
          'manage_leads',
          'view_reports'
        ]
      },
      {
        role: 'analyst',
        description: 'Visualizar dados e relatórios',
        permissions: [
          'view_reports',
          'view_analytics',
          'view_leads',
          'view_posts'
        ]
      },
      {
        role: 'viewer',
        description: 'Apenas leitura',
        permissions: [
          'view_dashboard',
          'view_reports'
        ]
      }
    ];
  }

  async resendInvite(businessId: string, memberId: string) {
    // Reenvia convite para membro
    return {
      success: true,
      message: `Convite reenviado para o membro ${memberId}`,
      sentAt: new Date(),
      expiresIn: '7 days'
    };
  }

  private getDefaultPermissions(role: string): string[] {
    const permissionMap = {
      admin: ['manage_all', 'manage_team', 'manage_billing', 'view_reports'],
      manager: ['manage_posts', 'manage_chat', 'manage_automations', 'manage_leads', 'view_reports'],
      analyst: ['view_reports', 'view_analytics', 'view_leads'],
      viewer: ['view_dashboard', 'view_reports']
    };
    return permissionMap[role] || [];
  }
}
