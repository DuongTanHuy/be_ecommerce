import { Injectable } from '@nestjs/common'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'
import { AuthRepository } from 'src/routes/auth/auth.repo'
import { AuthService } from 'src/routes/auth/auth.service'
import { GoogleAuthStateType } from 'src/routes/auth/entities/auth.entity'
import { GetGoogleInfoFailed } from 'src/routes/auth/auth.error'
import { RolesService } from 'src/routes/auth/roles.service'
import envConfig from 'src/shared/config'
import { SharedService } from 'src/shared/services/shared.service'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class GoogleService {
  private oAuth2Client: OAuth2Client

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly authService: AuthService,
    private readonly rolesService: RolesService,
    private readonly sharedService: SharedService
  ) {
    this.oAuth2Client = new google.auth.OAuth2(
      envConfig.GOOGLE_CLIENT_ID,
      envConfig.GOOGLE_CLIENT_SECRET,
      envConfig.GOOGLE_REDIRECT_URI
    )
  }

  generateAuthUrl({ userAgent, ip }: GoogleAuthStateType) {
    const scope = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']

    const stateString = Buffer.from(
      JSON.stringify({
        userAgent,
        ip
      })
    ).toString('base64')

    const url = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope,
      include_granted_scopes: true,
      state: stateString
    })

    return { url }
  }

  async googleCallback({ code, state }: { code: string; state: string }) {
    let userAgent = 'Unknown'
    let ip = 'Unknown'

    try {
      if (state) {
        const clientInfo = JSON.parse(Buffer.from(state, 'base64').toString()) as GoogleAuthStateType
        userAgent = clientInfo.userAgent
        ip = clientInfo.ip
      }
    } catch {
      /* empty */
    }

    const { tokens } = await this.oAuth2Client.getToken(code)
    this.oAuth2Client.setCredentials(tokens)

    const oauth2 = google.oauth2({
      auth: this.oAuth2Client,
      version: 'v2'
    })

    const { data } = await oauth2.userinfo.get()

    if (!data.email) {
      throw GetGoogleInfoFailed
    }

    let user = await this.authRepository.findUniqueUserIncludeRole({ email: data.email })

    if (!user) {
      const roleId = await this.rolesService.getClientRoleId()
      const randomPassword = uuidv4()
      const hashedPassword = await this.sharedService.hash(randomPassword)

      user = await this.authRepository.createUserIncludeRole({
        email: data.email,
        name: data.name ?? '',
        password: hashedPassword,
        phoneNumber: '',
        roleId,
        avatar: data?.picture ?? null
      })
    }

    const device = await this.authRepository.createDevice({
      userId: user.id,
      userAgent,
      ip
    })

    const userTokens = await this.authService.generateToken({
      userId: user.id,
      deviceId: device.id,
      roleId: user.roleId,
      roleName: user.role.name
    })

    return userTokens
  }
}
