import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { User } from "@prisma/client";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

<<<<<<< HEAD
  async execute({ name, email,  password }: RegisterUseCaseRequest) : Promise<RegisterUseCaseResponse> {

=======
  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
>>>>>>> f50d614 (Caso de uso de autenticação, Testes e controller de autenticação, Refatorando instâncias nos testes)
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

<<<<<<< HEAD
    const  user = await this.usersRepository.create({ name, email, password_hash });
    
    return{ 
      user
=======
    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return {
      user,
>>>>>>> f50d614 (Caso de uso de autenticação, Testes e controller de autenticação, Refatorando instâncias nos testes)
    };
  }
}
