import { UnprocessableEntityException } from '@nestjs/common'

export const LanguageNotFound = new UnprocessableEntityException({
  message: 'Language is not found',
  path: 'id'
})

export const LanguageExist = new UnprocessableEntityException([
  {
    message: 'Language this already exist',
    path: 'id'
  }
])
