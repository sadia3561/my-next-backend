//src/app.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { RabbitModule } from './rabbit/rabbit.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module'; 
import { AdminModule } from './admin/admin.module';



@Module({
  imports: [
    RabbitModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      defaults: { from: '"No Reply" <your-email@gmail.com>' },
    }),
    AuthModule, 
    AdminModule,
  ],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
