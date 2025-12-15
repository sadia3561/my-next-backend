// src/mail/mail.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),

        // 🔧 FIX 1: Brevo uses STARTTLS (587), not secure=true
        secure: Number(process.env.SMTP_PORT) === 465,

        auth: {
          // 🔧 FIX 2: Brevo SMTP USER must be 'apikey'
          // (old SMTP_EMAIL is NOT removed, just not used)
          user: process.env.SMTP_USER || 'apikey',

          // 🔧 FIX 3: Brevo API Key should be used as password
          pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD,
        },
      },

      defaults: {
        // 🔧 FIX 4: Use verified sender email explicitly
        // (fallback keeps backward compatibility)
        from: `"AGNI" <${
          process.env.MAIL_FROM || process.env.SMTP_EMAIL
        }>`,
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
