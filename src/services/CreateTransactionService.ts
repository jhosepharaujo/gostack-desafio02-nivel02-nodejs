// import AppError from '../errors/AppError';

import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Invalid type.');
    }

    if (type === 'outcome') {
      const { total } = await transactionRepository.getBalance();
      if (value > total) throw new AppError('Failed transaction. Not founds!');
    }

    const categoryRepository = getRepository(Category);

    let cat = await categoryRepository.findOne({ where: { title: category } });

    if (!cat) {
      const createdCategory = categoryRepository.create({
        title: category,
      });
      cat = await categoryRepository.save(createdCategory);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: cat.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
