import { Injectable } from '@nestjs/common'
import { AuthRepository } from 'src/routes/auth/auth.repo'

@Injectable()
export class RolesService {
  private clientRoleId: number | null = null

  constructor(private readonly authRepository: AuthRepository) {}

  async getClientRoleId() {
    if (this.clientRoleId) {
      return this.clientRoleId
    }
    const role = await this.authRepository.getClientRoleId()

    this.clientRoleId = role.id

    return role.id
  }
}
