/* eslint-disable @next/next/link-passhref */
import Head from "next/head";
import { useRouter } from "next/dist/client/router";

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from "react-bootstrap";

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import styles from '../styles.module.scss';

import { Link } from "../../../components/Link";
import { api } from "../../../services/apiClient";
import { withSSRAuth } from "../../../utils/withSSRAuth";
import { setupAPIClient } from "../../../services/api";
import { constants } from "../../../utils/constants";
import { clearString, disableOnChange } from "../../../utils/disallowedCharacters";
import { toRN } from "../../../utils/transformCSStoRN";
interface Theme {
    id: string;
    name: string;
    file: string;
    description: string;
    background_style: string;
    button_style: string;
    font_style: string;
}

interface CreatePageProps {
    user?: {
        name: string;
        id: string;
    }
    setPrintHeader: any;
    pageTheme: Theme;
}

type CreatePageFormData = {
    title?: string;
    description?: string;
    url?: string;
};

const createPageFormSchema = yup.object().shape({
    title: yup.string().required('Título obrigatório'),
    description: yup.string(),
    url: yup.string().required('URL obrigatória'),      // .url('Deve ser uma URL válida')
});

export default function CreatePage({ user, setPrintHeader, pageTheme }: CreatePageProps) {
    setPrintHeader(true);
    const router = useRouter();

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(createPageFormSchema)
    });
    const { errors } = formState;

    const handleCreatePage = async ({ title, description, url }: CreatePageFormData, user_id: string, pageTheme: Theme) => {
        const cleanUrl = clearString(url);

        // TODO add session token
        try {
            const response = await api.post('pages', {
                title,
                description,
                url: cleanUrl,
                user_id,
                theme_id: pageTheme.id,
            });

            const newPage = response.data;

            Notify.success('Página criada com sucesso.', constants.notiflix.notify);

            router.push(`/user/page/${newPage.url}`);
        } catch (err) {
            // console.log(err)
        }
    }

    return (
        <>
            <Head>
                <title>Nova Página | Lnk.App</title>
            </Head>

            <main className={styles.container}>
                <div className={`row ` + styles.pages}>
                    <div className="col-md-12">
                        <form onSubmit={handleSubmit(data => handleCreatePage(data, user.id, pageTheme))}>

                            <div className="form-group">
                                <label>Título</label>
                                <input name="title" type="text" {...register('title')} className={`form-control ${errors.title ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.title?.message}</div>
                            </div>
                            <div className="form-group">
                                <label>Descrição</label>
                                <input name="description" type="text" {...register('description')} className={`form-control ${errors.description ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.description?.message}</div>
                            </div>
                            <div className="form-group">
                                <label>URL</label>
                                <input
                                    name="url" type="text" {...register('url')} className={`form-control ${errors.url ? 'is-invalid' : ''}`}
                                    onChange={(e) => disableOnChange(e, e.target.value)}
                                />
                                <div className="invalid-feedback">{errors.url?.message}</div>
                            </div>

                            <div className="form-group">
                                <Button type="submit" disabled={formState.isSubmitting} size="lg" className={`w-25 mt-2 ${styles.button}`}>
                                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                    Salvar
                                </Button>
                                <Link href={`/user/pages`}>
                                    <Button variant="primary" size="lg" className={`w-25 mt-2 ${styles.button}`}>
                                        Voltar
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}
export const getServerSideProps = withSSRAuth(async (ctx) => {
    const { params } = ctx;
    // const { user } = useContext(AuthContext);

    // quando chamar a partir do servidor, chama o setupAPIClient passando o contexto
    const apiClient = setupAPIClient(ctx);

    // o try-catch está sendo feito dentro do withSSRAuth
    const response = await apiClient.get('themes');

    const pageThemes = response.data.map(theme => {
        return {
            id: theme.id,
            name: theme.name,
            file: theme.file,
            description: theme.description,
            background_style: toRN(theme.background_style),
            button_style: toRN(theme.button_style),
            font_style: toRN(theme.font_style),
        }
    });

    console.log(pageThemes)

    // o try-catch está sendo feito dentro do withSSRAuth
    const responseUser = await apiClient.get('users/me');

    const userResponseData = responseUser.data;

    const userFormatted = {
        id: userResponseData.id,
        username: userResponseData.username,
        name: userResponseData.name,
        email: userResponseData.email,
        bio: userResponseData.bio,
        profile_title: userResponseData.profile_title,
        avatar: userResponseData.avatar,
        createdAt: new Date(userResponseData.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }) + " às " + new Date(userResponseData.created_at).getHours() + ":" + new Date(userResponseData.created_at).getMinutes(),
        updatedAt: new Date(userResponseData.updated_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }) + " às " + new Date(userResponseData.updated_at).getHours() + ":" + new Date(userResponseData.updated_at).getMinutes(),
    };

    return {
        props: {
            pageTheme: pageThemes[0],
            user: userFormatted,
        }
    }
});