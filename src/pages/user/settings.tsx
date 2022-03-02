import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Confirm } from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Head from 'next/head';
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import EasyEdit, { Types } from 'react-easy-edit';
import { FaCheckCircle, FaTimesCircle, FaTrashAlt, FaFacebook, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";

import styles from './styles.module.scss';

import { Link } from "../../components/Link";
import { setupAPIClient } from "../../services/api";
import { withSSRAuth } from "../../utils/withSSRAuth";
import { api } from '../../services/apiClient';
import { constants } from '../../utils/constants';
import FileUploader from '../../components/FileButton';
import { clearString, disableOnChange } from '../../utils/disallowedCharacters';

interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    bio: string;
    profile_title: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
}
interface GetUserProps {
    user?: User;
    setPrintHeader: any;
    socialNetworkTypes: SocialNetworkType[];
    socialNetworks: SocialNetwork[];
}

type UpdateUserSettingsFormData = {
    username?: string;
    name?: string;
    email?: string;
    new_password?: string;
    new_password_confirm?: string;
    bio?: string;
    profile_title?: string;
};

interface SocialNetworkType {
    id: string;
    name: string;
    url: string;
    image: string;
    placeholder: string;
    label: string;
}

interface SocialNetwork {
    id: string;
    linkId: string;
    order: string;
    url: string;
    userId?: string;
    updatedAt: string;

    socialNetworkType: SocialNetworkType;
}

const updateUserSettingsFormSchema = yup.object().shape({
    username: yup.string().required('Usuário obrigatório').min(2, 'No mínimo 2 caracteres'),
    name: yup.string().required('Nome obrigatório'),
    email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
    new_password: yup.string(),
    new_password_confirm: yup.string()
        .oneOf([yup.ref('new_password'), null], 'As senhas devem ser iguais'),
    bio: yup.string(),
    profile_title: yup.string(),
});

