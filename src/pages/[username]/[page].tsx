import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { Link } from "../../components/Link";
import { setupAPIClient } from "../../services/api";
import { api } from "../../services/apiClient";
import { toRN } from "../../utils/transformCSStoRN";

import styles from '../user/page/[page]/page.module.scss';

interface Page {
    title: string;
    description: string;
    image: string;
    updatedAt: string;
}

interface Theme {
    id: string;
    name: string;
    file: string;
    description: string;
    background_style: string;
    button_style: string;
    font_style: string;
}

interface Link {
    id: string;
    title: string;
    url: string;
    updatedAt: string;
}

interface User {
    username: string;
}

interface PublicPageProps {
    links: Link[];
    page: Page;
    theme: any;
    user: User;
    setPrintHeader: any;
    visitorCounter: boolean;
}

const handleLinkClick = async (link_id: string, visitorCounter: boolean) => {
    if (visitorCounter) {
        try {
            await api.post('links/increment', {
                link_id,
            });
        } catch (err) {
        }
    }
}

export default function PublicPage({ theme, links, page, setPrintHeader, visitorCounter }: PublicPageProps) {
    setPrintHeader(false);

    return (
        <>
            <Head>
                <title>Páginas | Lnk.App</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.page}>
                    <h1>{page?.title}</h1>
                    <div
                        className={styles.pageDescription} dangerouslySetInnerHTML={{ __html: page?.description }}
                    />
                </div>
                <div className="row">
                    <div className={styles.page}>
                        {links?.length ? links.map(link => (
                            <div key={link.id} className="col-md-12">
                                <Link href={`${link.url}`} onClick={() => handleLinkClick(link.id, visitorCounter)} target="_blank">
                                    <strong>{link.title}</strong>
                                    <p>{link.url}</p>
                                </Link>
                            </div>
                        )) : 'Vazio'}
                    </div>
                </div>
            </main>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { params } = ctx;
    const { addVisits } = ctx.query;

    let visitorCounter = true;
    if (addVisits && addVisits == 'false') {
        visitorCounter = false;
    }

    const slug = Array.isArray(params.page) ? params.page[0] : params.page

    // quando chamar a partir do servidor, chama o setupAPIClient passando o contexto
    const apiClient = setupAPIClient(ctx);

    try {
        const pageResponse = await apiClient.get('pages/single', {
            params: {
                page_url: slug
            }
        });

        // TODO check if page was found
        if (!(pageResponse.data.page)) {
            return {
                // returns the default 404 page with a status code of 404
                notFound: true
            }
        }

        // TODO check if page image exists
        const page = {
            title: pageResponse.data.page.title,
            description: pageResponse.data.page.description,
            image: pageResponse.data.page.image,
            updatedAt: new Date(pageResponse.data.page.updated_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }) + " às " + new Date(pageResponse.data.page.updated_at).getHours() + ":" + new Date(pageResponse.data.page.updated_at).getMinutes()
        }

        const theme: Theme = {
            id: pageResponse.data.theme.id,
            name: pageResponse.data.theme.name,
            file: pageResponse.data.theme.file,
            description: pageResponse.data.theme.description,
            background_style: toRN(pageResponse.data.theme.background_style),
            button_style: toRN(pageResponse.data.theme.button_style),
            font_style: toRN(pageResponse.data.theme.font_style),
        }

        const user = pageResponse.data.user;

        const response = await apiClient.get('links', {
            params: {
                page_id: pageResponse.data.page.id,
            }
        });

        const links = response.data.map(link => {
            console.log(link);
            return {
                id: link.id,
                title: link.title,
                url: link.url,
                updatedAt: new Date(link.updated_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                })
            }
        });

        return {
            props: {
                links,
                page,
                theme,
                user,
                visitorCounter,
            }
        }
    } catch (err) {
        return {
            props: {
            }
        }
    }
}