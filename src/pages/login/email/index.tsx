/* eslint-disable @next/next/link-passhref */
import Head from "next/head";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { useContext } from "react";

import { Button } from 'react-bootstrap';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

import styles from '../../user/styles.module.scss';
import { AuthContext } from "../../../contexts/AuthContext";
import { withSSRGuest } from "../../../utils/withSSRGuest";
import { Link } from "../../../components/Link";
import { constants } from '../../../utils/constants';

interface LoginEmailPageProps {
    setPrintHeader: any;
    loginToken: string;
}

export default function LoginEmailPage({ loginToken, setPrintHeader }: LoginEmailPageProps) {
    setPrintHeader(true);

    const router = useRouter();

    const { signIn, isAuthenticated } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(false);


    useEffect(() => {
        // redirect to home if already logged in
        if (isAuthenticated) {
            router.push('/user/pages');
        }

        (async () => {
            if (loading) {
                if (!fetching) {
                    handleLoginEmail();
                }
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router, isAuthenticated]);

    async function handleLoginEmail() {
        if (loginToken?.length <= 0) {
            Notify.failure('Token inválido.', constants.notiflix.notify);
            router.push('/login');
        } else {
            const data = {
                email: null,
                password: null,
                loginToken,
            }

            setFetching(true);
            await signIn(data);
            setLoading(false);
        }
    }

    return (
        <>
            <Head>
                <title>Login com E-mail | Lnk.App</title>
            </Head>

            <main className={styles.container}>
                <div className={`row ` + styles.pages}>
                    <div className="col-md-12">

                        {loading ?
                            <Loader
                                type="Puff"
                                color="#000000"
                                height={100}
                                width={100}
                            />
                            :
                            <div className="form-group">
                                <Link href={`/login`}>
                                    <Button size="lg" className={`w-25 mt-2 ${styles.button}`}>
                                        Voltar
                                    </Button>
                                </Link>
                            </div>
                        }
                    </div>
                </div>
            </main>
        </>
    );
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
    const { loginToken } = ctx.query;

    if (loginToken.length < 32) {
        return {
            // returns the default 404 page with a status code of 404
            notFound: true
        }
    }

    return {
        props: {
            loginToken,
        }
    }
});