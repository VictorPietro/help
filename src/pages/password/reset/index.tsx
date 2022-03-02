/* eslint-disable @next/next/link-passhref */
import Head from "next/head";
import { useRouter } from "next/dist/client/router";
import { FormEvent, useEffect, useState } from "react";
import { useContext } from "react";

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'react-bootstrap';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

import styles from '../../user/styles.module.scss';
import { AuthContext } from "../../../contexts/AuthContext";
import { withSSRGuest } from "../../../utils/withSSRGuest";
import { Link } from "../../../components/Link";
import { setupAPIClient } from "../../../services/api";
import { constants } from '../../../utils/constants';
import { api } from "../../../services/apiClient";

type ResetPasswordPageFormData = {
    password: string;
    passwordConfirm: string;
};

const createPageFormSchema = yup.object().shape({
    password: yup.string().required('Senha obrigatória').min(8, 'No mínimo 8 caracteres'),
    passwordConfirm: yup.string()
        .required('Confirme a senha')
        .oneOf([yup.ref('password'), null], 'As senhas devem ser iguais')
});

interface ResetPasswordPageProps {
    setPrintHeader: any;
    oAuthToken?: string;
    oAuthRefreshToken?: string;
    passToken: string;
}

export default function ResetPasswordPage({ passToken, setPrintHeader, oAuthToken, oAuthRefreshToken }: ResetPasswordPageProps) {
    setPrintHeader(true);

    const router = useRouter();

    const { isAuthenticated, signInOAuth } = useContext(AuthContext);
    const [loading, setLoading] = useState((oAuthToken || oAuthRefreshToken) ? true : false);

    useEffect(() => {
        // redirect to home if already logged in
        if (isAuthenticated) {
            router.push('/user/pages');
        }

        (async () => {
            if (oAuthToken && oAuthRefreshToken) {
                await signInOAuth({ token: oAuthToken, refresh_token: oAuthRefreshToken, redirectRoute: '/login' });
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router, isAuthenticated]);

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(createPageFormSchema)
    });
    const { errors } = formState;

    async function mySubmit(e: FormEvent) {
        e.preventDefault();

        await handleSubmit(handleResetPassword)(e);
    }

    async function handleResetPassword({ password, passwordConfirm }: ResetPasswordPageFormData) {
        await api.post('password/reset', {
            password,
            token: passToken,
        });

        Notify.info('Senha alterada com sucesso - prossiga para o login.', constants.notiflix.notify);
        setLoading(true);
        router.push('/login');
    }

    return (
        <>
            <Head>
                <title>Redefinir Senha | Lnk.App</title>
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
                            <form onSubmit={mySubmit}>
                                <div className="form-group">
                                    <label>Senha</label>
                                    <input name="password" type="text" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                                    <div className="invalid-feedback">{errors.password?.message}</div>
                                </div>
                                <div className="form-group">
                                    <label>Confirme a Senha</label>
                                    <input name="passwordConfirm" type="password" {...register('passwordConfirm')} className={`form-control ${errors.passwordConfirm ? 'is-invalid' : ''}`} />
                                    <div className="invalid-feedback">{errors.passwordConfirm?.message}</div>
                                </div>

                                <div className="form-group">
                                    <Button type="submit" disabled={formState.isSubmitting} size="lg" className={`w-25 mt-2 ${styles.button}`}>
                                        {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                        Redefinir Senha
                                    </Button>
                                    <Link href={`/login`}>
                                        <Button size="lg" className={`w-25 mt-2 ${styles.button}`}>
                                            Voltar
                                        </Button>
                                    </Link>

                                    {errors.apiError &&
                                        <div className="alert alert-danger mt-3 mb-0">{errors.apiError?.message}</div>
                                    }
                                </div>
                            </form>
                        }
                    </div>
                </div>
            </main>
        </>
    );
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
    const { passToken } = ctx.query;

    const oAuthToken = ctx.query.token ?? null;
    const oAuthRefreshToken = ctx.query.refresh_token ?? null;

    if (passToken.length < 32) {
        return {
            // returns the default 404 page with a status code of 404
            notFound: true
        }
    }

    return {
        props: {
            passToken,
            oAuthToken,
            oAuthRefreshToken,
        }
    }
});