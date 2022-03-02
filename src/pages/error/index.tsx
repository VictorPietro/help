/* eslint-disable @next/next/link-passhref */
import Head from "next/head";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

import styles from '../user/styles.module.scss';
import { useEffect, useState } from "react";
import { withSSRGuest } from "../../utils/withSSRGuest";
import { Notify } from "notiflix";
import { constants } from "../../utils/constants";
import { useRouter } from "next/router";

interface ErrorPageProps {
    setPrintHeader: any;
}

export default function ErrorPage({ setPrintHeader }: ErrorPageProps) {
    setPrintHeader(true);

    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setLoading(false);
        Notify.failure('Erro interno. Por favor, tente novamente e, se o erro persistir, entre em contato.', constants.notiflix.notify);
        router.push('/');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Head>
                <title>Erro Interno | Lnk.App</title>
            </Head>

            <main className={styles.container}>
                <div className={`row ` + styles.pages}>
                    <div className="col-md-12">

                        {loading &&
                            <Loader
                                type="BallTriangle"
                                color="#000000"
                                height={100}
                                width={100}
                            />
                        }
                    </div>
                </div>
            </main>
        </>
    );
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
    return {
        props: {

        }
    }
});