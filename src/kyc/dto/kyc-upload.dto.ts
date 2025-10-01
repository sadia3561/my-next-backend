import { IsNotEmpty, IsString } from 'class-validator';

export class KycUploadDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  documentType: string; // e.g. "GSTIN", "PAN", "License"

  @IsNotEmpty()
  @IsString()
  fileUrl: string; // presigned S3 URL
}
