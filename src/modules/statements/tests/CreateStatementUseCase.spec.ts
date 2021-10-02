import { InMemoryUsersRepository } from "../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../entities/Statement";
import { InMemoryStatementsRepository } from "../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "../useCases/createStatement/CreateStatementError";
import { CreateStatementUseCase } from "../useCases/createStatement/CreateStatementUseCase";

describe('CreateStatementUseCase', () => {
  let fakeUsersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let fakeStatementsRepository: InMemoryStatementsRepository;
  let createStatementUseCase: CreateStatementUseCase;

  beforeEach(() => {
    fakeUsersRepository = new InMemoryUsersRepository();
    fakeStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(fakeUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(fakeUsersRepository,fakeStatementsRepository)
  })

  it('should be able to create a incoming statement', async () => {
    const user = await createUserUseCase.execute({
      email: 'test@test.com.br',
      name: 'User test',
      password: '123456'
    })

    const userId = user.id as string;

    const statement = await createStatementUseCase.execute({user_id: userId, amount: 1500, description: 'Incoming salary', type: OperationType.DEPOSIT})

    expect(statement).toHaveProperty('id')
  })

  it('should be able to create an outcoming statement', async () => {
    const user = await createUserUseCase.execute({
      email: 'test@test.com.br',
      name: 'User test',
      password: '123456'
    })

    const userId = user.id as string;

    await createStatementUseCase.execute({user_id: userId, amount: 1500, description: 'Incoming salary', type: OperationType.DEPOSIT})

    const statement = await createStatementUseCase.execute({user_id: userId, amount: 500, description: 'Phone bill', type: OperationType.WITHDRAW})

    expect(statement).toHaveProperty('id')
  })

  it('should not be able to create an outcoming statement with insuficient funds', async () => {
    const user = await createUserUseCase.execute({
      email: 'test@test.com.br',
      name: 'User test',
      password: '123456'
    })

    const userId = user.id as string;

    await expect(createStatementUseCase.execute({user_id: userId, amount: 500, description: 'Phone bill', type: OperationType.WITHDRAW})).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })

  it('should not be able to create a statement with unexistent user', async () => {
    await expect(createStatementUseCase.execute({user_id: 'unexistentUserId', amount: 500, description: 'Phone bill', type: OperationType.WITHDRAW})).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })
})
