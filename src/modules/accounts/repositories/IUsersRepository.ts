import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { IUpdateUserDTO } from "../dtos/IUpdateUserDTO";
import { User } from "../infra/typeorm/entities/User";

interface IUsersRepository {
    create(data: ICreateUserDTO): Promise<User>;
    findByEmail(email: string, hide_password?: boolean): Promise<User>;
    findByUsername(username: string, hide_password?: boolean): Promise<User>;
    findById(id: string, hide_password?: boolean): Promise<User>;
    findByOAuthId(id: string, oAuth: string): Promise<User>;
    update(data: IUpdateUserDTO): Promise<User>;
    // list(): Promise<User[]>;
}

export { IUsersRepository };
