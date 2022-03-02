// withSSRAuth é usado para páginas que precisam de um usuário logado
// o redirecionamento e verificação de autenticação devem ser feitos assim pois se usar useEffect e o usuário desabilitar o JS, ele conseguirá ver parte da interface

import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenError";

export function withSSRAuth<P>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);
        const token = cookies['nextauth.token'];

        if (!token) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                }
            }
        }

        try {
            return await fn(ctx);
        } catch (err) {
            if (err instanceof AuthTokenError) {
                destroyCookie(ctx, 'nextauth.token');
                destroyCookie(ctx, 'nextauth.refresh_token');

                // TODO set session error message and sign out
                return {
                    redirect: {
                        destination: '/',
                        permanent: false,
                    }
                }
            }

            // TODO fix this quickfix
            return {
                props: {

                }
            }
        }
    }
}