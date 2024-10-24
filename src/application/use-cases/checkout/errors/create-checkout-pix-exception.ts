import { UseCaseError } from '@/application/errors/use-case-errors';

export class CreateCheckoutPixException extends UseCaseError {
  constructor(err: any) {
    super(`Erro ao processar pagamento pix: ${err}.`);
    this.name = 'CreateCheckoutPixException';
  }
}
