// DTO - Data Transfer Object, para receber valores das rotas
interface ICreateUserDTO {
    id?: string;
    name: string;
    username: string;
    password: string;
    email: string;
    avatar?: string;
    bio?: string;
    google_id?: string;
}

export { ICreateUserDTO };
