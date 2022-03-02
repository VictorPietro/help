/* eslint-disable @next/next/link-passhref */
import Head from "next/head";
import { useRouter } from "next/dist/client/router";

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from "react-bootstrap";

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import styles from '../../../styles.module.scss';

import { Link } from "../../../../../components/Link";

import { withSSRAuth } from "../../../../../utils/withSSRAuth";
import { api } from "../../../../../services/apiClient";
import { setupAPIClient } from "../../../../../services/api";
import { constants } from "../../../../../utils/constants";
import { clearString, disableOnChange } from "../../../../../utils/disallowedCharacters";
import FileUploader from "../../../../../components/FileButton";
import { useState } from "react";

interface Page {
    id: string;
    title: string;
    description: string;
    image: string;
    url: string;
    user_id: string;
    updatedAt: string;
}

interface Type {
    id: string;
    name: string;
    description: string;
}

interface CreateLinkProps {
    page: Page;
    types: Type[];
    setPrintHeader: any;
}

type CreateLinkFormData = {
    title?: string;
    url?: string;
    type_id?: string;
};

const createLinkFormSchema = yup.object().shape({
    page_id: yup.string(),
    type_id: yup.string(),
    title: yup.string().required('Título obrigatório'),
    url: yup.string().url('Deve ser uma URL válida').required('URL obrigatória'),
});

export default function CreateLink({ page, types, setPrintHeader }: CreateLinkProps) {
    setPrintHeader(true);
    const router = useRouter();

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(createLinkFormSchema)
    });
    const { errors } = formState;

    if (!page) {
        router.back();
    }

    const handleCreateLink = async ({ title, url, type_id }: CreateLinkFormData, page_id: string, page_url: string) => {
        const cleanUrl = clearString(url);
        let image_type = (selectedFile) ? 'IMAGE' : 'NONE';
        let image = (selectedFile) ? selectedFile : null;

        try {
            const formData = new FormData();

            formData.append('page_id', page_id);
            formData.append('type_id', type_id);
            formData.append('title', title);
            formData.append('url', cleanUrl);
            formData.append('image_type', image_type);
            formData.append('image', image);

            await api.post('links', formData);

            Notify.success('Link criado com sucesso.', constants.notiflix.notify);

            router.push(`/user/page/${page_url}`);
        } catch (err) {
        }
    }

    const [selectedFile, setSelectedFile] = useState<File>();

    return (
        <>
            <Head>
                <title>Nova Página | Lnk.App</title>
            </Head>

            <main className={styles.container}>
                <div className={`row ` + styles.pages}>
                    <div className="col-md-12">
                        <form onSubmit={handleSubmit(data => handleCreateLink(data, page.id, page.url))}>

                            <div className="form-group">
                                <label>Título</label>
                                <input name="title" type="text" {...register('title')} className={`form-control ${errors.title ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.title?.message}</div>
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
                                <label>Tipo</label>
                                <select name="type_id" {...register('type_id')} className={`form-control ${errors.type_id ? 'is-invalid' : ''}`}>
                                    {types.map(type => (
                                        <option key={type.id} value={type.id}>{type.description}</option>
                                    ))}
                                </select>
                                <div className="invalid-feedback">{errors.type_id?.message}</div>
                            </div>

                            <div className="form-group">
                                <FileUploader handleChangeImageInParent={setSelectedFile} hideSaveButton={true} fileInputText="Adicionar Imagem" />
                            </div>

                            <div className="form-group">
                                <Button type="submit" disabled={formState.isSubmitting} size="lg" className={`w-25 mt-2 ${styles.button}`}>
                                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                    Salvar
                                </Button>
                                <Link href={`/user/page/${page.url}`}>
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

    const page_url = Array.isArray(params.page) ? params.page[0] : params.page

    // quando chamar a partir do servidor, chama o setupAPIClient passando o contexto
    const apiClient = setupAPIClient(ctx);

    const pageResponse = await apiClient.get('pages/single', {
        params: {
            page_url: page_url
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
        id: pageResponse.data.page.id,
        title: pageResponse.data.page.title,
        description: pageResponse.data.page.description,
        image: pageResponse.data.page.image,
        url: pageResponse.data.page.url,
        user_id: pageResponse.data.page.user_id,
        updatedAt: new Date(pageResponse.data.page.updated_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }) + " às " + new Date(pageResponse.data.page.updated_at).getHours() + ":" + new Date(pageResponse.data.page.updated_at).getMinutes()
    }

    const typesResponse = await apiClient.get('types');

    // TODO check if any type was found
    if (!(typesResponse.data)) {
        return {
            // returns the default 404 page with a status code of 404
            notFound: true
        }
    }

    const types = typesResponse.data.map(type => {
        return {
            id: type.id,
            name: type.name,
            description: type.description,
        }
    });

    // const userData = response.data;
    return {
        props: {
            page,
            types,
        }
    }
});