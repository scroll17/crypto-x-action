/*external modules*/
import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';

@Injectable()
export class DataGenerateHelper {
  public randomNumber(min: number, max: number, len: number) {
    let result = '';

    for (let i = 0; i < len; i++) {
      result += Math.floor(min + Math.random() * (max - min));
    }

    return Number.parseInt(result, 10);
  }

  public randomHEX(len: number) {
    return crypto.randomBytes(len).toString('hex');
  }
}
