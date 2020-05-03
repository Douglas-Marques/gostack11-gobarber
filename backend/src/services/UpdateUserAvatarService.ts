import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import uploadConfig from '../config/upload';
import User from '../models/User';

interface Request {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) throw Error('Only authenticated users can change avatar!');

    if (user.avatar) {
      const userAvarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarExists = await fs.promises.stat(userAvarFilePath);

      if (userAvatarExists) await fs.promises.unlink(userAvarFilePath);
    }

    user.avatar = avatarFileName;

    await usersRepository.save(user);

    delete user.password;

    return user;
  }
}

export default UpdateUserAvatarService;
