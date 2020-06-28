import 'reflect-metadata';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const showUser = await showProfileService.execute(user.id);

    expect(showUser.name).toBe('John Doe');
    expect(showUser.email).toBe('johndoe@example.com');
    +expect(showUser.password).toBe('123456');
  });

  it('should not be able to show profile with wrong id', async () => {
    await expect(
      showProfileService.execute('not-existing-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
