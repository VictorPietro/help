import axios from 'axios';

import { IAppleOAuthProvider } from '../IOAuthProvider';

class AppleOAuthProvider implements IAppleOAuthProvider {
    getAppleAuthURL(type: string): string {
        return '';
    }

    async getAppleUser(code) {
    }
}

export { AppleOAuthProvider };
