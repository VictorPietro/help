import { getRepository, Repository } from 'typeorm';

import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { User } from '../entities/User';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUpdateUserDTO } from '@modules/accounts/dtos/IUpdateUserDTO';

class UsersRepository implements IUsersRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = getRepository(User);
    }

    async create({ username, name, email, password, avatar, id, bio, google_id }: ICreateUserDTO): Promise<User> {
        username = username.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

        const user = this.repository.create({
            username,
            name,
            email,
            password,
            avatar,
            id,
            bio,
            google_id,
        });

        await this.repository.save(user);

        delete user.password;

        return user;
    }

    async update({
        user_id,
        username,
        name,
        email,
        password,
        bio,
    }: IUpdateUserDTO): Promise<User> {
        const user = await this.repository.findOne(user_id);

        user.username = username ? username : user.username.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
        user.name = name ? name : user.name;
        user.email = email ? email : user.email;
        user.password = password ? password : user.password;
        user.bio = bio ? bio : user.bio;

        await this.repository.save(user);

        return user;
    }

    async findByEmail(email: string, hide_password: boolean = false): Promise<User> {
        const user = await this.repository.findOne({ email });

        if (hide_password && user) {
            delete user.password;
        }

        return user;
    }

    async findById(id: string, hide_password: boolean = false): Promise<User> {
        const user = await this.repository.findOne(id);

        if (hide_password && user) {
            delete user.password;
        }

        return user;
    }

    async findByUsername(username: string, hide_password: boolean = false): Promise<User> {
        const user = await this.repository.findOne({ username });

        if (hide_password && user) {
            delete user.password;
        }

        return user;
    }

    async findByOAuthId(id: string, type: string): Promise<User> {
        let user = null;

        switch (type) {
            case 'google':
                user = await this.repository.findOne({ google_id: id });
                break;

            default:
                break;
        }

        return user;
    }

    // async list(): Promise<User[]> {
    //     const users = await this.repository.find();

    //     return users;
    // }
}

export { UsersRepository }
