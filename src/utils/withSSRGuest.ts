// withSSRGuest é usado para páginas que só podem ser acessadas por visitantes (usuários não logados)

import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

// high order function - retorna uma função de dentro dessa função
export function withSSRGuest<P>(fn: GetServerSideProps<P>): GetServerSideProps {    // o <P> sinaliza que a tipagem será recebida da função superior
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);

        if (cookies['nextauth.token']) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                }
            }
        }

        try {
            return await fn(ctx);
        } catch (err) {
            return {
                redirect: {
                    destination: '/error',
                    permanent: false,
                }
            }
        }
    }
}