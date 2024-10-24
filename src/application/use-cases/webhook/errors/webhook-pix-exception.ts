import { UseCaseError } from '@/application/errors/use-case-errors';

export class WebhookPixException extends UseCaseError {
  constructor(err: any) {
    super(`Erro ao se comunicar com o webhook Pix: ${err}.`);
    this.name = 'WebhookPixException';
  }
}
