//src/auth/dto/register-Org.dto
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  MinLength,
  Matches,
  ValidateIf,
} from 'class-validator';

export class RegisterOrgDto {
  // -------- Step 1: KYC Details --------
  @IsNotEmpty()
  @IsString()
  orgName: string;

  @IsOptional()
  @IsString()
  gstin?: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  kycDoc?: any; // handled by multer or file upload middleware

  // -------- Step 2: Contact Details --------
  @IsNotEmpty()
  @IsString()
  contactName: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Matches(/^[6-9]\d{9}$/, { message: 'Phone number must be a valid 10-digit Indian mobile number' })
  phone: string;

  @ValidateIf((o) => o.otp !== undefined)
  @IsString()
  otp?: string;

  @IsOptional()
  @IsString()
  website?: string;

  // -------- Step 3: Business Profile --------
  @IsNotEmpty()
  @IsString()
  businessType: string;

  @IsNotEmpty()
  @IsString()
  experience: string;

  @IsOptional()
  licenseDoc?: any; // handled by multer

  @IsOptional()
  @IsString()
  description?: string;

  // -------- Step 4: Account Credentials --------
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsNotEmpty()
  @MinLength(8)
  confirmPassword: string;
}
