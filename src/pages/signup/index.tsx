import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Head from 'next/head';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

import { withSSRGuest } from '../../utils/withSSRGuest';

import { Link } from "../../components/Link";
import styles from '../user/styles.module.scss';
import { api } from '../../services/apiClient';
import { Button } from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa';
import { setupAPIClient } from '../../services/api';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

type CreateUserFormData = {
    username: string;
    name: string;
    email: string;
    password: string;
};

const createUserFormSchema = yup.object().shape({
    username: yup.string().required('Usuário obrigatório').min(2, 'No mínimo 2 caracteres'),
    name: yup.string().required('Nome obrigatório'),
    email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
    password: yup.string().required('Senha obrigatória').min(8, 'No mínimo 8 caracteres'),
});

interface SignUpPageProps {
    googleLink: string;
    setPrintHeader: any;
    oAuthToken?: string;
    oAuthRefreshToken?: string;
}

export default function UserSettings({ googleLink, setPrintHeader, oAuthToken, oAuthRefreshToken }: SignUpPageProps) {
    setPrintHeader(true);

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(createUserFormSchema),
        defaultValues: {
            username: '',
            name: '',
            email: '',
            password: '',
        }
    });
    const { errors } = formState;

    const handleCreateUser: SubmitHandler<CreateUserFormData> = async ({ username, name, email, password }: CreateUserFormData) => {
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const response = await api.post('users', {
                username,
                name,
                email,
                password,
            });

            // console.log(response.data);
        } catch (err) {
        }
    }

    const { signInOAuth } = useContext(AuthContext);
    const [loading, setLoading] = useState((oAuthToken || oAuthRefreshToken) ? true : false);

    useEffect(() => {
        (async () => {
            if (oAuthToken && oAuthRefreshToken) {
                await signInOAuth({ token: oAuthToken, refresh_token: oAuthRefreshToken, redirectRoute: '/' });
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Head>
                <title>Cadastrar-se | Lnk.App</title>
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
                            <form onSubmit={handleSubmit(data => handleCreateUser(data))}>
                                <div className={styles.formGroup}>
                                    <label>Usuário</label>
                                    <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                                    <div className="invalid-feedback">{errors.username?.message}</div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Nome</label>
                                    <input name="name" type="text" {...register('name')} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                                    <div className="invalid-feedback">{errors.name?.message}</div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>E-mail</label>
                                    <input name="email" type="email" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                                    <div className="invalid-feedback">{errors.email?.message}</div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Nova Senha</label>
                                    <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                                    <div className="invalid-feedback">{errors.password?.message}</div>
                                </div>

                                <div className={styles.formGroup}>
                                    <Button type="submit" disabled={formState.isSubmitting} size="lg" className={`w-25 ${styles.button}`}>
                                        {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                        Enviar
                                    </Button>
                                    <Link href={`/login`}>
                                        <Button size="lg" className={`w-25 mt-2 ${styles.button}`}>
                                            Voltar
                                        </Button>
                                    </Link>
                                    {googleLink &&
                                        <Link href={`${googleLink}`}>
                                            <Button size="lg" className={`w-25 mt-2 ${styles.button}`}>
                                                <FaGoogle /> Cadastrar com Google
                                            </Button>
                                        </Link>
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
    const apiClient = setupAPIClient(ctx);

    const oAuthToken = ctx.query.token ?? null;
    const oAuthRefreshToken = ctx.query.refresh_token ?? null;

    const response = await apiClient.get('oauth/links', {
        params: {
            google: true,
            type: 'signup',
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