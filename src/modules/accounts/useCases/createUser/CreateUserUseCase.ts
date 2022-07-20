import { inject, injectable } from "tsyringe";
import { hash } from "bcrypt";

import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

import { AppError } from "@shared/errors/AppError";

@injectable()
class CreateUserUseCase {
    constructor(
        // sempre que houver esse inject ele lê qual repository quer, vai até o /shared/container, identifica o nome e pega o singleton desse repositório
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
    ) { }

    async execute({ username, name, email, password, bio, google_id }: ICreateUserDTO): Promise<void> {

        let userAlreadyExists = await this.usersRepository.findByEmail(email);

        if (userAlreadyExists) {
            throw new AppError("User already exists!");
        } else {
            userAlreadyExists = await this.usersRepository.findByUsername(username);

            if (userAlreadyExists) {
                throw new AppError("Username already exists!");
            }
        }

        if (password.length < 8) {
            throw new AppError("Password must be at least 8 characters long!");
        }

        const passwordHash = await hash(password, 8);

        this.usersRepository.create({
            username,
            name,
            email,
            password: passwordHash,
            bio,
            google_id,
        });
    }
}

export { CreateUserUseCase }
