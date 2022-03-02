/* eslint-disable @next/next/link-passhref */
import Head from "next/head";
import { useRouter } from "next/dist/client/router";

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'react-bootstrap';
import { FaGoogle } from "react-icons/fa";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

import styles from '../user/styles.module.scss';
import { FormEvent, useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { withSSRGuest } from "../../utils/withSSRGuest";
import { Link } from "../../components/Link";
import { setupAPIClient } from "../../services/api";
import { constants } from '../../utils/constants';
import { api } from "../../services/apiClient";

type LoginPageFormData = {
    email: string;
    password: string;
};

const createPageFormSchema = yup.object().shape({
    email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
    password: yup.string().required('Senha obrigatória'),
});

interface LoginPageProps {
    googleLink: string;
    setPrintHeader: any;
    oAuthToken?: string;
    oAuthRefreshToken?: string;
}

export default function LoginPage({ googleLink, setPrintHeader, oAuthToken, oAuthRefreshToken }: LoginPageProps) {
    setPrintHeader(true);

    const router = useRouter();

    const { signIn, isAuthenticated, signInOAuth } = useContext(AuthContext);
    const [loading, setLoading] = useState((oAuthToken || oAuthRefreshToken) ? true : false);
    const [loadingButton, setLoadingButton] = useState('');
    const [email, setEmail] = useState('');

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
    const { register, handleSubmit, setError, clearErrors, formState } = useForm({
        resolver: yupResolver(createPageFormSchema)
    });
    const { errors } = formState;

    async function mySubmit(e: FormEvent) {
        e.preventDefault();

        await handleSubmit(handleLogin)(e);
    }

    async function handleLogin({ email, password }: LoginPageFormData) {
        const data = {
            email,
            password,
        }

        setLoading(true);

        const signInResult = await signIn(data);

        if (!signInResult) setLoading(false);
    }

    async function handleChangeEmail(e) {
        setEmail(e.target.value);
    }

    async function handleForgotPassword() {
        setLoadingButton('forgotPassword');

        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        const isValid = re.test(email);

        if (email.length > 0 && isValid) {
            await api.post('password/forgot', {
                email,
            });

            setLoadingButton('');
            Notify.info('Verifique sua caixa de entrada para recuperar o acesso.', constants.notiflix.notify);
        } else {
            setLoadingButton('');
            setError("email", {
                type: "focus",
                message: "Digite um e-mail válido"
            }), {
                shouldFocus: true,
            };
            clearErrors("password");
            Notify.warning('Digite um e-mail válido.', constants.notiflix.notify);
        }
    }

    async function handleLoginUsingEmail() {
        setLoadingButton('loginUsingEmail');
        clearErrors("email");
        clearErrors("password");

        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        const isValid = re.test(email);

        if (email.length > 0 && isValid) {
            await api.post('login/send-email', {
                email,
            });

            setLoadingButton('');
            Notify.info('Verifique sua caixa de entrada para seu link de acesso.', constants.notiflix.notify);
        } else {
            setLoadingButton('');
            setError("email", {
                type: "focus",
                message: "Digite um e-mail válido"
            }), {
                shouldFocus: true,
            };
            Notify.warning('Digite um e-mail válido.', constants.notiflix.notify);
        }
    }

    return (
        <>
            <Head>
                <title>Entrar | Lnk.App</title>
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
                                    <label>E-mail</label>
                                    <input name="email" type="email" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} onChange={handleChangeEmail} />
                                    <div className="invalid-feedback">{errors.email?.message}</div>
                                </div>
                                <div className="form-group">
                                    <label>Senha</label>
                                    <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                                    <div className="invalid-feedback">{errors.password?.message}</div>
                                </div>

                                <div className="form-group">
                                    <Button type="submit" disabled={formState.isSubmitting} size="lg" className={`w-25 mt-2 ${styles.button}`}>
                                        {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                        Entrar
                                    </Button>
                                    <Link href={`/signup`}>
                                        <Button size="lg" className={`w-25 mt-2 ${styles.button}`}>
                                            Cadastrar-se
                                        </Button>
                                    </Link>
                                    {(loadingButton === 'loginUsingEmail') ?
                                        <Loader
                                            type="Puff"
                                            color="#000000"
                                            height={50}
                                            width={50}
                                        />
                                        :
                                        <Button size="lg" className={`w-25 mt-2 ${styles.button}`} onClick={() => handleLoginUsingEmail()}>
                                            Entrar com E-mail
                                        </Button>
                                    }
                                    {(loadingButton === 'forgotPassword') ?
                                        <Loader
                                            type="Puff"
                                            color="#000000"
                                            height={50}
                                            width={50}
                                        />
                                        :
                                        <Button size="lg" className={`w-25 mt-2 ${styles.button}`} onClick={() => handleForgotPassword()}>
                                            Esqueci a senha
                                        </Button>
                                    }
                                    {googleLink &&
                                        <Link href={`${googleLink}`}>
                                            <Button size="lg" className={`w-25 mt-2 ${styles.button}`}>
                                                <FaGoogle /> Entrar com Google
                                            </Button>
                                        </Link>
                                    }

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
    // quando chamar a partir do servidor, chama o setupAPIClient passando o contexto
    const apiClient = setupAPIClient(ctx);

    const oAuthToken = ctx.query.token ?? null;
    const oAuthRefreshToken = ctx.query.refresh_token ?? null;

    const response = await apiClient.get('oauth/links', {
        params: {
            google: true,
            type: 'login',
        }
    });

    const googleLink = response.data.google;

    return {
        props: {
            googleLink,
            oAuthToken,
            oAuthRefreshToken,
        }
    }
});