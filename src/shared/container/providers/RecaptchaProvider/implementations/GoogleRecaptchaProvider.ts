import axios from 'axios';

import { IGoogleRecaptchaProvider } from "../IRecaptchaProvider";

class GoogleRecaptchaProvider implements IGoogleRecaptchaProvider {
    async verify(recaptcha_response: string, type: string): Promise<boolean> {
        const params = new URLSearchParams();

        let secret = process.env.GOOGLE_RECAPTCHA_SECRET_CHALLENGE;

        switch (type) {
            case 'challenge':
                secret = process.env.GOOGLE_RECAPTCHA_SECRET_CHALLENGE;
                break;

            case 'invisible':
                secret = process.env.GOOGLE_RECAPTCHA_SECRET_INVISIBLE;
                break;

            default:
                secret = process.env.GOOGLE_RECAPTCHA_SECRET_CHALLENGE;
                break;
        }
        params.append("secret", secret);
        params.append("response", recaptcha_response);

        // Fetch the user's profile with the access token and bearer
        const verifyResult = await axios
            .post(
                `https://www.google.com/recaptcha/api/siteverify`,
                params,
            )
            .then(res => {
                if (!res.data?.success) {
                    return false;
                }
                return true;
            })
            .catch(error => {
                // console.log(error.message);
                return false;
            });

        return verifyResult;
    }
}

export { GoogleRecaptchaProvider };
