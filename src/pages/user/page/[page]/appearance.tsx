import Head from "next/head";
import { Button } from 'react-bootstrap';

import * as yup from 'yup';
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import styles from './page.module.scss';

import { Link } from "../../../../components/Link";

import { withSSRAuth } from "../../../../utils/withSSRAuth";
import { toRN } from "../../../../utils/transformCSStoRN";
import { setupAPIClient } from "../../../../services/api";
import { api } from "../../../../services/apiClient";

import { constants } from "../../../../utils/constants";
import FileUploader from "../../../../components/FileButton";
import { FaPlus } from "react-icons/fa";

interface Page {
    id: string;
    title: string;
    description: string;
    image: string;
    url: string;
    theme_id: string;
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
    systemD?: boolean;
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

interface UpdatePageAppearanceProps {
    page: Page;
    themes: any[];
    links: Link[];
    setPrintHeader: any;
    user: User;
    pageTheme: any;
}

type UpdatePageAppearanceFormData = {
    title?: string;
    url?: string;
    description?: string;
};

const updateAppearanceFormSchema = yup.object().shape({
    page_id: yup.string(),
    title: yup.string().required('Título obrigatório'),
    url: yup.string().required('URL obrigatória'),
    description: yup.string().required('URL obrigatória'),
});

export default function UpdatePageAppearance({ page, themes, links, user, pageTheme, setPrintHeader }: UpdatePageAppearanceProps) {
    setPrintHeader(true);
    // TODO check if everything is set and if not, redirect
    const router = useRouter();
    const [pageState, setPage] = useState(page);
    const [selectedTheme, setSelectedTheme] = useState(pageTheme);

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(updateAppearanceFormSchema),
        defaultValues: {
            title: page.title,
            description: page.description,
            url: page.url,
            theme_id: page.theme_id,
        }
    });
    const { errors } = formState;

    if (!page) {
        router.back();
    }

    const handleUpdatePageAppearance = async ({ title, url, description }: UpdatePageAppearanceFormData, page_id: string, themes: Theme[]) => {
        try {
            await api.patch('pages/edit', {
                page_id,
                theme_id: selectedTheme.id,
                title,
                url,
                description,
            });

            Notify.success('Página atualizada com sucesso.', constants.notiflix.notify);

            setPage((prevPage) => ({
                ...prevPage,
                theme_id: selectedTheme.id,
                title,
                url,
                description,
            }));
        } catch (err) {
        }
    }

    const handleClickAppearance = (element) => {
        let selectedAppearance = element.target.dataset.themeid;

        let newSelectedTheme = {};

        themes.forEach((theme) => {
            if (theme.id === selectedAppearance) {
                newSelectedTheme = theme;
            }
        })

        setSelectedTheme(newSelectedTheme);
    };

    const handleImageSubmission = async (selectedFile: File, setSelectedFile: any, setIsSelected: any) => {
        if (selectedFile !== null && selectedFile !== undefined && setSelectedFile && setIsSelected) {
            try {
                const formData = new FormData();

                formData.append('page_id', pageState.id);
                formData.append('image', selectedFile);
                formData.append('type', 'IMAGE');

                const response = await api.patch('pages/image',
                    formData
                );

                const newImage = response.data.new_image;

                setPage(prevPage => ({
                    ...prevPage,
                    image: newImage,
                }));

                setSelectedFile(null);
                setIsSelected(false);

                Notify.success('Imagem atualizada com sucesso.', constants.notiflix.notify);
            } catch (err) {
            }

            // TODO set if response is good
            // console.log(response)
        }
    };

    return (
        <>
            <Head>
                <title>{pageState.title} | Lnk.App</title>
            </Head>

            <main className={styles.container}>
                <div className="row mt-5">
                    <div className="col-md-8">
                        {(pageState?.image?.length > 0) ?
                            <div className="form-group mb-3">
                                <img className={`${styles.pageImagePreview} mb-3`} alt="Page Image" src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/pages/images/${pageState.image}`} />
                                <FileUploader fileInputText="Trocar Imagem" handleSubmission={handleImageSubmission} />
                            </div>
                            : ''
                        }
                        <form onSubmit={handleSubmit(data => handleUpdatePageAppearance(data, pageState.id, themes))}>

                            <div className="form-group mb-3">
                                <label>Título da Página</label>
                                <input name="title" type="text" {...register('title')} className={`form-control ${errors.title ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.title?.message}</div>
                            </div>
                            <div className="form-group mb-3">
                                <label>URL da Página</label>
                                <input name="url" type="text" {...register('url')} className={`form-control ${errors.url ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.url?.message}</div>
                            </div>
                            <div className="form-group mb-3">
                                <label>Descrição</label>
                                <input name="description" type="text" {...register('description')} className={`form-control ${errors.description ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.description?.message}</div>
                            </div>
                            <div className="form-group mb-3">
                                <label>Tema</label>
                                <div className="row mt-4">
                                    {themes.map((theme) => (
                                        <div key={theme.name} className="col-md-4">
                                            <h6 className={styles.themeName}>
                                                {theme.name}{theme.systemD && ' (padrão)'}
                                            </h6>
                                            <div className={styles.mobileMiniPreview} data-themeid={theme.id} style={theme.font_style} onClick={(element) => handleClickAppearance(element)}>
                                                <div className={styles.linksMiniPreview} data-themeid={theme.id}>
                                                    <div className={styles.linkMiniPreview} data-themeid={theme.id} style={theme.button_style}>
                                                        link_1
                                                    </div>
                                                    <div className={styles.linkMiniPreview} data-themeid={theme.id} style={theme.button_style}>
                                                        link_2
                                                    </div>
                                                    <div className={styles.linkMiniPreview} data-themeid={theme.id} style={theme.button_style}>
                                                        link_3
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="col-md-4">
                                        <Link href={`/user/page/${page.url}/themes/new`}>
                                            <h6 className={styles.addNewTheme}>
                                                Criar novo
                                            </h6>
                                            <div className={styles.mobileMiniPreview}>
                                                <div className={styles.linksMiniPreview}>
                                                    <div className={styles.linkMiniPreview}>
                                                        {/* criar tema personalizado */}
                                                    </div>
                                                    <div className={styles.linkMiniPreview}>
                                                        <FaPlus />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <Button type="submit" disabled={formState.isSubmitting} size="lg" className={`w-25 mt-2 ${styles.button}`}>
                                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                    Salvar
                                </Button>
                                <Link href={`/user/page/${pageState.url}`}>
                                    <Button variant="primary" size="lg" className={`w-25 mt-2 ${styles.button}`}>
                                        Voltar
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-4">
                        <div className={styles.mobile} style={selectedTheme.font_style}>
                            <div className={styles.pageBio}>
                                {(pageState.image?.length > 0) && <img className={styles.pageAvatar} alt="Page Image" src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/pages/images/${pageState.image}`} />}
                                {/* TODO verificar se o usuário quer que mostre isso? */}
                                <h5 style={{ "marginTop": "1.5rem" }}>@{user.username}</h5>
                                <h6 style={{ "marginTop": "0.6rem" }}>{pageState.title}</h6>
                                <p style={{ "marginTop": "0.5rem" }}>{pageState.description}</p>
                            </div>
                            <div className={styles.links}>
                                {links.map(link => (
                                    // eslint-disable-next-line @next/next/link-passhref
                                    <Link key={link.id} href={`${link.url}`} target="_blank" className={styles.link} style={selectedTheme.button_style}>
                                        {/* <time>{link.updatedAt}</time> */}
                                        <strong>{link.title}</strong>
                                    </Link>
                                ))}
                            </div>
                            <img className={styles.companyLogo} alt="Visit Lnk.App" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Linktree.svg/2560px-Linktree.svg.png" />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    const { params } = ctx;

    const slug = Array.isArray(params.page) ? params.page[0] : params.page

    // quando chamar a partir do servidor, chama o setupAPIClient passando o contexto
    const apiClient = setupAPIClient(ctx);

    // o try-catch está sendo feito dentro do withSSRAuth
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
        id: pageResponse.data.page.id,
        title: pageResponse.data.page.title,
        description: pageResponse.data.page.description,
        image: pageResponse.data.page.image,
        url: pageResponse.data.page.url,
        theme_id: pageResponse.data.page.theme_id,
        updatedAt: new Date(pageResponse.data.page.updated_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }) + " às " + new Date(pageResponse.data.page.updated_at).getHours() + ":" + new Date(pageResponse.data.page.updated_at).getMinutes()
    }

    const pageTheme: Theme = {
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

    const themesResponse = await apiClient.get('themes');

    // TODO check if any theme was found
    if (!(themesResponse.data)) {
        return {
            // returns the default 404 page with a status code of 404
            notFound: true
        }
    }

    const themes = themesResponse.data.map(theme => {
        return {
            id: theme.id,
            name: theme.name,
            description: theme.description,
            background_style: toRN(theme.background_style),
            button_style: toRN(theme.button_style),
            font_style: toRN(theme.font_style),
            systemD: theme.system_default,
        }
    });


    return {
        props: {
            links,
            page,
            pageTheme,
            user,
            themes,
        }
    }
});