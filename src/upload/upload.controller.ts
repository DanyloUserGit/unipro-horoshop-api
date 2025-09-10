import { Controller, Post, Body, Get } from '@nestjs/common';
import { UploadService } from './upload.service';
import { logger } from 'src/utils/logger';
import { HoroshopService } from 'src/horoshop/horoshop.service';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly horoshopService: HoroshopService,
  ) {}

  @Post()
  async receiveJson(@Body() body: any) {
    try {
      await this.uploadService.processJson(body);
      return { status: { code: 200, errortext: 'OK' } };
    } catch (err) {
      logger.error('Помилка при збереженні JSON:', err);
      return { status: { code: 1, errortext: err.message } };
    }
  }
  @Get()
  async getToken() {
    try {
      const token = await this.horoshopService.auth();
      console.log(token);
      return { token };
    } catch (error) {
      throw error;
    }
  }
}
