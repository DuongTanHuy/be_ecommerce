import { SetMetadata } from '@nestjs/common'
import { AuthType, AuthTypeType, ConditionGuard, ConditionGuardType } from 'src/shared/constants/auth.constant'

export const AUTH_TYPE_KEY = 'authType'
export type AuthTypeDecoratorPayload = { authType: AuthTypeType[]; option: { condition: ConditionGuardType } }

export const Auth = (authType: AuthTypeType[], option?: { condition: ConditionGuardType }) => {
  return SetMetadata(AUTH_TYPE_KEY, { authType, option: option ?? { condition: ConditionGuard.And } })
}

export const IsPublic = () => Auth([AuthType.None])
