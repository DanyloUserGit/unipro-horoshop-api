import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { HoroshopService } from 'src/horoshop/horoshop.service';
import { logger } from 'src/utils/logger';

@Injectable()
export class UploadService {
  constructor(private readonly horoshopService: HoroshopService) {}

  async processJson(json: any) {
    try {
      const importId = new Date().toISOString();
      logger.info({
        importId,
        stage: 'getJson',
        message: `JSON успішно отримано`,
        details: { jsonLength: json.length },
      });

      const configPath = path.join(__dirname, '../../config/config.json');
      let limit = 0;
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        limit = Number(config.limit) || 0;
      }

      const groups = this.mapGroups(json.goodsgroups);

      const transformed = json.goods.map((good) => {
        const group = groups[good.group] || null;

        // 🔹 Конвертуємо кількість у число
        const qttyNum = Number(good.qtty);

        // 🔹 Якщо кількість не число або NaN — ставимо 0
        const realQty = isNaN(qttyNum) ? 0 : qttyNum;

        const isBelowLimit = realQty <= limit;
        const quantity = isBelowLimit ? 0 : realQty;

        return {
          article: good.code,
          title: { ua: good.namefull },
          price: good.p1,
          display_in_showcase: quantity > 0,
          presence: quantity > 0 ? 'у наявності' : 'немає в наявності',
          ...(group?.level === 2
            ? { parent: group.name }
            : group?.level === 1
              ? { parent: group.name }
              : {}),
          residues: [
            {
              warehouse: 'office',
              quantity,
            },
          ],
        };
      });

      logger.info({
        importId,
        stage: 'processJson',
        message: `JSON успішно трансформовано`,
        details: { totalGoods: transformed.length },
      });

      const dir = path.join(__dirname, '../../data');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const filePath = path.join(dir, 'data.json');
      fs.writeFileSync(filePath, JSON.stringify(transformed, null, 2), 'utf8');

      logger.info({
        importId,
        stage: 'authAndUpload',
        message: `Початок вивантаження на Хорошоп`,
      });
      logger.info(transformed[25]);
      await this.horoshopService.authAndUpload(transformed, importId);
    } catch (err) {
      throw err;
    }
  }

  private mapGroups(groups: any) {
    const map = {};
    const traverse = (arr: any) => {
      arr.forEach((g: any) => {
        map[g.guid] = g;
        if (g.children) traverse(g.children);
      });
    };
    traverse(groups);
    return map;
  }
}
