import Head from 'next/head';

import styles from '../user/styles.module.scss';
import { setupAPIClient } from '../../services/api';
import { Link } from "../../components/Link";
import { withSSRAuth } from "../../utils/withSSRAuth";

type Page = {
    title: string;
    description: string;
    url: string;
    updatedAt: string;
}

interface GetPublicPagesProps {
    pages?: [Page];
    user?: {
        username?: string;
        name?: string;
        id?: string;
        bio?: string;
        profile_title?: string;
        avatar?: string;
    }
    setPrintHeader: any;
    visitorCounterQP: string;
}

export default function PublicPages({ pages, user, setPrintHeader, visitorCounterQP }: GetPublicPagesProps) {
    setPrintHeader(false);

    return (
        <>
            <Head>
                <title>{(user?.username) ? user?.username : "Páginas"} | Lnk.App</title>
            </Head>

            <main className={styles.container}>
                {user?.username ?
                    <div className={`row ` + styles.pagesContainer}>
                        <div className={`col-md-12 text-center`}>
                            <img className={styles.userAvatar} alt="User Avatar" src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/users/avatar/${user.avatar}`} />
                            <h1 className="mt-4">{user?.profile_title ? user.profile_title : `Páginas de ${user?.name}`}</h1>
                            <h3>@{user?.username}</h3>
                            {user.bio ? <p>{user.bio}</p> : ''}
                        </div>

                        <div className={`col-md-12 mt-4 text-center`}>
                            {pages?.length ? pages.map(page => (
                                <Link key={page.url} href={`/${user.username}/${page.url}${visitorCounterQP}`} className={styles.pageList}>
                                    <time>{page.updatedAt}</time>
                                    <br />
                                    <strong>{page.title}</strong>
                                    <p>{page.description}</p>
                                </Link>
                            )) :
                                <h4 className="mt-4">O usuário não possui páginas.</h4>
                            }
                        </div>
                    </div>
                    :
                    'Usuário não encontrado'    // TODO redirect to 404
                }
            </main>
        </>
    );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    const { username } = ctx.params;
    const { addVisits } = ctx.query;

    let visitorCounterQP = '';
    if (addVisits && addVisits == 'false') {
        visitorCounterQP = '?addVisits=false';
    }

    // quando chamar a partir do servidor, chama o setupAPIClient passando o contexto
    const apiClient = setupAPIClient(ctx);

    // o try-catch está sendo feito dentro do withSSRAuth
    const response = await apiClient.get('pages', {
        params: {
            username,
            status: true,
            return_user: true,
        }
    });

    const { pages, user } = response.data;

    // TODO this 404 is not working
    if (!user) {
        return {
            notFound: true
        }
    }

    let pagesFormatted = [];

    pagesFormatted = pages?.map((page) => {
        const pageFormatted = {
            title: page.title,
            description: page.description,
            url: page.url,
            image: page.image,
            updatedAt: new Date(page.updated_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }) + " às " + new Date(page.updated_at).getHours() + ":" + new Date(page.updated_at).getMinutes()
        }

        return pageFormatted;
    });

    return {
        props: {
            pages: pagesFormatted,
            user,
            visitorCounterQP,
        }
    }
});