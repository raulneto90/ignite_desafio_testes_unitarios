import { InMemoryUsersRepository } from "../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../entities/Statement";
import { InMemoryStatementsRepository } from "../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../useCases/createStatement/CreateStatementUseCase";
import { GetBalanceError } from "../useCases/getBalance/GetBalanceError";
import { GetBalanceUseCase } from "../useCases/getBalance/GetBalanceUseCase";

describe('GetBalanceUseCase', () => {
  let fakeUsersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let fakeStatementsRepository: InMemoryStatementsRepository;
  let createStatementUseCase: CreateStatementUseCase;
  let getBalanceUseCase: GetBalanceUseCase;

  beforeEach(() => {
    fakeUsersRepository = new InMemoryUsersRepository();
    fakeStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(fakeUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(fakeUsersRepository,fakeStatementsRepository)
    getBalanceUseCase = new GetBalanceUseCase(fakeStatementsRepository, fakeUsersRepository)
  })

  it('should be able to get balance', async () => {
    const user = await createUserUseCase.execute({
      email: 'test@test.com.br',
      name: 'User test',
      password: '123456'
    })

    const userId = user.id as string;

    await createStatementUseCase.execute({user_id: userId, amount: 1500, description: 'Incoming salary', type: OperationType.DEPOSIT})
    await createStatementUseCase.execute({user_id: userId, amount: 200, description: 'Light bill', type: OperationType.WITHDRAW})

    const balance = await getBalanceUseCase.execute({user_id: userId})

    expect(balance).toHaveProperty('statement')
    expect(balance).toHaveProperty('balance')

  })

  it('should not be able to get balance from an unexistent user', async () => {
    const user = await createUserUseCase.execute({
      email: 'test@test.com.br',
      name: 'User test',
      password: '123456'
    })

    const userId = user.id as string;

    await createStatementUseCase.execute({user_id: userId, amount: 1500, description: 'Incoming salary', type: OperationType.DEPOSIT})
    await createStatementUseCase.execute({user_id: userId, amount: 200, description: 'Light bill', type: OperationType.WITHDRAW})

    await expect(getBalanceUseCase.execute({user_id: 'unexistentUser'})).rejects.toBeInstanceOf(GetBalanceError)
  })
})
