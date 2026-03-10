import { prisma } from "@/lib/prisma";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UsersRepository } from "@/repositories/users-repository";
import bcrypt from 'bcryptjs';
const { hash } = bcrypt;
import { UserAlreadyExistsError } from "./errors/user-already-exists-erro";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

// solid

// D - Dependency Inversion Principle
export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError
    }

    const prismaUsersRepository = new PrismaUsersRepository();

    await prismaUsersRepository.create({
      name,
      email,
      password_hash,
    });
  }
}
