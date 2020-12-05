import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const repository = await getCustomRepository(TransactionsRepository);
    const transactionExists = await repository.findOne({
      where: {
        id,
      },
    });

    if (transactionExists) {
      await repository.remove(transactionExists);
    } else {
      throw new AppError('no transactions found with the provided id', 400);
    }
  }
}

export default DeleteTransactionService;
