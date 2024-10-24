import { UseCaseError } from '@/application/errors/use-case-errors';

export class FindPaymentSessionBySessionIdException extends UseCaseError {
  constructor(err: any) {
    super(`Erro ao criar encontrar uma sessão de pagamento: ${err}.`);
    this.name = 'FindPaymentSessionBySessionIdException';
  }
}