export default function UserSettings({ user, setPrintHeader, socialNetworks, socialNetworkTypes }: GetUserProps) {
    setPrintHeader(true);

    const [userState, setUser] = useState<User>(user);
    const [socialNetworksState, setSocialNetworks] = useState<SocialNetwork[] | null>(socialNetworks);
    const [windowsReadyLoading, setwindowsReadyLoading] = useState(false);

    // wait page load
    useEffect(() => {
        // this means page is loaded completely
        setwindowsReadyLoading(true);
    }, []);

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState, setError, clearErrors, setValue } = useForm({
        resolver: yupResolver(updateUserSettingsFormSchema),
        defaultValues: {
            username: userState.username,
            name: userState.name,
            email: userState.email,
            bio: userState.bio,
            profile_title: userState.profile_title,
            new_password: '',
            new_password_confirm: '',
        }
    });
    const { errors } = formState;

    const handleUpdateUserSettings: SubmitHandler<UpdateUserSettingsFormData> = async ({ username, name, email, new_password, bio, profile_title }: UpdateUserSettingsFormData) => {
        if (new_password.length > 0 && new_password.length < 8) {
            setError("new_password", {
                type: "focus",
                message: "No mínimo 8 caracteres"
            }), {
                shouldFocus: true,
            };

            return;
        }

        clearErrors("new_password");

        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const cleanUsername = clearString(username);

            await api.patch('users/settings', {
                username: cleanUsername,
                name,
                email,
                password: new_password,
                bio,
                profile_title,
            });

            setUser(prevUser => ({
                ...prevUser,
                username,
                name,
                email,
                bio,
                profile_title,
                updatedAt: new Date().toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                }) + " às " + new Date().getHours() + ":" + new Date().getMinutes(),
            }));

            Notify.success('Perfil atualizado com sucesso.', constants.notiflix.notify);

            if (new_password.length > 0) {
                setValue('new_password', '');
                setValue('new_password_confirm', '');
            }
        } catch (err) {
        }

        // console.log(response.data);
    }

    const handleImageSubmission = async (selectedFile: File, setSelectedFile: any, setIsSelected: any) => {
        if (selectedFile !== null && selectedFile !== undefined && setSelectedFile && setIsSelected) {
            try {
                const formData = new FormData();

                formData.append('avatar', selectedFile);

                const response = await api.patch('users/avatar',
                    formData
                );

                const newAvatar = response.data.new_avatar;

                setUser(prevUser => ({
                    ...prevUser,
                    avatar: newAvatar,
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

    // TODO update default url value when changed?
    const handleSocialNetworkCreation = async (user_id: string, socialNetworkTypeId: string) => {
        try {
            const socialNetworkType = socialNetworkTypes.filter((socialNetworkType: SocialNetworkType) => {
                if (socialNetworkType.id === socialNetworkTypeId) {
                    return socialNetworkType;
                }
            })[0];

            // TODO return new social network + its type
            const response = await api.post('socialNetworks', {
                user_id,
                social_network_type_id: socialNetworkTypeId,
                is_user_social: true,
                url: `${socialNetworkType.url}/${user.username}`,
            });

            const createdSocialNetwork = {
                ...{
                    id: response.data.socialNetwork.id,
                    linkId: response.data.socialNetwork.link_id,
                    url: response.data.socialNetwork.url,
                    userId: response.data.socialNetwork.user_id,
                    order: response.data.socialNetwork.order,
                    updatedAt: response.data.socialNetwork.updated_at,
                },
                socialNetworkType: {
                    id: response.data.socialNetworkType.id,
                    name: response.data.socialNetworkType.name,
                    url: response.data.socialNetworkType.url,
                    image: response.data.socialNetworkType.image,
                    placeholder: response.data.socialNetworkType.placeholder,
                    label: response.data.socialNetworkType.label,
                }
            };

            setSocialNetworks([...socialNetworksState, createdSocialNetwork]);

            Notify.success('Rede social criada.', constants.notiflix.notify);
        } catch (err) {
        }
    }

    const handleSocialNetworkChange = async (url: string, social_network_type_id: string, social_network_id: string) => {
        const cleanUrl = DOMPurify.sanitize(url);
        let fieldChanged = false;

        try {
            await api.patch('socialNetworks/edit', {
                social_network_id,
                url: cleanUrl,
                social_network_type_id,
            });

            const updatedSocialNetworks = socialNetworksState.map((socialNetwork) => {
                if (socialNetwork.id === social_network_id) {
                    if (socialNetwork.url !== cleanUrl && cleanUrl.length > 0) {
                        fieldChanged = true;
                        socialNetwork.url = cleanUrl;
                    }

                    if (socialNetwork.socialNetworkType.id !== social_network_type_id) {
                        fieldChanged = true;
                    }
                }

                return socialNetwork;
            });

            if (fieldChanged) {
                setSocialNetworks(updatedSocialNetworks);

                Notify.success('Rede Social atualizada.', constants.notiflix.notify);
            }
        } catch (err) {
        }
    }

    const handleOnDragEnd = async (result) => {
        // avoid error when element is dragged outside of the defined droppable container
        if (!result.destination) return;
        if (result.source.index === result.destination.index) return;

        try {
            // console.log(result)

            // create a new copy of our socialNetworks array
            const items = Array.from(socialNetworksState);
            //  use the source.index value to find our item from our new array and remove it using the splice method
            const [reorderedSocialNetworks] = items.splice(result.source.index, 1);   // result is destructured, so we end up with a new object of reorderedSocialNetworks that is our dragged item
            // use our destination.index to add that item back into the array, but at it’s new location, again using splice
            items.splice(result.destination.index, 0, reorderedSocialNetworks);

            const social_networks_ids_orders = items.map((socialNetwork, index) => {
                return {
                    id: socialNetwork.id,
                    order: index,
                }
            });

            await api.patch('socialNetworks/reorder', {
                user_id: user.id,
                social_networks_ids_orders,
            });

            setSocialNetworks(items);

            Notify.success('Redes Sociais reordenadas com sucesso.', constants.notiflix.notify);
        } catch (err) {
        }
    }

    const handleDeleteSocialNetwork = async (social_network_id: string, social_network_type_name: string) => {
        Confirm.show(
            'Remoção de rede social',
            `Tem certeza que deseja remover a rede social "${social_network_type_name}"?`,
            'Sim',
            'Não',
            async function () {
                try {

                    const response = await api.delete('socialNetworks', {
                        data: {
                            social_network_id,
                        }
                    });

                    if (response.status === 204) {
                        const updatedSocialNetworks = socialNetworksState.filter((socialNetwork) => {
                            if (socialNetwork.id !== social_network_id) {
                                return socialNetwork;
                            }
                        });

                        setSocialNetworks(updatedSocialNetworks);

                        Notify.warning('Rede Social removida com sucesso.', constants.notiflix.notify);
                    }
                } catch (err) {
                }
            },
            function () {
            },
            {
                titleColor: '#ff1500',
                okButtonBackground: '#ff1500',
            }
        );
    }

    return (
        <>
            <Head>
                <title>Minhas Preferências | Lnk.App</title>
            </Head>

            <main className={styles.container}>
                <div className={`row ` + styles.pages}>
                    {(userState.avatar?.length > 0) ?
                        <div className="col-md-12 mb-3">
                            <img className={styles.userAvatar} alt="User Avatar" src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/users/avatar/${userState.avatar}`} />
                        </div>
                        : ''
                    }
                    <div className="col-md-12 mb-3">
                        <FileUploader fileInputText="Trocar Imagem" handleSubmission={handleImageSubmission} />
                    </div>
                    <div className="col-md-12 mb-3">
                        <form onSubmit={handleSubmit(data => handleUpdateUserSettings(data))}>

                            <div className={styles.formGroup}>
                                <label>Usuário</label>
                                <input
                                    name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                    onChange={(e) => disableOnChange(e, e.target.value, 'username')}
                                />
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
                                <label>Bio</label>
                                <input name="bio" type="text" {...register('bio')} className={`form-control ${errors.bio ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.bio?.message}</div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Título do Perfil <small>(ex: Página de {userState.username.toLowerCase()})</small></label>
                                <input name="profile_title" type="text" {...register('profile_title')} className={`form-control ${errors.profile_title ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.profile_title?.message}</div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Nova Senha</label>
                                <input name="new_password" type="password" {...register('new_password')} className={`form-control ${errors.new_password ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.new_password?.message}</div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Confirme a Nova Senha</label>
                                <input name="new_password_confirm" type="password" {...register('new_password_confirm')} className={`form-control ${errors.new_password_confirm ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.new_password_confirm?.message}</div>
                            </div>

                            <div className={styles.formGroup}>
                                <Button type="submit" disabled={formState.isSubmitting} size="lg" className={`w-25 ${styles.button}`}>
                                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                    Salvar
                                </Button>
                                <Link href={`/${userState.username}/pages/?addVisits=false`} target="_blank">
                                    <Button size="lg" className={`w-25 mt-2 ${styles.button}`}>
                                        Ver perfil público
                                    </Button>
                                </Link>
                            </div>
                        </form>

                        {(socialNetworkTypes.length > 0) &&
                            <>
                                <br />
                                <label>Adicione uma rede social:</label>
                                <EasyEdit
                                    type="select"
                                    options={
                                        socialNetworkTypes.map((socialNetworkType) => (
                                            { label: socialNetworkType.name, value: socialNetworkType.id, }
                                        ))
                                    }
                                    onSave={(value) => handleSocialNetworkCreation(user.id, value)}
                                    saveButtonLabel={<FaCheckCircle />}
                                    cancelButtonLabel={<FaTimesCircle />}
                                    placeholder="Escolha a rede social"
                                />
                            </>
                        }

                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Droppable droppableId="socialNetworksList">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className={styles.socialNetwork}>
                                        {
                                            (windowsReadyLoading && socialNetworksState?.length > 0 && socialNetworksState.map((socialNetwork, index) => (
                                                <Draggable key={socialNetwork.id} draggableId={socialNetwork.id} index={index}>
                                                    {(provided) => (
                                                        <div className={styles.userSocialNetworks} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                            <EasyEdit
                                                                type="select"
                                                                options={
                                                                    socialNetworkTypes.map((socialNetworkType) => (
                                                                        { label: socialNetworkType.name, value: socialNetworkType.id, }
                                                                    ))
                                                                }
                                                                value={socialNetwork.socialNetworkType.id}
                                                                onSave={() => console.log()}
                                                                onBlur={(value) => handleSocialNetworkChange(null, value, socialNetwork.id)}
                                                                disableAutoSubmit={true}
                                                                saveOnBlur
                                                                placeholder="Escolha a rede social"
                                                            />
                                                            <EasyEdit
                                                                type={Types.TEXT}
                                                                onSave={() => console.log()}
                                                                onBlur={(value) => handleSocialNetworkChange(value, null, socialNetwork.id)}
                                                                disableAutoSubmit={true}
                                                                value={socialNetwork.url}
                                                                saveOnBlur
                                                                placeholder="Escolha uma URL"
                                                                attributes={{
                                                                    name:
                                                                        "awesome-input",
                                                                    id:
                                                                        `input-url-${socialNetwork.id}`,
                                                                }}
                                                                instructions=""
                                                            />
                                                            <br />
                                                            <i className={styles.trashIcon} onClick={() => handleDeleteSocialNetwork(socialNetwork.id, socialNetwork.socialNetworkType.name)} >
                                                                <FaTrashAlt />
                                                            </i>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )))
                                        }
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                    <div className="col-md-12">
                        <i>Última atualização: {userState.updatedAt}</i>
                        <br />
                        <i>Criado em {userState.createdAt}</i>
                    </div>
                </div>
            </main>
        </>
    );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    // quando chamar a partir do servidor, chama o setupAPIClient passando o contexto
    const apiClient = setupAPIClient(ctx);

    // o try-catch está sendo feito dentro do withSSRAuth
    const response = await apiClient.get('users/me');

    const userResponseData = response.data;

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

    const socialNetworksResponse = await apiClient.get('socialNetworks', {
        params: {
            user_id: userFormatted.id,
            get_social_network_types: true,
        }
    });

    const socialNetworks = socialNetworksResponse.data.socialNetworks.map(socialNetwork => {
        return {
            id: socialNetwork.id,
            linkId: socialNetwork.link_id,
            url: socialNetwork.url,
            order: socialNetwork.order,
            userId: socialNetwork.user_id,
            updatedAt: socialNetwork.updated_at,

            socialNetworkType: socialNetwork.socialNetworkType,
        }
    });

    const socialNetworkTypes = socialNetworksResponse.data.socialNetworkTypes.map(socialNetworkType => {
        return {
            id: socialNetworkType.id,
            name: socialNetworkType.name,
            url: socialNetworkType.url,
            image: socialNetworkType.image,
            placeholder: socialNetworkType.placeholder,
            label: socialNetworkType.label,
        }
    });

    return {
        props: {
            user: userFormatted,
            socialNetworks,
            socialNetworkTypes,
        }
    }
});