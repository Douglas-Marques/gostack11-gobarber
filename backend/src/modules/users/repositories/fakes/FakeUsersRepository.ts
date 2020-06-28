import { uuid } from 'uuidv4';

import IUserRepository from '@modules/users/repositories/IUsersRepository';

import User from '@modules/users/infra/typeorm/entities/User';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

class UsersRepository implements IUserRepository {
  private users: User[] = [];

  public async findAllProviders(id: string): Promise<User[]> {
    if (id) return this.users.filter((user) => user.id !== id);
    else return this.users;
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find((user) => user.id === id);
    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find((user) => user.email === email);
    return findUser;
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const newUser = new User();
    Object.assign(newUser, { id: uuid(), name, email, password });
    this.users.push(newUser);
    return newUser;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex((u) => u.id === user.id);
    this.users[findIndex] = user;
    return user;
  }
}

export default UsersRepository;
