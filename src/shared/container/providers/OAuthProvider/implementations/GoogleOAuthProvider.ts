import { google } from 'googleapis';
import axios from 'axios';

import { IGoogleOAuthProvider } from "../IOAuthProvider";

const oauth2Client = new google.auth.OAuth2(
    "253369728501-0si7shqb8ru8icq9im88lj1quvgd35mb.apps.googleusercontent.com",
    "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",
    "http://localhost:3333/oauth/google/callback"
);

class GoogleOAuthProvider implements IGoogleOAuthProvider {
    getGoogleAuthURL(type: string): string {
        //  Generate a url that asks permissions to the user's email and profile
        const scopes = [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ];

        return oauth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: scopes, // If you only need one scope you can pass it as string
            state: type,
        });
    }

    async getGoogleUser(code) {
        const { tokens } = await oauth2Client.getToken(code);

        // Fetch the user's profile with the access token and bearer
        const googleUser = await axios
            .get(
                `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokens.id_token}`,
                    },
                },
            )
            .then(res => res.data)
            .catch(error => {
                throw new Error(error.message);
            });

        return googleUser;
    }
}

export { GoogleOAuthProvider };
