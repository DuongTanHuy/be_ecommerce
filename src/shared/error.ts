import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export const NotFoundRecordException = new NotFoundException('Record is not found')

export const InvalidPasswordException = new UnprocessableEntityException([
  {
    message: 'Password is invalid',
    path: 'password'
  }
])
