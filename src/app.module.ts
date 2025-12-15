// src/app.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer'; // rakhte hain, par correct config ke saath
import { RabbitModule } from './rabbit/rabbit.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module'; 
import { AdminModule } from './admin/admin.module';
import { RootController } from './controllers/root.controller'; 
import { MailModule } from './mail/mail.module'; // ✅ Dedicated MailModule

@Module({
  imports: [
    RabbitModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false, // ✅ Brevo STARTTLS (587)
        auth: {
          user: process.env.SMTP_USER, // ✅ must be 'apikey'
          pass: process.env.SMTP_PASS, // ✅ Brevo API Key
        },
      },
      defaults: {
        from: `"AGNI" <${process.env.MAIL_FROM}>`, // ✅ verified sender
      },
    }),
    AuthModule, 
    AdminModule,
    MailModule, // ✅ Import dedicated MailModule for consistency
  ],
  controllers: [AppController,RootController],
  providers: [AppService],
})
export class AppModule {}
