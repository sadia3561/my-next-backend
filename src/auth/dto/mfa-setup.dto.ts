import { IsNotEmpty, IsString } from 'class-validator';

export class MfaSetupDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  mfaType: 'sms' | 'email' | 'totp'; // which MFA method
}
