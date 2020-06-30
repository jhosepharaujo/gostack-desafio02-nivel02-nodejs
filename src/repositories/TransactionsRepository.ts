import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Response {
  transactions: Transaction[];
  balance: Balance;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = transactions
      .filter(({ type }) => type === 'income')
      .reduce((total, transaction) => total + transaction.value, 0);

    const outcome = transactions
      .filter(({ type }) => type === 'outcome')
      .reduce((total, transaction) => total + transaction.value, 0);

    const total = income - outcome;

    const balance: Balance = { income, outcome, total };

    return balance;
  }

  public async all(): Promise<Response> {
    const response: Response = {
      transactions: await this.find(),
      balance: await this.getBalance(),
    };

    return response;
  }
}

export default TransactionsRepository;
