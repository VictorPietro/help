// DTO - Data Transfer Object, para receber valores das rotas
interface IUpdateUserDTO {
    user_id: string;
    username?: string;
    name?: string;
    password?: string;
    email?: string;
    avatar?: string;
    bio?: string;
}

export { IUpdateUserDTO };
