// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    // TODO
    try {
      const transactionRepository = getCustomRepository(TransactionsRepository);
      await transactionRepository.delete(id);
    } catch (err) {
      throw new AppError('Error while deleting transaction.');
    }
  }
}

export default DeleteTransactionService;
