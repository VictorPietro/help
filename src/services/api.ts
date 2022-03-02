import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { signOut } from '../contexts/AuthContext';
import { AuthTokenError } from './errors/AuthTokenError';
import { InternalServerError } from './errors/InternalServerError';

import { constants } from '../utils/constants';

let isRefreshing = false;
// cria uma fila de requisições para refazê-las após o processo de geração do token
let failedRequestsQueue = [];

// essa separação para um setupAPIClient ocorreu para que seja possível que o código funcione tanto no server como client (através da passagem de contextos)
export function setupAPIClient(ctx = undefined) {
    let cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
        headers: {
            Authorization: `Bearer ${cookies['nextauth.token']}`
        }
    });

    api.interceptors.response.use(response => {
        return response;    // se deu certo, não faz nada
    }, (error: AxiosError) => {
        console.log(error)
        if ((error.code === 'ECONNREFUSED') || (error.response == undefined)) {
            return Promise.reject(new InternalServerError());
        }
        if (error.response.status === 401) {
            if (error.response.data?.code === 'token.expired') {
                // renew token
                cookies = parseCookies(ctx);

                const { 'nextauth.refresh_token': refresh_token } = cookies;
                const originalConfig = error.config;    // all original request configs

                if (!isRefreshing) {
                    isRefreshing = true;

                    api.post('/refresh-token', {
                        refresh_token,
                    }).then(response => {
                        const { token } = response.data;

                        setCookie(ctx, 'nextauth.token', token, {
                            maxAge: 60 * 60 * 24 * 30,  // 30 days
                            path: '/'
                        });

                        setCookie(ctx, 'nextauth.refresh_token', response.data.refresh_token, {
                            maxAge: 60 * 60 * 24 * 30,  // 30 days
                            path: '/'
                        });

                        api.defaults.headers['Authorization'] = `Bearer ${token}`;

                        // se deu tudo certo, pega a fila de requests falhadas e executa o onSucess de cada request
                        failedRequestsQueue.forEach(request => request.onSuccess(token));
                        failedRequestsQueue = [];
                    }).catch((err) => {
                        failedRequestsQueue.forEach(request => request.onSuccess(err));
                        failedRequestsQueue = [];

                        // executa somente se o código estiver sendo executado do lado do cliente (browser)
                        if (process.browser) {
                            signOut();
                        }
                    }).finally(() => {
                        isRefreshing = false
                    });
                }

                // cria uma fila para colocar as outras requisições
                return new Promise((resolve, reject) => {
                    failedRequestsQueue.push({
                        onSuccess: (token: string) => {  // resolve
                            originalConfig.headers['Authorization'] = `Bearer ${token}`;

                            resolve(api(originalConfig));
                        },
                        onFailure: (err: AxiosError) => {  // reject
                            reject(err);
                        }
                    });
                });
            } else { // logout user
                if (process.browser) {
                    signOut();
                } else {
                    return Promise.reject(new AuthTokenError());
                }
            }
        }

        if (error.response.status === 404) {
            return
        }

        if (error.response) {
            // client received an error response (5xx, 4xx)
            Notify.failure(error.response.data.message, constants.notiflix.notify);
        } else if (error.request) {
            // client never received a response, or request never left
            Notify.failure('Servidor indisponível.', constants.notiflix.notify);
        } else {
            // anything else
            Notify.failure('Erro interno.', constants.notiflix.notify);
        }

        return Promise.reject(error);
    });

    return api;
}