import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { HoroshopService } from 'src/horoshop/horoshop.service';
import { logger } from 'src/utils/logger';
import { UploadService } from './upload.service';

const JSON_PATH = path.join(__dirname, '../../config/config.json');

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

  @Get('change')
  getChangePage(@Res() res: Response) {
    const config = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
    // Простий HTML
    res.send(`
      <form method="POST" action="/upload/change">
        <label>Ліміт кількості товарів:</label>
        <input type="number" name="limit" value="${config.limit}" min="0"/>
        <button type="submit">Зберегти</button>
      </form>
    `);
  }

  @Post('change')
  saveLimit(@Body() body: any, @Res() res: Response) {
    const limit = Number(body.limit);
    if (isNaN(limit) || limit < 0) {
      return res.send('Невірне значення');
    }
    const config = { limit };
    fs.writeFileSync(JSON_PATH, JSON.stringify(config, null, 2), 'utf-8');
    res.send('Значення збережено!');
  }
}
