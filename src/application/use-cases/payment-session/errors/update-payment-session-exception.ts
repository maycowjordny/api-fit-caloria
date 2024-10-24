import { UseCaseError } from '@/application/errors/use-case-errors';

export class UpdatePaymentSessionException extends UseCaseError {
  constructor(err: any) {
    super(`Erro ao atualizar sessão de pagamento: ${err}.`);
    this.name = 'UpdatePaymentSessionException';
  }
}
