import { Resend } from 'resend'

let _resend: Resend | null = null

export function getResend(): Resend {
    if (!_resend) {
        _resend = new Resend(process.env.RESEND_API_KEY)
    }
    return _resend
}

// Default sender — update domain after verifying in Resend dashboard
export const EMAIL_FROM = '01X <hello@01x.in>'
