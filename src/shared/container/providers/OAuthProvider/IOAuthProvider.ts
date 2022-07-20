interface IGoogleOAuthProvider {
    getGoogleAuthURL(type: string): string;
    getGoogleUser({ code: string }: any): any;
}

interface IAppleOAuthProvider {
    getAppleAuthURL(type: string): string;
    getAppleUser({ code: string }: any): any;
}

export { IGoogleOAuthProvider, IAppleOAuthProvider };
