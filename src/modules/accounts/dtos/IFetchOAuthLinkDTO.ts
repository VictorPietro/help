// DTO - Data Transfer Object, para receber valores das rotas
interface IFetchOAuthLinkDTO {
    google?: any;
    apple?: any;
    type?: string;
}

export { IFetchOAuthLinkDTO };
