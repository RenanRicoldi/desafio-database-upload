// import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

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
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    if (type === 'outcome') {
      const { total } = await transactionsRepository.getBalance();
      if (total - value < 0) {
        throw new AppError('Not enough money to finish transaction', 400);
      }
    }

    const categoryExists = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    let categoryId;

    if (categoryExists) {
      categoryId = categoryExists;
    } else {
      const categoryInst = await categoryRepository.create({ title: category });
      categoryId = await categoryRepository.save(categoryInst);
    }

    const transaction = await transactionsRepository.save({
      title,
      value,
      type,
      category: categoryId,
    });

    return transaction;
  }
}

export default CreateTransactionService;
