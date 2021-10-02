import { InMemoryUsersRepository } from "../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "../useCases/createUser/CreateUserError";
import { CreateUserUseCase } from "../useCases/createUser/CreateUserUseCase";

describe('CreateUserUseCase', () => {
  let fakeUsersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    fakeUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(fakeUsersRepository)
  })

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      email: 'test@test.com.br',
      name: 'User test',
      password: '123456'
    })

    expect(user).toHaveProperty('id')

  })

  it('should not be able to create an user with same e-mail', async () => {
    await createUserUseCase.execute({
      email: 'test@test.com.br',
      name: 'User test',
      password: '123456'
    })

    await expect(createUserUseCase.execute({
      email: 'test@test.com.br',
      name: 'User test',
      password: '123456'
    })).rejects.toBeInstanceOf(CreateUserError)
  })
})
