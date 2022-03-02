import Head from "next/head";
import { Button } from 'react-bootstrap';

import * as yup from 'yup';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import styles from "../page.module.scss";

import { Link } from "../../../../../components/Link";

import { withSSRAuth } from "../../../../../utils/withSSRAuth";
import { toRN } from "../../../../../utils/transformCSStoRN";
import { setupAPIClient } from "../../../../../services/api";
import { api } from "../../../../../services/apiClient";

import { constants } from "../../../../../utils/constants";
import CustomFilePicker from "../../../../../components/CustomFilePicker";
import CustomColorPicker from "../../../../../components/CustomColorPicker";
import CustomFontPicker from "../../../../../components/CustomFontPicker";
import { FaFile } from "react-icons/fa";

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
}

interface Link {
    id: string;
    title: string;
    url: string;
    updatedAt: string;
}

interface User {
    id: string;
    username: string;
}

interface NewPageThemeProps {
    page: Page;
    setPrintHeader: any;
    user: User;
    pageTheme: any;
    backgrounds: any;
    buttons: any;
}

type NewPageThemeFormData = {
    name: string;
    description?: string;
};

const updateAppearanceFormSchema = yup.object().shape({
    name: yup.string().required('Nome obrigatório'),
    description: yup.string(),
});

export default function NewPageTheme({ page, user, setPrintHeader, backgrounds, buttons }: NewPageThemeProps) {
    setPrintHeader(true);
    // TODO check if everything is set and if not, redirect
    const router = useRouter();
    const [pageState, setPage] = useState(page);
    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(updateAppearanceFormSchema),
        defaultValues: {
            name: '',
            description: '',
        }
    });
    const { errors } = formState;

    if (!page) {
        router.back();
    }

    // selectedFile: File, setSelectedFile: any, setIsSelected: any
    const NewPageThemeSubmission = async ({ name, description }: NewPageThemeFormData) => {
        // if (selectedFile !== null && selectedFile !== undefined && setSelectedFile && setIsSelected) {
        try {
            const formData = new FormData();

            let backgroundStyle = '';

            if (selectedBackground === 'flat') {
                backgroundStyle = `color: ${backgroundColor}`;
            }

            if (selectedBackground === 'gradient') {
                // TODO handle gradient

            }

            if (selectedBackground === 'file') {
                // TODO handle file
                // formData.append('file', selectedFile);
            }

            const [buttonBorder,] = buttons.map(buttonStyle => {
                if (buttonStyle.id === selectedButtonStyle) {
                    return buttonStyle.styleCSS;
                }
            });

            const buttonStyle = `background-color: ${buttonColor}; color: ${buttonFontColor}; ${buttonBorder}`;

            const fontStyle = `fontStyle: 400 1rem "${font}", sans-serif; color: ${fontColor} !important;`;

            formData.append('system_default', 'false');
            formData.append('name', name);
            formData.append('description', description);
            formData.append('background_style', backgroundStyle);
            formData.append('button_style', buttonStyle);
            formData.append('font_style', fontStyle);

            const response = await api.post('themes',
                formData
            );

            Notify.success('Tema criado com sucesso.', constants.notiflix.notify);
            router.push(`/user/page/${pageState.url}/appearance`);

        } catch (err) {
        }

        // TODO set if response is good
        // console.log(response)
        // }
    };

    const handleFileSubmission = async (selectedFile: File, setSelectedFile: any, setIsSelected: any) => {
        if (selectedFile !== null && selectedFile !== undefined && setSelectedFile && setIsSelected) {
            // return // TODO remove
            try {
                // const formData = new FormData();

                // formData.append('page_id', pageState.id);
                // formData.append('image', selectedFile);
                // formData.append('type', 'IMAGE');

                // const response = await api.patch('pages/image',
                //     formData
                // );

                // const newImage = response.data.new_image;

                // setPage(prevPage => ({
                //     ...prevPage,
                //     image: newImage,
                // }));

                // setSelectedFile(null);
                // setIsSelected(false);
                setSelectedBackground('file');

                Notify.success('Imagem atualizada com sucesso.', constants.notiflix.notify);
            } catch (err) {
            }
        }
    };

    const [selectedBackground, setSelectedBackground] = useState('flat');
    const [backgroundColor, setBackgroundColor] = useState('#000000');
    const [buttonColor, setButtonColor] = useState('#FFFFFF');
    const [buttonFontColor, setButtonFontColor] = useState('#FF6600');
    const [fontColor, setFontColor] = useState('#990000');
    const [selectedButtonStyle, setSelectedButtonStyle] = useState('1b');
    const [selectedButtonStylePreview, setSelectedButtonStylePreview] = useState('border-style: dotted; padding: 1rem;');

    useEffect(() => {
        // console.log(backgroundColor);
    }, [backgroundColor]);

    // 'flat' | 'gradient' | 'button' | 'buttonFont' | 'font'
    const handleColorChange = async (selectedColor, type: string) => {
        let fieldChanged = false;

        if (type !== 'flat' && type !== 'gradient' && type !== 'button' && type !== 'buttonFont' && type !== 'font') {
            Notify.failure('Ação inválida!', constants.notiflix.notify);
            return false;
        }

        try {

            const typeBackground = (type === 'flat') ? 'flat' : 'gradient';
            setSelectedBackground(typeBackground);

            switch (type) {
                case 'flat':
                    setBackgroundColor(selectedColor);
                    break;

                case 'gradient':
                    // TODO deal with palette
                    setBackgroundColor(selectedColor);
                    break;

                case 'button':
                    setButtonColor(selectedColor);
                    break;

                case 'buttonFont':
                    setButtonFontColor(selectedColor);
                    break;

                case 'font':
                    setFontColor(selectedColor);
                    break;

                default:
                    Notify.failure('Ação inválida!', constants.notiflix.notify);
                    return false;
            }

            // console.log(`background: ${backgroundColor}`)
            // console.log(`button: ${buttonColor}`)
            // console.log(`buttonFont: ${buttonFontColor}`)
            // console.log(`fontColor: ${fontColor}`)
            // console.log(`font: ${font}`)

            // console.log(toRN(`background-color: ${buttonColor} !important; color: ${buttonFontColor}; ${selectedButtonStylePreview}`))

            Notify.success('Cor atualizada com sucesso.', constants.notiflix.notify);

            return true;
        } catch (err) {
        }
    }

    const [font, setFont] = useState('Roboto');

    // 'flat' | 'gradient' | 'button' | 'buttonFont' | 'font'
    const handleFontChange = (selectedFont: string) => {
        let fieldChanged = false;

        try {
            setFont(selectedFont);

            // console.log(`FontStyle: ${font}`);

            Notify.success('Fonte atualizada com sucesso.', constants.notiflix.notify);

            return true;
        } catch (err) {
        }
    }

    var linksMock = ['link_1', 'link_2', 'link_3'];

    return (
        <>
            <Head>
                <title>{pageState.title} | Lnk.App</title>
            </Head>

            <main className={styles.container}>
                <div className="row mt-5">
                    <div className="col-md-8">
                        <form onSubmit={handleSubmit(data => NewPageThemeSubmission(data))}>

                            <div className="form-group mb-3">
                                <label>Nome do Tema</label>
                                <input name="name" type="text" {...register('name')} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.name?.message}</div>
                            </div>
                            <div className="form-group mb-3">
                                <label>Descrição</label>
                                <input name="description" type="text" {...register('description')} className={`form-control ${errors.description ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.description?.message}</div>
                            </div>

                            {/* TODO background color, image or video */}
                            {/* TODO background gradient picker */}
                            <div className="form-group mb-3">
                                <h2>Background</h2>
                                <div className="row mt-4">
                                    {backgrounds?.map((background) => (
                                        <>
                                            <div key={background.type} className="col-md-4">
                                                <div className={`${styles.mobileMiniPreview}`} data-backgroundid={background.id}
                                                    style={background.style}
                                                    onClick={(element) => console.log()}>
                                                    <div className={styles.linksMiniPreview} data-backgroundid={background.id}
                                                        style={{
                                                            border: (background.type === selectedBackground) ? '10px solid #009900' : ''
                                                        }}
                                                    >
                                                        {background.type === 'flat' &&
                                                            <CustomColorPicker
                                                                id={background.id}
                                                                handleColorChange={handleColorChange}
                                                                color="#224455"
                                                                type="flat"
                                                            />
                                                        }
                                                        {background.type === 'gradient' &&
                                                            <CustomColorPicker
                                                                id={background.id}
                                                                handleColorChange={handleColorChange}
                                                                color="#224455"
                                                                type="gradient"
                                                            />
                                                        }
                                                        {background.type === 'file' &&
                                                            <CustomFilePicker
                                                                fileInputText={<FaFile />}
                                                                handleSubmission={handleFileSubmission}
                                                                backgroundType={selectedBackground}
                                                            />
                                                        }
                                                    </div>
                                                </div>

                                                <div className={styles.miniPreviewName} style={background.button_style}>
                                                    {background.name}
                                                </div>
                                            </div>
                                        </>
                                    ))}
                                </div>
                            </div>

                            {/* TODO buttons (border and inside background) */}
                            <h2>Button</h2>
                            <div className="row mt-4">
                                {buttons?.map((button) => (
                                    <>
                                        <div key={button.id} className="col-md-4">
                                            <div className={styles.miniPreviewName} style={button.button_style}>
                                                {button.name}
                                            </div>
                                            <div
                                                onClick={() => {
                                                    setSelectedButtonStyle(button.id);
                                                    setSelectedButtonStylePreview(button.styleCSS);
                                                }}
                                                style={{
                                                    border: (button.id === selectedButtonStyle) ? '10px solid #009900' : ''
                                                }}>
                                                <button style={button.style} className={styles.buttonSelect}>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ))}
                            </div>

                            {/* TODO button color */}
                            <h5>Button color</h5>
                            {<CustomColorPicker
                                id={"button-color"}
                                handleColorChange={handleColorChange}
                                color="#224455"
                                type="button"
                            />}

                            {/* TODO button font color */}
                            <h5>Button font color</h5>
                            {<CustomColorPicker
                                id={"button-font-color"}
                                handleColorChange={handleColorChange}
                                color="#224455"
                                type="buttonFont"
                            />}

                            {/* TODO fonts */}
                            <h2>Fonts</h2>
                            {<CustomFontPicker
                                id={"font"}
                                handleFontChange={handleFontChange}
                            />}

                            {/* TODO font color */}
                            <h5>Font color</h5>
                            {<CustomColorPicker
                                id={"font-color"}
                                handleColorChange={handleColorChange}
                                color="#224455"
                                type="font"
                            />}


                            <div className="form-group">
                                <Button type="submit" disabled={formState.isSubmitting} size="lg" className={`w-25 mt-2 ${styles.button}`}>
                                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                    Criar
                                </Button>
                                <Link href={`/user/page/${pageState.url}/appearance`}>
                                    <Button variant="primary" size="lg" className={`w-25 mt-2 ${styles.button}`}>
                                        Voltar
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-4">
                        <div className={styles.mobile + ` apply-font`} style={toRN(`background: ${backgroundColor}; fontStyle: 400 1rem "${font}", sans-serif; color: ${fontColor};`)}>
                            <div className={styles.pageBio}>
                                {/* TODO set base api url env */}
                                {(pageState.image?.length > 0) && <img className={styles.pageAvatar} alt="Page Image" src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/pages/images/${pageState.image}`} />}
                                {/* TODO verificar se o usuário quer que mostre isso */}
                                <h5 style={{ "marginTop": "1.5rem" }}>@{user.username}</h5>
                                <h6 style={{ "marginTop": "0.6rem" }}>{pageState.title}</h6>
                                <p style={{ "marginTop": "0.5rem" }}>{pageState.description}</p>
                            </div>

                            <div className={styles.links}>
                                <div className={styles.linksMiniPreview}>
                                    {
                                        linksMock.map((link, index) => (
                                            <div key={link} className={styles.link} style={toRN(`background: ${buttonColor} !important; color: ${buttonFontColor}; ${selectedButtonStylePreview}`)}>
                                                {`link_${index}`}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <img className={styles.companyLogo} alt="Visit Lnk.App" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Linktree.svg/2560px-Linktree.svg.png" />
                        </div>
                    </div>
                </div>
            </main >
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

    const themesResponse = await apiClient.get('themes');

    // TODO check if any theme was found
    if (!(themesResponse.data)) {
        return {
            // returns the default 404 page with a status code of 404
            notFound: true
        }
    }

    const mockBackgrounds = [
        {
            "id": "1a",
            "type": "flat",
            "name": "Cor Simples",
            "style": toRN("background-color: #990022"),
        },
        {
            "id": "2a",
            "type": "gradient",
            "name": "Degradê",
            "style": toRN("background-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(162,0,31,1) 63%, rgba(255,0,0,1) 100%);"),
        },
        {
            "id": "3a",
            "type": "file",
            "name": "Mídia",
            // "style": toRN("background-image: url(/images/avatar.svg); background-position-x: center; background-position-y: center; background-size: contain; background-repeat: no-repeat;"),
        },
    ];

    const mockButtons = [
        {
            "id": "1b",
            "type": "button",
            "name": "Pontilhado",
            "styleCSS": "border-style: dotted; padding: 1rem;",
            "style": toRN("border-style: dotted; padding: 1rem;"),
        },
        {
            "id": "2b",
            "type": "button",
            "name": "Tracejado",
            "styleCSS": "border-style: dashed;",
            "style": toRN("border-style: dashed;"),
        },
    ];

    // background style (gradient, flat color, image, video)

    // button style (border)
    // button color
    // button font color

    // fonts
    // font color


    return {
        props: {
            page,
            pageTheme,
            user,
            backgrounds: mockBackgrounds,
            buttons: mockButtons
        }
    }
});