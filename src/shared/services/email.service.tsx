import * as React from 'react'
import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'
import envConfig from 'src/shared/config'
import fs from 'fs'
import path from 'path'
import OtpEmail from 'emails/otp-email'
import { render } from '@react-email/components'

@Injectable()
export class EmailService {
  private resend: Resend
  private verificationOtpTemplate: string

  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY)
    this.verificationOtpTemplate = fs.readFileSync(path.resolve('src/templates/verification-otp.htm'), 'utf-8')
  }

  async sendOtp(payload: { email: string; code: string }) {
    const html = await render(<OtpEmail verificationCode={payload.code} title='Testing send email otp' />)

    return this.resend.emails.send({
      from: 'Ecommerce <onboarding@resend.dev>',
      //   to: [payload.email],
      to: ['huy236236@gmail.com'],
      subject: 'Verification OTP code',
      // html: this.verificationOtpTemplate.replace(/\[VERIFICATION_CODE\]/g, payload.code),
      // react: <OtpEmail verificationCode={payload.code} title='Testing send email otp' />
      html
    })
  }
}
