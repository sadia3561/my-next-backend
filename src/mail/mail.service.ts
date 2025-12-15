// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  // Send approved email
  async sendApprovedEmail(to: string, orgName: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Organization Approved - You Can Login Now',
        text: `Congratulations! Your organization "${orgName}" has been approved. You can now log in.`,
        html: `<p>Congratulations! Your organization <strong>${orgName}</strong> has been approved. You can now log in.</p>`,
      });
      console.log(`✅ Approval email sent to ${to}`);
    } catch (err) {
      console.error('❌ Mail sending failed:', err);
    }
  }

  // Optional: Uncomment / fix for pending approval
  /*
  async sendApprovalPendingEmail(to: string, orgName: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Organization Registration Pending Approval',
        text: `Your organization "${orgName}" account has been successfully registered. It is now pending admin approval. You will receive an email once your account is approved.`,
        html: `<p>Your organization <strong>${orgName}</strong> account has been successfully registered.</p>
<p>It is now pending admin approval. You will receive an email once your account is approved.</p>`,
      });
      console.log(`✅ Pending approval email sent to ${to}`);
    } catch (err) {
      console.error('❌ Mail sending failed:', err);
    }
  }
  */
}
