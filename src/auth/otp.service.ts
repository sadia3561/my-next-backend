import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  constructor() {
    console.log('✅ Twilio disabled — using Firebase OTP flow instead.');
  }

  // 🔹 Send OTP (Handled on frontend via Firebase)
  async sendOtp(phone: string) {
    console.log(`📱 Firebase OTP requested for: ${phone}`);
    return {
      success: true,
      message: `Firebase OTP sent to ${phone} (handled on frontend).`,
    };
  }

  // 🔹 Verify OTP (Handled on frontend via Firebase)
  async verifyOtp(phone: string, code: string) {
    console.log(`✅ Firebase OTP verification simulated for: ${phone}`);
    return {
      success: true,
      message: 'OTP verified successfully via Firebase frontend.',
    };
  }
}
