import { UseCaseError } from '@/application/errors/use-case-errors';

export class EmailNotProvidedException extends UseCaseError {
  constructor() {
    super(`E-mail para pagamento não foi fornecido.`);
    this.name = 'EmailNotProvidedException';
  }
}
