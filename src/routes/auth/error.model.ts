import { UnprocessableEntityException } from '@nestjs/common'

export const InvalidOTPException = new UnprocessableEntityException([
  {
    message: 'Otp code is expired',
    path: 'code'
  }
])

export const UserIsExist = new UnprocessableEntityException([
  {
    message: 'Email already exist',
    path: 'email'
  }
])

export const UserNotFound = new UnprocessableEntityException([
  {
    message: 'User not found',
    path: 'email'
  }
])

export const PasswordIncorrect = new UnprocessableEntityException([
  {
    message: 'Password is incorrect',
    path: 'password'
  }
])

export const SendOtpFailed = new UnprocessableEntityException([
  {
    message: 'Send verification otp code failure',
    path: 'code'
  }
])

export const OptCodeInvalid = new UnprocessableEntityException([
  {
    message: 'Otp code is invalid',
    path: 'code'
  }
])

export const RefreshTokenInvalid = new UnprocessableEntityException([
  {
    message: 'Refresh token is invalid',
    path: 'refreshToken'
  }
])

export const GetGoogleInfoFailed = new UnprocessableEntityException([
  {
    message: "Can't get user info from Google",
    path: 'google'
  }
])
