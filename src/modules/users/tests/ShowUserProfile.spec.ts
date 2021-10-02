import { InMemoryUsersRepository } from "../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../useCases/createUser/CreateUserUseCase";
import { ShowUserProfileError } from "../useCases/showUserProfile/ShowUserProfileError";
import { ShowUserProfileUseCase } from "../useCases/showUserProfile/ShowUserProfileUseCase";

describe('ShowUserProfileUseCase', () => {
  let fakeUsersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let showUserProfileUseCase: ShowUserProfileUseCase;

  beforeEach(() => {
    fakeUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(fakeUsersRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(fakeUsersRepository)
  })

  it('should be able to show profile from user', async () => {
    const user = await createUserUseCase.execute({
      email: 'test@test.com.br',
      name: 'User test',
      password: '123456'
    })

    const userId = user.id as string;

    const profile = await showUserProfileUseCase.execute(userId);

    expect(profile).toHaveProperty('id')
    expect(profile).toHaveProperty('email')
    expect(profile).toHaveProperty('name')
    expect(profile).toHaveProperty('password')
    expect(profile.email).toBe('test@test.com.br')
    expect(profile.name).toBe('User test')
  })

  it('should be able to show profile from user', async () => {
    await expect(showUserProfileUseCase.execute('someId')).rejects.toBeInstanceOf(ShowUserProfileError);
  })
})
