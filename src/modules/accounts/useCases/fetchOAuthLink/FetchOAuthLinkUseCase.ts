import { inject, injectable } from "tsyringe";
import { IFetchOAuthLinkDTO } from "@modules/accounts/dtos/IFetchOAuthLinkDTO";
import { IAppleOAuthProvider, IGoogleOAuthProvider } from "@shared/container/providers/OAuthProvider/IOAuthProvider";

@injectable()
class FetchOAuthLinkUseCase {
    constructor(
        @inject("GoogleOAuthProvider")
        private googleOAuthProvider: IGoogleOAuthProvider,
        @inject("AppleOAuthProvider")
        private appleOAuthProvider: IAppleOAuthProvider,
    ) { }

    async execute({ google, apple, type }: IFetchOAuthLinkDTO): Promise<any> {

        let links = {
            google: '',
            apple: '',
        };

        const googleIsSet = (google === undefined || google === null) ? false : true;
        google = googleIsSet ? google : false;

        if (google) {
            const googleURL = this.googleOAuthProvider.getGoogleAuthURL(type);

            links.google = googleURL;
        }

        const appleIsSet = (apple === undefined || apple === null) ? false : true;
        apple = appleIsSet ? apple : false;

        if (apple) {
            const appleURL = this.appleOAuthProvider.getAppleAuthURL(type);

            links.apple = appleURL;
        }

        return links;
    }
}

export { FetchOAuthLinkUseCase }
