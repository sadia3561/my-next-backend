// src/kyc/dto/kyc-upload.dto.ts
export class UploadKycDto {
  userId: string;         // userId as string (Prisma User.id is string)
  documentType: string;   // e.g., 'PAN', 'LICENSE', etc.
}
