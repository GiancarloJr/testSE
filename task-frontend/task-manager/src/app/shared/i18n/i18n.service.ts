import { Injectable } from '@angular/core';
import { PT_BR_MESSAGES } from './pt-br.messages';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly messages = PT_BR_MESSAGES;

  t(key: string, params?: Record<string, string | number>): string {
    let message = this.messages[key] ?? key;

    if (params) {
      for (const [name, value] of Object.entries(params)) {
        message = message.replaceAll(`{{${name}}}`, String(value));
      }
    }

    return message;
  }
}
