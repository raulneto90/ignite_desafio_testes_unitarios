import { InMemoryUsersRepository } from "../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../useCases/authenticateUser/AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "../useCases/authenticateUser/IncorrectEmailOrPasswordError";
import { CreateUserUseCase } from "../useCases/createUser/CreateUserUseCase";

describe('AuthenticateUserUseCase', () => {
  let fakeUsersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let authenticateUserUseCase: AuthenticateUserUseCase;

  beforeEach(() => {
    fakeUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(fakeUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(fakeUsersRepository)
  })

  it('should be able to authenticate', async () => {
    const user = await createUserUseCase.execute({
      email: 'test@test.com.br',
      name: 'User test',
      password: '123456'
    })

    const userAuthenticated = await authenticateUserUseCase.execute({
      email: user.email,
      password: '123456'
    })

    expect(userAuthenticated).toHaveProperty('user')
    expect(userAuthenticated).toHaveProperty('token')
  })

  it('should not be able to authenticate with wrong e-mail', async () => {
    await createUserUseCase.execute({
      email: 'test@test.com.br',
      name: 'User test',
      password: '123456'
    })

    await expect(authenticateUserUseCase.execute({
      email: 'wrongEmail',
      password: '123456'
    })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const user = await createUserUseCase.execute({
      email: 'test@test.com.br',
      name: 'User test',
      password: '123456'
    })

    await expect(authenticateUserUseCase.execute({
      email: user.email,
      password: 'wrongPassword'
    })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
