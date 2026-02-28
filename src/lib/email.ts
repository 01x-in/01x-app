import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

// Default sender — update domain after verifying in Resend dashboard
export const EMAIL_FROM = '01X <hello@01x.in>'
