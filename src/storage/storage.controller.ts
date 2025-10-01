import { Controller, Post, Body } from '@nestjs/common';
import { StorageService } from './storage.service';

@Controller('api/storage')
export class StorageController {
  constructor(private readonly storage: StorageService) {}

  @Post('presign')
  async presign(@Body() body: { key: string; contentType: string }) {
    const url = await this.storage.getPresignedUrl(body.key, body.contentType);
    return { url, key: body.key };
  }
}
