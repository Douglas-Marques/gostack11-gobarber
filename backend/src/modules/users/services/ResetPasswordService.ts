import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUsersTokensRepository from '@modules/users/repositories/IUsersTokensRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface Request {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokenRepository')
    private usersTokensProviders: IUsersTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: Request): Promise<void> {
    const userToken = await this.usersTokensProviders.findByToken(token);
    if (!userToken) throw new AppError('User token does not exist!');

    const user = await this.usersRepository.findById(userToken.user_id);
    if (!user) throw new AppError('User does not exist!');

    if (isAfter(Date.now(), addHours(userToken.created_at, 2)))
      throw new AppError('Token expired!');

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
