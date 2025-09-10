import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { logger } from 'src/utils/logger';
import { timer } from 'src/utils/timer';

@Injectable()
export class HoroshopService {
  private apiUrl: string = `https://${process.env.DOMAIN}/api`;
  // async authAndUpload(allData: any[], importId: string, batchSize = 1000) {
  //   const token = await this.auth();
  //   logger.info({
  //     importId,
  //     stage: 'auth',
  //     message: `Токен успішно отримано`,
  //   });

  //   for (let i = 0; i < allData.length; i += batchSize) {
  //     const batch = allData.slice(i, i + batchSize);
  //     const batchIndex = Math.floor(i / batchSize) + 1;

  //     try {
  //       logger.info({
  //         importId,
  //         stage: 'upload',
  //         message: `Відправляємо батч ${batchIndex} з ${Math.ceil(allData.length / batchSize)}`,
  //       });

  //       const payload = { products: batch, token };
  //       timer('fetchData');
  //       const response = await axios.post(
  //         `${this.apiUrl}/catalog/import/`,
  //         payload,
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //             token: token,
  //           },
  //         },
  //       );
  //       timer('fetchData', true);
  //       logger.info({
  //         importId,
  //         stage: 'upload',
  //         message: `Батч ${batchIndex} успішно вивантажено`,
  //         details: { response: response.data },
  //       });
  //     } catch (error: any) {
  //       const safeError = {
  //         message: error.message,
  //         response: error.response?.data,
  //         status: error.response?.status,
  //         url: error.config?.url,
  //       };

  //       logger.error({
  //         importId,
  //         stage: 'upload',
  //         batch: batchIndex,
  //         error: safeError,
  //       });

  //       if (error.response?.status === 524) {
  //         logger.warn({
  //           importId,
  //           stage: 'upload',
  //           batch: batchIndex,
  //           message: 'Timeout 524 — спробуємо повторно через 5 секунд',
  //         });
  //         await new Promise((resolve) => setTimeout(resolve, 5000));
  //         i -= batchSize;
  //       }
  //     }
  //   }

  //   return { status: 'done', importId };
  // }

  async authAndUpload(allData: any[], importId: string, batchSize = 1000) {
    const token = await this.auth();
    logger.info({
      importId,
      stage: 'auth',
      message: `Токен успішно отримано`,
    });

    const batch = allData.slice(0, batchSize);

    try {
      logger.info({
        importId,
        stage: 'upload',
        message: `Відправляємо ${batch.length} товарів (один батч)`,
      });

      const payload = { products: batch, token };
      timer('fetchData');
      const response = await axios.post(
        `${this.apiUrl}/catalog/import/`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            token: token,
          },
        },
      );
      timer('fetchData', true);
      logger.info({
        importId,
        stage: 'upload',
        message: `Батч успішно вивантажено`,
        details: { response: response.data },
      });

      return response.data;
    } catch (error: any) {
      const safeError = {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
      };

      logger.error({
        importId,
        stage: 'upload',
        error: safeError,
      });

      throw error;
    }
  }

  async auth(): Promise<string> {
    try {
      const res = await axios.post(`${this.apiUrl}/auth`, {
        login: process.env.LOGIN,
        password: process.env.PASSWORD,
      });

      return res.data.response.token;
    } catch (error) {
      console.error('Auth error: ', error);
      throw error;
    }
  }
}
