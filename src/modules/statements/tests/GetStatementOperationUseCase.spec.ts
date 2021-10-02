import { InMemoryUsersRepository } from "../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../entities/Statement";
import { InMemoryStatementsRepository } from "../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../useCases/createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "../useCases/getStatementOperation/GetStatementOperationError";
import { GetStatementOperationUseCase } from "../useCases/getStatementOperation/GetStatementOperationUseCase";

describe('GetStatementeOperationUseCase', () => {
  let fakeUsersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let fakeStatementsRepository: InMemoryStatementsRepository;
  let createStatementUseCase: CreateStatementUseCase;
  let getStatementOperationUseCase: GetStatementOperationUseCase;

  beforeEach(() => {
    fakeUsersRepository = new InMemoryUsersRepository();
    fakeStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(fakeUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(fakeUsersRepository,fakeStatementsRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(fakeUsersRepository,fakeStatementsRepository)
  })

  it('should be able to get a statement operation', async () => {
    const user = await createUserUseCase.execute({
      email: 'test@test.com.br',
      name: 'User test',
      password: '123456'
    })

    const userId = user.id as string;

    const newStatement = await createStatementUseCase.execute({user_id: userId, amount: 1500, description: 'Incoming salary', type: OperationType.DEPOSIT})

    const statementId = newStatement.id as string;

    const statement = await getStatementOperationUseCase.execute({user_id: userId, statement_id: statementId});

    expect(statement).toHaveProperty('id')
    expect(statement).toHaveProperty('user_id')
    expect(statement).toHaveProperty('amount')
    expect(statement).toHaveProperty('description')
    expect(statement).toHaveProperty('type')
    expect(statement.user_id).toBe(userId)
    expect(statement.amount).toBe(1500)
    expect(statement.description).toBe('Incoming salary')
    expect(statement.type).toBe(OperationType.DEPOSIT)
  })

  it('should not be able to get a statement operation from a unexistent user', async () => {
    const user = await createUserUseCase.execute({
      email: 'test@test.com.br',
      name: 'User test',
      password: '123456'
    })

    const userId = user.id as string;

    const newStatement = await createStatementUseCase.execute({user_id: userId, amount: 1500, description: 'Incoming salary', type: OperationType.DEPOSIT})

    const statementId = newStatement.id as string;

    await expect(getStatementOperationUseCase.execute({user_id: 'unexistentUser', statement_id: statementId})).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it('should not be able to get a unexistent statement operation', async () => {
    const user = await createUserUseCase.execute({
      email: 'test@test.com.br',
      name: 'User test',
      password: '123456'
    })

    const userId = user.id as string;

    await expect(getStatementOperationUseCase.execute({user_id: userId, statement_id: 'unexistentStatement'})).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})
