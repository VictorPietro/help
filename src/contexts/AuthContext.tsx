import Router from 'next/router';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { createContext, ReactNode, useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import { BroadcastChannel } from 'broadcast-channel';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { api } from '../services/apiClient';
import { constants } from '../utils/constants';

type User = {
    id?: string;
    email?: string;
    // permissions: string[];
    // roles: string[];
}

type SignInCredentials = {
    email: string;
    password: string;
    loginToken?: string;
}

type SignInOAuthCredentials = {
    token: string;
    refresh_token: string;
    redirectRoute?: string;
}

type AuthContextData = {
    signIn: (credentials: SignInCredentials) => Promise<boolean>;
    signOutFromClient: () => void;
    user: User;
    isAuthenticated: boolean;
    signInOAuth: (tokens: SignInOAuthCredentials) => Promise<void>;
};

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export function signOut(redirectRoute: string = '/login', fromClient = false) {
    // essa parte só funciona pelo lado do browser
    const context = fromClient ? {} : undefined;

    destroyCookie(context, 'nextauth.token', {
        path: '/'
    });
    destroyCookie(context, 'nextauth.refresh_token', {
        path: '/'
    });

    authChannel?.postMessage('signOut');

    Router.push(redirectRoute);
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>();
    const isAuthenticated = !!user; // basicamente verifica se user está vazio ou não

    useEffect(() => {
        authChannel = new BroadcastChannel('auth');

        authChannel.onmessage = (message) => {
            switch (message.data) {
                case 'signOut':
                    setUser(undefined);
                    // Router.push('/');
                    signOut();
                    authChannel.close();
                    break;
                case 'signIn':
                // window.location.replace(`${process.env.NEXT_PUBLIC_BASE_URL}/user/pages`);
                default:
                    break;
            }
        }
    }, []);

    useEffect(() => {
        const { 'nextauth.token': token } = parseCookies();

        if (token) {
            const decodedJwt = jwt.decode(token);

            if (!decodedJwt || !decodedJwt?.sub || decodedJwt == null || decodedJwt == undefined) {
                setUser(undefined);
                signOut();
            } else {
                setUser({
                    id: decodedJwt.sub,
                    email: decodedJwt.email,
                    // permissions,
                    // roles,
                });

                // api.get('/me').then(response => {
                //     const { id } = response.data;
                //     // const { id, permissions, roles } = response.data;

                //     setUser({ id });
                //     // setUser({ id, email, permissions, roles });
                // }).catch(error => {
                //     signOut();
                // });
            }
        } else {
            setUser(undefined);
        }
    }, []);

    async function signIn({ email, password, loginToken }: SignInCredentials): Promise<boolean> {
        try {
            let response = null;

            if (email && password && (email?.length > 0) && (password?.length > 0)) {
                response = await api.post('sessions', {
                    email,
                    password
                });
            } else {
                response = await api.post('sessions', {
                    loginToken
                });
            }

            // const { token, refresh_token, permissions, roles } = response.data;
            const { token, refresh_token } = response.data;

            // undefined se refere ao contexto. Quando o contexto for o browser (cliente), coloca-se undefined
            setCookie(undefined, 'nextauth.token', token, { // segundo parâmetro é o nome que se quer dar ao cookie
                maxAge: 60 * 60 * 24 * 30,  // 30 days - o frontend não precisa se preocupar com a expiração pois é o backend quem vai validar e gerar um novo quando expirar (i.e., no backend vai expirar muito mais rápido, mas também gerará um novo)
                path: '/'   // quando for um cookie global, coloca isso - qual caminho da aplicação poderá acessar o cookie
            });

            setCookie(undefined, 'nextauth.refresh_token', refresh_token, {
                maxAge: 60 * 60 * 24 * 30,  // 30 days
                path: '/'
            });

            // user_id = decodedJwt.sub
            const decodedJwt = jwt.decode(response.data.token)

            setUser({
                id: decodedJwt.sub,
                email: decodedJwt.email,
                // permissions,
                // roles,
            });

            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            Notify.info('Bem-vindo novamente!', constants.notiflix.notify);

            Router.push('/user/pages');
            authChannel.postMessage("signIn");

            return true;
        } catch (err) {
            // console.log('AuthError: ' + err);
            return false;
        }
    }

    async function signInOAuth({ token, refresh_token, redirectRoute }: SignInOAuthCredentials) {
        try {
            // user_id = decodedJwt.sub
            const decodedJwt = jwt.decode(token);

            if (!decodedJwt?.sub) {
                setUser(undefined);
                // authChannel.postMessage('signOut');
                Router.push(redirectRoute);
                Notify.failure('Não foi possível se autenticar utilizando o Google.', constants.notiflix.notify);
            } else {
                // undefined se refere ao contexto. Quando o contexto for o browser (cliente), coloca-se undefined
                setCookie(undefined, 'nextauth.token', token, { // segundo parâmetro é o nome que se quer dar ao cookie
                    maxAge: 60 * 60 * 24 * 30,  // 30 days - o frontend não precisa se preocupar com a expiração pois é o backend quem vai validar e gerar um novo quando expirar (i.e., no backend vai expirar muito mais rápido, mas também gerará um novo)
                    path: '/'   // quando for um cookie global, coloca isso - qual caminho da aplicação poderá acessar o cookie
                });

                setCookie(undefined, 'nextauth.refresh_token', refresh_token, {
                    maxAge: 60 * 60 * 24 * 30,  // 30 days
                    path: '/'
                });

                setUser({
                    id: decodedJwt.sub,
                    email: decodedJwt.email,
                    // permissions,
                    // roles,
                });

                api.defaults.headers['Authorization'] = `Bearer ${token}`;

                // Notify.info('Bem-vindo novamente!', constants.notiflix.notify);

                Router.push('/user/pages');
                authChannel.postMessage("signIn");
            }
        } catch (err) {
            // console.log('AuthError: ' + err);
        }
    }

    async function signOutFromClient() {
        setUser(undefined);
        signOut('/login', true);
    }

    return (
        <AuthContext.Provider value={{ signIn, signOutFromClient, isAuthenticated, user, signInOAuth }}>
            {children}
        </AuthContext.Provider>
    );
}