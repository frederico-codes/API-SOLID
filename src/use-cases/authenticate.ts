import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";

interface AuthenticatedUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticatedUseCaseResponse {
  user: User;
}

export class AuthenticateUseCase{
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, password }: AuthenticatedUseCaseRequest): Promise<AuthenticatedUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, user.password_hash);
    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }  
    
    return {
      user,
    };
}
}


