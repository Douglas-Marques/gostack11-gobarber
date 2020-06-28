import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface Request {
  user_id: string;
  name: string;
  email: string;
  oldPassword?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    oldPassword,
    password,
  }: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) throw new AppError('User not found!');

    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail && userWithSameEmail.id !== user_id)
      throw new AppError('Email already in use!');

    user.name = name;
    user.email = email;

    if (password && !oldPassword)
      throw new AppError('Need to inform old password!');

    if (password && oldPassword) {
      const checkOldPassword = await this.hashProvider.compareHash(
        oldPassword,
        user.password,
      );
      if (!checkOldPassword) throw new AppError('Wrong password!');
      user.password = await this.hashProvider.generateHash(password);
    }

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateProfileService;
