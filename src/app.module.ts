//src/app.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { RabbitModule } from './rabbit/rabbit.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module'; 
import { AdminModule } from './admin/admin.module';
import { RootController } from './controllers/root.controller'; 




@Module({
  imports: [
    RabbitModule,
    MailerModule.forRoot({
      transport: {
         host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // IMPORTANT for Brevo
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  },
  defaults: {
    from: '"No Reply" <no-reply@yourdomain.com>',
  },
}),
    AuthModule, 
    AdminModule,
  ],

  controllers: [AppController,RootController],
  providers: [AppService],
})

export class AppModule {}
