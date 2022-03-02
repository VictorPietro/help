import Head from "next/head";
import React from 'react';
import { Button } from 'react-bootstrap';
import { Confirm } from 'notiflix';
import { useEffect, useState } from "react";
import { FaCalendarTimes, FaCheckCircle, FaExclamationCircle, FaImage, FaTimesCircle, FaTrashAlt, FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaSmile } from "react-icons/fa";
import * as FaIcons from "react-icons/fa";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import * as EmailValidator from 'email-validator';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import EasyEdit, { Types } from 'react-easy-edit';
import DOMPurify from 'dompurify';

import styles from './page.module.scss';

import { Link } from "../../../../components/Link";

import { withSSRAuth } from "../../../../utils/withSSRAuth";
import { toRN } from "../../../../utils/transformCSStoRN";
import { setupAPIClient } from "../../../../services/api";
import { api } from "../../../../services/apiClient";

import { constants } from "../../../../utils/constants";
import CustomCalendarPicker from "../../../../components/CustomCalendarPicker";
import { formatISO } from "date-fns";
import { areDatesInRange } from "../../../../utils/datesHandler";
import FileUploader from "../../../../components/FileButton";
import CustomContactFormEditor from "../../../../components/CustomContactFormEditor";
import CustomSwitch from "../../../../components/CustomSwitch";
import CustomContactFormView from "../../../../components/CustomFormView";
import CustomContactFormEntries from "../../../../components/CustomContactFormEntries";
import CustomIconPicker from "../../../../components/CustomIconPicker";

interface Page {
    id: string;
    title: string;
    description: string;
    image: string;
    url: string;
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
    order: number;
    url: string;
    image: string;
    status: boolean;
    dateStart: Date;
    dateStartFormatted: string;
    dateEnd: Date;
    dateEndFormatted: string;
    visits_count: number;
    updatedAt: string;
    dateIsVisible: boolean;

    linkType: LinkType;
    form?: Form;
    socialNetwork?: SocialNetwork;
}

interface FormField {
    id: string;
    formFieldTypeId: string;
    formId: string;
    required: boolean;
    status: boolean;
    order: number;
    updatedAt: string;

    // these are obtained from Form Field Types
    name: string;
    label: string;
    placeholder: string;
    inputType: string;
}

interface FormEntry {
    id: string;
    formEntryFields: any;
    sentTo: string;
    read: boolean;
    createdAt: string;
}

interface Form {
    id: string;
    formTypeId: string;
    linkId: string;
    description: string;
    responseEmail: boolean;
    responseToEmail: string;
    thankYouMessage: string;
    updatedAt: string;

    formType: FormType;
    formFields: FormField[];
    formEntries?: FormEntry[];
}

interface User {
    username: string;
}

interface LinkType {
    id: string;
    name: string;
    description: string;
    special: boolean;
}

interface FormType {
    id: string;
    name: string;
    description: string;
}

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
    url: string;
    userId?: string;
    isUserSocial?: boolean;
    updatedAt: string;

    socialNetworkType: SocialNetworkType;
}

interface UserPageProps {
    links: Link[];
    page: Page;
    theme: any;
    user: User;
    setPrintHeader: any;
    linkTypes: LinkType[];
    specialLinkTypes: LinkType[];
    formTypes: FormType[];
    socialNetworkTypes: SocialNetworkType[];
}

export default function UserPage({ links, page, theme, user, setPrintHeader, linkTypes, specialLinkTypes, formTypes, socialNetworkTypes }: UserPageProps) {
    setPrintHeader(true);
    // TODO check if everything is set and if not, redirect

    // use this to make sure page is loaded and draggable elements can be printed
    const [windowsReadyLoading, setwindowsReadyLoading] = useState(false);

    // wait page load
    useEffect(() => {
        // this means page is loaded completely
        setwindowsReadyLoading(true);
    }, []);

    const [linksState, setLinks] = useState<Link[] | null>(links);

    const handleDeleteLink = async (link_id: string, link_title: string) => {
        Confirm.show(
            'Remoção de link',
            `Tem certeza que deseja remover o link "${link_title}"?`,
            'Sim',
            'Não',
            async function () {
                try {

                    const response = await api.delete('links', {
                        data: {
                            link_id,
                        }
                    });

                    if (response.status === 204) {
                        const updatedLinks = linksState.filter((link) => {
                            if (link.id !== link_id) {
                                return link;
                            }
                        });

                        setLinks(updatedLinks);

                        Notify.warning('Link removido com sucesso.', constants.notiflix.notify);
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

    const handleDeleteFormField = async (form_field_id: string, form_field_placeholder: string, link: Link) => {
        Confirm.show(
            'Remoção de campo',
            `Tem certeza que deseja remover o campo "${form_field_placeholder}"?`,
            'Sim',
            'Não',
            async function () {
                try {

                    const response = await api.delete('formFields', {
                        data: {
                            form_field_id,
                        }
                    });


                    if (response.status === 204) {
                        const updatedLinks = linksState.map((linkMap) => {
                            if (linkMap.id === link.id) {
                                // remove specific element
                                linkMap.form.formFields.splice(linkMap.form.formFields.findIndex(formFieldMap => formFieldMap.id === form_field_id), 1);
                            }

                            return linkMap;
                        });

                        setLinks(updatedLinks);

                        Notify.warning('Campo removido com sucesso.', constants.notiflix.notify);
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

    const handleOnDragEnd = async (result) => {
        // console.log(result)
        // avoid error when element is dragged outside of the defined droppable container
        if (!result.destination) return;
        if (result.source.index === result.destination.index) return;

        try {

            if (result.type == "linksDroppable") {
                // create a new copy of our links array
                const items = Array.from(linksState);
                //  use the source.index value to find our item from our new array and remove it using the splice method
                const [reorderedLinks] = items.splice(result.source.index, 1);   // result is destructured, so we end up with a new object of reorderedLinks that is our dragged item
                // use our destination.index to add that item back into the array, but at it’s new location, again using splice
                items.splice(result.destination.index, 0, reorderedLinks);

                const links_ids_orders = items.map((link, index) => {
                    return {
                        id: link.id,
                        order: index,
                    }
                });

                await api.patch('links/reorder', {
                    page_id: page.id,
                    links_ids_orders,
                });

                setLinks(items);

                Notify.success('Links reordenados com sucesso.', constants.notiflix.notify);
            } else if (result.type == "formFieldsDroppable") {
                // get form id from droppableId
                if (!result.destination.droppableId || result.destination.droppableId.length <= 0) return;

                const linkId = result.destination.droppableId.split('#')[1];
                const formId = result.destination.droppableId.split('#')[2];

                // get link
                const link = linksState.find(link => {
                    return link.id === linkId;
                });

                if (!link) return;

                // create a new copy of our formFields array
                const items = Array.from(link.form.formFields);   // TODO get specific link id to get specific form
                //  use the source.index value to find our item from our new array and remove it using the splice method
                const [reorderedFormFields] = items.splice(result.source.index, 1);   // result is destructured, so we end up with a new object of reorderedFormFields that is our dragged item
                // use our destination.index to add that item back into the array, but at it’s new location, again using splice
                items.splice(result.destination.index, 0, reorderedFormFields);

                const form_fields_ids_orders = items.map((formField, index) => {
                    return {
                        id: formField.id,
                        order: index,
                    }
                });

                await api.patch('formFields/reorder', {
                    form_id: formId,
                    form_fields_ids_orders,
                });

                const updatedLinks = linksState.map((linkMap) => {
                    if (linkMap.id === linkId) {
                        linkMap.form.formFields = items;
                    }

                    return linkMap;
                });

                setLinks(updatedLinks);

                Notify.success('Campos reordenados com sucesso.', constants.notiflix.notify);
            }
        } catch (err) {
        }
    }

    const handleLinkChange = async (title: string, url: string, link_id: string) => {
        const cleanTitle = DOMPurify.sanitize(title);
        const cleanUrl = DOMPurify.sanitize(url);
        let fieldChanged = false;

        try {
            await api.patch('links/edit', {
                link_id,
                title: cleanTitle,
                url: cleanUrl,
            });

            const updatedLinks = linksState.map((link) => {
                if (link.id === link_id) {
                    if (link.title !== cleanTitle || link.url !== cleanUrl) {
                        fieldChanged = true;
                        link.title = cleanTitle;
                        link.url = cleanUrl;
                    }
                }

                return link;
            });

            if (fieldChanged) {
                setLinks(updatedLinks);

                Notify.success('Link atualizado.', constants.notiflix.notify);
            }
        } catch (err) {
        }
    }

    const handleIconChange = async (selectedIcon, link: Link) => {
        let fieldChanged = false;

        try {
            const formData = new FormData();

            formData.append('link_id', link.id);
            formData.append('icon_name', selectedIcon);
            formData.append('type', 'ICON');

            const response = await api.patch('links/image',
                formData
            );

            const updatedLinks = linksState.map((linkMap) => {
                if (linkMap.id === link.id) {
                    linkMap.image = `<${selectedIcon} />`;
                }

                return linkMap;
            });

            setLinks(updatedLinks);

            // setSelectedFile(null);
            // setIsSelected(false);

            Notify.success('Ícone atualizado com sucesso.', constants.notiflix.notify);

            return 1;
        } catch (err) {
        }
    }

    const handleCalendarChange = async (ranges, link: Link) => {
        let fieldChanged = false;

        const selectedStartDate = ranges.selection.startDate;
        const convertedStartDate = formatISO(selectedStartDate)
        // const convertedStartDate = format(selectedStartDate, 'MM/dd/yyyy')

        const selectedEndDate = ranges.selection.endDate;
        const convertedEndDate = formatISO(selectedEndDate);

        try {
            await api.patch('links/edit', {
                link_id: link.id,
                date_start: convertedStartDate,
                date_end: convertedEndDate,
            });

            const updatedLinks = linksState.map((linkMap) => {
                if (linkMap.id === link.id) {
                    if (linkMap.dateStart !== selectedStartDate) {
                        fieldChanged = true;
                        linkMap.dateStart = selectedStartDate;

                        linkMap.dateStartFormatted = new Date(selectedStartDate).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        });
                    }

                    if (linkMap.dateEnd !== selectedEndDate) {
                        fieldChanged = true;
                        linkMap.dateEnd = selectedEndDate;

                        linkMap.dateEndFormatted = new Date(selectedEndDate).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        });
                    }


                    linkMap.dateIsVisible = (areDatesInRange(linkMap.dateStart, linkMap.dateEnd)) ? true : false;
                }

                return linkMap;
            });

            if (fieldChanged) {
                // update links
                setLinks(updatedLinks);

                Notify.success("Período de exibição atualizado.", constants.notiflix.notify);

                areDatesInRange(selectedStartDate, selectedEndDate);

                return fieldChanged;
            }
        } catch (err) {
        }
    }

    const handleCalendarDelete = async (link: Link) => {
        try {
            if (link.dateStart || link.dateEnd) {
                await api.patch('links/edit', {
                    link_id: link.id,
                    date_start: null,
                    date_end: null,
                });

                const updatedLinks = linksState.map((linkMap) => {
                    if (linkMap.id === link.id) {
                        if (linkMap.dateStart) {
                            linkMap.dateStart = null;
                            linkMap.dateStartFormatted = null;
                        }

                        if (linkMap.dateEnd) {
                            linkMap.dateEnd = null;
                            linkMap.dateEndFormatted = null;
                        }

                        linkMap.dateIsVisible = true;
                    }

                    return linkMap;
                });

                // update links
                setLinks(updatedLinks);

                Notify.success("Período de exibição removido.", constants.notiflix.notify);
            }
        } catch (err) {
        }
    }

    const handleLinkTypeChange = async (link: Link, type_id: string) => {
        if (link.linkType.id !== type_id && (type_id.length > 0)) {
            const linkType = linkTypes.filter((type: LinkType) => {
                if (type.id === type_id) {
                    return type;
                }
            })[0];

            let newUrl = link.url;

            if (linkType.name === 'internal') {
                newUrl = `/${user.username}/pages`;
            } else if (linkType.name === 'external') {
                newUrl = `https://`;
            }

            try {
                await api.patch('links/edit', {
                    link_id: link.id,
                    type_id: type_id,
                    url: newUrl,
                });

                const updatedLinks = linksState.map((linkMap) => {
                    if (linkMap.id === link.id) {
                        linkMap.linkType.id = type_id;
                        linkMap.linkType.name = linkType.name;
                        linkMap.linkType.description = linkType.description;

                        linkMap.url = newUrl;
                    }

                    return linkMap;
                });

                setLinks(updatedLinks);

                Notify.success('Tipo de Link atualizado.', constants.notiflix.notify);
            } catch (err) {
            }
        }
    }

    // TODO update default url value when changed?
    const handleSocialNetworkTypeChange = async (link: Link, socialNetworkTypeId: string) => {
        if (link?.socialNetwork.socialNetworkType.id !== socialNetworkTypeId) {
            try {
                const socialNetworkType = socialNetworkTypes.filter((socialNetworkType: SocialNetworkType) => {
                    if (socialNetworkType.id === socialNetworkTypeId) {
                        return socialNetworkType;
                    }
                })[0];

                await api.patch('socialNetworks/edit', {
                    social_network_id: link.socialNetwork.id,
                    social_network_type_id: socialNetworkTypeId,
                    url: `${socialNetworkType.url}/${user.username}`,
                });

                const updatedLinks = linksState.map((linkMap) => {
                    if (linkMap.id === link.id) {
                        const newSocialNetworkType = socialNetworkTypes.filter((type) => {
                            if (type.id === socialNetworkTypeId) return type;
                        });

                        linkMap.url = `${socialNetworkType.url}/${user.username}`;

                        linkMap.socialNetwork.socialNetworkType = {
                            id: newSocialNetworkType[0].id,
                            name: newSocialNetworkType[0].name,
                            url: newSocialNetworkType[0].url,
                            image: newSocialNetworkType[0].image,
                            placeholder: newSocialNetworkType[0].placeholder,
                            label: newSocialNetworkType[0].label,
                        }
                    }

                    return linkMap;
                });

                setLinks(updatedLinks);

                Notify.success('Rede social atualizada.', constants.notiflix.notify);
            } catch (err) {
            }
        }
    }

    const handleImageSubmission = async (selectedFile: File, setSelectedFile: any, setIsSelected: any, link?: Link) => {
        if (selectedFile !== null && selectedFile !== undefined && setSelectedFile && setIsSelected) {
            try {
                const formData = new FormData();

                formData.append('link_id', link.id);
                formData.append('image', selectedFile);
                formData.append('type', 'IMAGE');

                const response = await api.patch('links/image',
                    formData
                );

                const newImage = response.data.new_image;

                const updatedLinks = linksState.map((linkMap) => {
                    if (linkMap.id === link.id) {
                        linkMap.image = newImage;
                    }

                    return linkMap;
                });

                setLinks(updatedLinks);

                setSelectedFile(null);
                setIsSelected(false);

                Notify.success('Imagem atualizada com sucesso.', constants.notiflix.notify);
            } catch (err) {
            }
        }
    };

    const handleImageDelete = async (link: Link) => {
        if (!link) {
            return false;
        }

        try {
            const formData = new FormData();

            formData.append('link_id', link.id);
            formData.append('type', 'DELETE');

            await api.patch('links/image',
                formData
            );

            const updatedLinks = linksState.map((linkMap) => {
                if (linkMap.id === link.id) {
                    linkMap.image = null;
                }

                return linkMap;
            });

            setLinks(updatedLinks);

            Notify.success('Imagem removida com sucesso.', constants.notiflix.notify);
        } catch (err) {
        }
    }

    const handleCreateLink = async () => {
        try {
            const newLink = {
                type_id: linkTypes[0].id,
                image_type: 'NONE',
                page_id: page.id,
                title: `Novo link de ${user.username}`,
                url: `/${user.username}/pages/`,
                status: false,
            }

            const response = await api.post('links', newLink);

            const createdLink = { ...response.data.link, dateIsVisible: false, linkType: linkTypes[0] };

            Notify.success('Link criado com sucesso - não esqueça de atualizar seus dados.', constants.notiflix.notify);

            setLinks([...linksState, createdLink]);
        } catch (err) {
        }
    }

    const handleCreateSpecialLink = async (specialLinkType: LinkType) => {
        try {
            if (specialLinkType.name === 'form') {
                const newLink = {
                    type_id: specialLinkType.id,
                    image_type: 'NONE',
                    page_id: page.id,
                    title: `Novo formulário de ${user.username}`,
                    url: `/${user.username}/pages/`,
                    status: false,
                    form_type_id: formTypes[0].id,
                }

                const response = await api.post('links', newLink);

                const createdLink = { ...response.data.link, dateIsVisible: false, linkType: specialLinkType };

                const form: Form = {
                    id: response.data.formData.form.id,
                    formTypeId: response.data.formData.form.form_type_id,
                    linkId: response.data.formData.form.link_id,
                    description: response.data.formData.form.description,
                    responseEmail: response.data.formData.form.response_email,
                    responseToEmail: response.data.formData.form.response_to_email,
                    thankYouMessage: response.data.formData.form.thank_you_message,
                    updatedAt: response.data.formData.form.updated_at,

                    formType: {
                        id: response.data.formData.formType.id,
                        name: response.data.formData.formType.name,
                        description: response.data.formData.formType.description,
                    },

                    formFields: response.data.formData.formFields.map((field) => {
                        return {
                            id: field.formField.id,
                            order: field.formField.order,
                            required: field.formField.required,
                            status: field.formField.status,
                            updatedAt: field.formField.updated_at,

                            name: field.formFieldType.name,
                            label: field.formFieldType.label,
                            placeholder: field.formFieldType.placeholder,
                            inputType: field.formFieldType.input_type,
                        }
                    }),
                }

                const createdLinkWithForm = { ...createdLink, form };

                Notify.success('Formulário criado com sucesso - não esqueça de atualizar seus dados.', constants.notiflix.notify);

                setLinks([...linksState, createdLinkWithForm]);
            } else if (specialLinkType.name === 'social') {
                const newLink = {
                    type_id: specialLinkType.id,
                    image_type: 'NONE',
                    page_id: page.id,
                    title: `Nova rede social de ${user.username}`,
                    url: `${socialNetworkTypes[0].url}/${user.username}`,
                    status: false,
                    social_network_type_id: socialNetworkTypes[0].id,
                }

                const response = await api.post('links', newLink);

                const createdLink = { ...response.data.link, dateIsVisible: false, linkType: specialLinkType };

                const socialNetwork: SocialNetwork = {
                    id: response.data.socialNetworkData.socialNetwork.id,
                    linkId: response.data.socialNetworkData.socialNetwork.link_id,
                    url: response.data.socialNetworkData.socialNetwork.url,
                    userId: response.data.socialNetworkData.socialNetwork.user_id,
                    isUserSocial: response.data.socialNetworkData.socialNetwork.is_user_social,
                    updatedAt: response.data.socialNetworkData.socialNetwork.updated_at,

                    socialNetworkType: {
                        id: response.data.socialNetworkData.socialNetworkType.id,
                        name: response.data.socialNetworkData.socialNetworkType.name,
                        url: response.data.socialNetworkData.socialNetworkType.url,
                        image: response.data.socialNetworkData.socialNetworkType.image,
                        placeholder: response.data.socialNetworkData.socialNetworkType.placeholder,
                        label: response.data.socialNetworkData.socialNetworkType.label,
                    },
                }

                const createdLinkWithSocialNetwork = { ...createdLink, socialNetwork };

                Notify.success('Rede social criada com sucesso - não esqueça de atualizar seus dados.', constants.notiflix.notify);

                setLinks([...linksState, createdLinkWithSocialNetwork]);
            }
        } catch (err) {
        }
    }

    interface IHandleLinkStatusChange {
        status: boolean;
    }

    const handleLinkStatusChange = async (link: Link, { status }: IHandleLinkStatusChange) => {
        const statusIsSet = (status === undefined || status === null) ? false : true;

        let fieldChanged = false;

        try {
            await api.patch('links/edit', {
                link_id: link.id,
                status: (statusIsSet) ? !link.status : undefined,
            });

            const updatedLinks = linksState.map((linkMap: Link) => {
                if (linkMap.id === link.id) {
                    if (statusIsSet) {
                        linkMap.status = status;
                        linkMap.dateIsVisible = (((!linkMap.dateStart && !linkMap.dateEnd) || areDatesInRange(linkMap.dateStart, linkMap.dateEnd)) && linkMap.status) ? true : false;
                        fieldChanged = true;
                    }
                }

                return linkMap;
            });

            if (fieldChanged) {
                // update links
                setLinks(updatedLinks);

                Notify.success("Status atualizado.", constants.notiflix.notify);

                return fieldChanged;
            }
        } catch (err) {
        }
    }
    interface IHandleFormChange {
        response_email?: boolean;
        response_to_email: string;
        description: string;
        thank_you_message: string;
        link_id: string;
        form_id: string;
    }

    const handleFormChange = async (form: Form, { response_email, response_to_email, description, thank_you_message, link_id }: IHandleFormChange) => {
        const cleanResponseToEmail = DOMPurify.sanitize(response_to_email);
        const cleanDescription = DOMPurify.sanitize(description);
        const cleanThankYouMessage = DOMPurify.sanitize(thank_you_message);
        const responseEmailIsSet = (response_email === undefined || response_email === null) ? false : true;

        let fieldChanged = false;

        try {
            const validateEmail = EmailValidator.validate(cleanResponseToEmail);

            if (!validateEmail) {
                Notify.failure("E-mail inválido!", constants.notiflix.notify);
                throw new Error();
            }

            await api.patch('forms/edit', {
                form_id: form.id,
                response_email: (responseEmailIsSet) ? !form.responseEmail : undefined,
                response_to_email: cleanResponseToEmail,
                description: cleanDescription,
                thank_you_message: cleanThankYouMessage,
            });

            const updatedLinks = linksState.map((linkMap: Link) => {
                if (linkMap.id === link_id) {
                    if (responseEmailIsSet) {
                        linkMap.form.responseEmail = !form.responseEmail;
                        fieldChanged = true;
                    }

                    if (linkMap.form.responseToEmail !== cleanResponseToEmail) {
                        linkMap.form.responseToEmail = cleanResponseToEmail;
                        fieldChanged = true;
                    }

                    if (linkMap.form.description !== cleanDescription) {
                        linkMap.form.description = cleanDescription;
                        fieldChanged = true;
                    }

                    if (linkMap.form.thankYouMessage !== cleanThankYouMessage) {
                        linkMap.form.thankYouMessage = cleanThankYouMessage;
                        fieldChanged = true;
                    }
                }

                return linkMap;
            });

            if (fieldChanged) {
                // update links
                setLinks(updatedLinks);

                Notify.success("Formulário atualizado.", constants.notiflix.notify);

                return fieldChanged;
            }
        } catch (err) {
        }
    }
    interface IHandleFormFieldChange {
        status: boolean;
        required: boolean;
    }

    const handleFormFieldChange = async (formField: FormField, { status, required }: IHandleFormFieldChange) => {
        let fieldChanged = false;

        const statusIsSet = (status === undefined || status === null) ? false : true;
        const requiredIsSet = (required === undefined || required === null) ? false : true;

        try {
            await api.patch('formFields/edit', {
                form_field_id: formField.id,
                status: (statusIsSet) ? !formField.status : undefined,
                required: (requiredIsSet) ? !formField.required : undefined,
            });

            const updatedLinks = linksState.map((linkMap) => {
                // check if is form
                if (linkMap.linkType.name === 'form') {
                    // loop through form datas
                    linkMap.form.formFields.map((formFieldMap: FormField) => {
                        if (formFieldMap.id === formField.id) {
                            if (statusIsSet) {
                                formFieldMap.status = !formField.status;
                                fieldChanged = true;
                            }

                            if (requiredIsSet) {
                                formFieldMap.required = !formField.required;
                                fieldChanged = true;
                            }
                        }
                    });
                }

                return linkMap;
            });

            if (fieldChanged) {
                // update links
                setLinks(updatedLinks);

                Notify.success("Campo de formulário atualizado.", constants.notiflix.notify);

                return fieldChanged;
            }
        } catch (err) {
        }
    }


    return (
        <>
            <Head>
                <title>{page.title} | Lnk.App</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.page}>
                    {(page.image?.length > 0) && <img className={styles.pageImage} alt="Page Image" src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/pages/images/${page.image}`} />}
                    <h1>{page.title}</h1>
                    <div
                        className={styles.pageDescription} dangerouslySetInnerHTML={{ __html: page.description }}
                    />
                    <time>Última atualização: {page.updatedAt}</time>
                </div>
                <div className="row mt-5">
                    <div className="col-md-8">
                        <Link href={`/user/pages`}>
                            <Button variant="primary" size="lg" className={`w-25 ${styles.button}`}>
                                Voltar
                            </Button>
                        </Link>
                        {/* <Link href={`/user/page/${page.url}/link/create`}> */}
                        <Button onClick={handleCreateLink} variant="primary" size="lg" className={`w-25 ${styles.button}`}>
                            Adicionar link
                        </Button>
                        {/* </Link> */}
                        <Link href={`/user/page/${page.url}/appearance`}>
                            <Button variant="primary" size="lg" className={`w-25 ${styles.button}`}>
                                Aparência
                            </Button>
                        </Link>
                        {
                            (specialLinkTypes?.length > 0 && specialLinkTypes.map((specialLinkType) => (
                                <Button key={specialLinkType.id} onClick={() => handleCreateSpecialLink(specialLinkType)} variant="primary" size="lg" className={`w-25 mt-3 ${styles.button}`}>
                                    Adicionar {specialLinkType.description}
                                </Button>
                            )))
                        }
                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Droppable type="linksDroppable" droppableId="linksList">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className={styles.page}>
                                        {
                                            (windowsReadyLoading && linksState?.length) ? linksState
                                                .map((link, index) => (
                                                    <Draggable key={link.id} draggableId={link.id} index={index}>
                                                        {(provided) => (
                                                            <div className={styles.pageLinks} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                <div style={theme.font_style}>
                                                                    {(link.linkType.name !== 'social') &&
                                                                        <>
                                                                            {((link.image?.length > 0) && (!link.image?.startsWith('<'))) ?
                                                                                <div className="form-group mb-3">
                                                                                    <img className={`${styles.linkImagePreview} mb-3`} alt="Link Image" src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/links/images/${link.image}`} />
                                                                                    <FileUploader fileInputText="Trocar" handleSubmission={handleImageSubmission} item={link} />
                                                                                    <FaTimesCircle className={styles.deleteImage} onClick={() => handleImageDelete(link)} />
                                                                                </div>
                                                                                :
                                                                                <FileUploader fileInputText={<FaImage />} handleSubmission={handleImageSubmission} item={link} />
                                                                            }
                                                                            <br />
                                                                            <CustomIconPicker
                                                                                handleIconChange={handleIconChange}
                                                                                linksState={linksState}
                                                                                setLinks={setLinks}
                                                                                successMessage="Link atualizado."
                                                                                link={link}
                                                                                // TODO if there is an icon, display it
                                                                                fileInputText={
                                                                                    link.image?.startsWith('<')
                                                                                        ? React.createElement(FaIcons[link.image.slice(1, -3)])
                                                                                        : <FaSmile />
                                                                                }
                                                                            />
                                                                            <br />
                                                                        </>
                                                                    }
                                                                    {/* <time>{link.updatedAt}</time> */}
                                                                    <strong>
                                                                        <EasyEdit
                                                                            type={Types.TEXT}
                                                                            onSave={() => console.log()}
                                                                            onBlur={(value) => handleLinkChange(value, link.url, link.id)}
                                                                            disableAutoSubmit={true}
                                                                            value={link.title}
                                                                            saveOnBlur
                                                                            placeholder="Escolha um título"
                                                                            attributes={{
                                                                                name:
                                                                                    "awesome-input",
                                                                                id:
                                                                                    `input-title-${link.id}`,
                                                                            }}
                                                                            instructions=""
                                                                        />
                                                                    </strong>
                                                                    <EasyEdit
                                                                        type={Types.TEXT}
                                                                        onSave={() => console.log()}
                                                                        onBlur={(value) => handleLinkChange(link.title, value, link.id)}
                                                                        disableAutoSubmit={true}
                                                                        value={link.url}
                                                                        saveOnBlur
                                                                        placeholder="Escolha uma URL"
                                                                        attributes={{
                                                                            name:
                                                                                "awesome-input",
                                                                            id:
                                                                                `input-url-${link.id}`,
                                                                        }}
                                                                        instructions=""
                                                                    />

                                                                    {(!link?.linkType.special) &&
                                                                        <EasyEdit
                                                                            type="select"
                                                                            options={
                                                                                linkTypes.map((linkType) => (
                                                                                    { label: linkType.description, value: linkType.id, }
                                                                                ))
                                                                            }
                                                                            value={link.linkType.description}
                                                                            onSave={(value) => handleLinkTypeChange(link, value)}
                                                                            saveButtonLabel={<FaCheckCircle />}
                                                                            cancelButtonLabel={<FaTimesCircle />}
                                                                            cancelOnBlur
                                                                            placeholder="Escolha o tipo do link"
                                                                        />
                                                                    }

                                                                </div>
                                                                {(link.dateStart && link.dateEnd) ?
                                                                    <>
                                                                        <small className={(!link.dateIsVisible) ? styles.datePeriodOutOfRange : ''} title="O link não está sendo exibido pois o dia de hoje está fora do período de exibição ou sua visibilidade está desabilitada.">
                                                                            <i>
                                                                                {(!link.dateIsVisible) &&
                                                                                    <FaExclamationCircle className={styles.datePeriodOutOfRange} style={{ marginRight: "0.25rem" }} />
                                                                                }
                                                                                {link.dateStartFormatted}{(link.dateEndFormatted !== link.dateStartFormatted) && ` à ${link.dateEndFormatted}`}
                                                                            </i>
                                                                        </small>
                                                                        <br />
                                                                    </>
                                                                    : ''
                                                                }
                                                                {link.visits_count > 0 &&
                                                                    <small>
                                                                        Visitas: {link.visits_count}
                                                                    </small>
                                                                }
                                                                <br />
                                                                <i className={styles.trashIcon} onClick={() => handleDeleteLink(link.id, link.title)} >
                                                                    <FaTrashAlt />
                                                                </i>
                                                                <br />
                                                                <CustomCalendarPicker
                                                                    handleCalendarChange={handleCalendarChange}
                                                                    linksState={linksState}
                                                                    setLinks={setLinks}
                                                                    successMessage="Link atualizado."
                                                                    link={link}
                                                                />
                                                                {link.dateStart && link.dateEnd &&
                                                                    <>
                                                                        <br />
                                                                        <FaCalendarTimes className={styles.deleteCalendar} onClick={() => handleCalendarDelete(link)} />
                                                                    </>
                                                                }

                                                                {(link.linkType.name === 'form') &&
                                                                    <>
                                                                        <br />
                                                                        <CustomContactFormEditor
                                                                            handleFormFieldChange={handleFormFieldChange}
                                                                            handleFormChange={handleFormChange}
                                                                            handleDeleteFormField={handleDeleteFormField}
                                                                            linksState={linksState}
                                                                            setLinks={setLinks}
                                                                            successMessage="Formulário atualizado."
                                                                            link={link}
                                                                        />
                                                                        {(link.form.formEntries?.length > 0) &&
                                                                            <>
                                                                                <br />
                                                                                <CustomContactFormEntries
                                                                                    form={link.form}
                                                                                    handleFormChange={() => console.log()}
                                                                                />
                                                                            </>
                                                                        }
                                                                    </>
                                                                }

                                                                {(link.linkType.name === 'social') &&
                                                                    <>
                                                                        <br />
                                                                        <EasyEdit
                                                                            type="select"
                                                                            options={
                                                                                socialNetworkTypes.map((socialNetworkType) => (
                                                                                    { label: socialNetworkType.name, value: socialNetworkType.id, }
                                                                                ))
                                                                            }
                                                                            value={link?.socialNetwork?.socialNetworkType.name}
                                                                            onSave={(value) => handleSocialNetworkTypeChange(link, value)}
                                                                            saveButtonLabel={<FaCheckCircle />}
                                                                            cancelButtonLabel={<FaTimesCircle />}
                                                                            cancelOnBlur
                                                                            placeholder="Escolha a rede social"
                                                                        />
                                                                    </>
                                                                }

                                                                <br />

                                                                <CustomSwitch field={link} currentStatus={link.status} handleFieldStatusChange={handleLinkStatusChange} specificData={{ status: !link.status }} />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                )) : 'Página sem links.'
                                        }
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                    <div className="col-md-4">
                        <div className={styles.mobile} style={theme.font_style}>
                            <div className={styles.pageBio}>
                                {/* TODO set base api url env */}
                                {(page.image?.length > 0) && <img className={styles.pageAvatar} alt="Page Image" src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/pages/images/${page.image}`} />}
                                {/* TODO verificar se o usuário quer que mostre isso */}
                                <h5 style={{ "marginTop": "1.5rem" }}>@{user.username}</h5>
                                <h6 style={{ "marginTop": "0.6rem" }}>{page.title}</h6>
                                <p style={{ "marginTop": "0.5rem" }}>{page.description}</p>
                            </div>
                            <div className={styles.links}>
                                {linksState
                                    .filter((linkFilter: Link) => {
                                        if (linkFilter.dateIsVisible && linkFilter.linkType.name !== 'social') return linkFilter;
                                    })
                                    .map(link => (
                                        <div key={`mobile_${link.id}`}>
                                            <Link href={`${link.url}`} target="_blank" className={styles.link} style={theme.button_style}>
                                                {
                                                    ((link.image?.length > 0) && (!link.image?.startsWith('<'))) &&
                                                    <img className={`${styles.linkImageMobile} mb-3`} alt="Link Image" src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/links/images/${link.image}`} />
                                                }
                                                {
                                                    ((link.image?.length > 0) && (link.image?.startsWith('<'))) &&
                                                    React.createElement(FaIcons[link.image.slice(1, -3)])
                                                }
                                                {/* <time>{link.updatedAt}</time> */}
                                                <strong>{link.title}</strong>
                                            </Link>
                                            {(link.linkType.name === 'form') &&
                                                <CustomContactFormView
                                                    handleFormFieldChange={handleFormFieldChange}
                                                    handleFormChange={handleFormChange}
                                                    linksState={linksState}
                                                    setLinks={setLinks}
                                                    successMessage="Formulário atualizado."
                                                    link={link}
                                                    submitDisabled={false}
                                                />
                                            }
                                        </div>
                                    ))}
                            </div>

                            <div className={styles.socialLinks}>
                                {linksState
                                    .filter((linkFilter: Link) => {
                                        if (linkFilter.dateIsVisible && linkFilter.linkType.name === 'social') return linkFilter;
                                    })
                                    .map(link => (
                                        <div key={`mobile_social_link_${link.id}`}>
                                            <Link href={`${link.url}`} target="_blank" className={styles.link} style={theme.button_style} title={`${link.title}`}>
                                                {
                                                    ((link.image?.length > 0) && (!link.image?.startsWith('<'))) &&
                                                    <img className={`${styles.linkImageMobile} mb-3`} alt="Link Image" src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/links/images/${link.image}`} />
                                                }
                                                {
                                                    ((link.image?.length > 0) && (link.image?.startsWith('<'))) &&
                                                    React.createElement(FaIcons[link.image.slice(1, -3)])
                                                }
                                                {(link.socialNetwork.socialNetworkType.name === 'facebook') && <FaFacebook />}
                                                {(link.socialNetwork.socialNetworkType.name === 'twitter') && <FaTwitter />}
                                                {(link.socialNetwork.socialNetworkType.name === 'instagram') && <FaInstagram />}
                                                {(link.socialNetwork.socialNetworkType.name === 'youtube') && <FaYoutube />}
                                            </Link>
                                        </div>
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
            page_url: slug,
            get_types: true,
            get_form_types: true,
            get_social_network_types: true,
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
        updatedAt: new Date(pageResponse.data.page.updated_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }) + " às " + new Date(pageResponse.data.page.updated_at).getHours() + ":" + new Date(pageResponse.data.page.updated_at).getMinutes()
    }

    // TODO redirect if page not found

    const theme: Theme = {
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
            get_types: true,
            get_entries: true,
            get_social_networks: true,
        }
    });

    const links = response.data.map(link => {
        return {
            id: link.id,
            title: link.title,
            order: link.order,
            url: link.url,
            image: link.image,
            status: link.status,
            dateStart: link.date_start,
            dateStartFormatted: new Date(link.date_start).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }),
            dateEnd: link.date_end,
            dateEndFormatted: new Date(link.date_end).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }),
            visits_count: link.visits_count,
            updatedAt: new Date(link.updated_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }),
            dateIsVisible: (((!link.date_start && !link.date_end) || areDatesInRange(link.date_start, link.date_end)) && link.status) ? true : false,
            /*
                this "classic approach" performs 10x better:
                if (someCondition)
                    a.b = 5;

                than "spread operator approach":
                    const a2 = {
                        ...(someCondition && {b: 5})
                    }
            */

            linkType: {
                id: link.type.id,
                name: link.type.name,
                description: link.type.description,
                special: link.type.special,
            },

            ...((link.type.name === 'form') &&
            {
                form: {
                    id: link.formData.id,
                    formTypeId: link.formData.form_type_id,
                    linkId: link.formData.link_id,
                    description: link.formData.description,
                    responseEmail: link.formData.response_email,
                    responseToEmail: link.formData.response_to_email,
                    thankYouMessage: link.formData.thank_you_message,
                    updatedAt: link.formData.updated_at,

                    formType: link.formData.formType,
                    formFields: link.formData.formFieldsWithFormFieldType.map((formField) => {
                        return {
                            id: formField.id,
                            formFieldTypeId: formField.form_field_type_id,
                            formId: formField.form_id,
                            required: formField.required,
                            status: formField.status,
                            order: formField.order,
                            updatedAt: formField.id,

                            // these are obtained from Form Field Types
                            name: formField.formFieldType.name,
                            label: formField.formFieldType.label,
                            placeholder: formField.formFieldType.placeholder,
                            inputType: formField.formFieldType.input_type,
                        }
                    }),
                    formEntries: link.formData.formEntries.map((formEntry) => {
                        return {
                            id: formEntry.id,
                            formEntryFields: JSON.parse(formEntry.form_data).map((field) => {
                                const fieldId = Object.keys(field)[0];
                                const label = field[fieldId][0];
                                const value = field[fieldId][1];

                                return {
                                    fieldId: fieldId,
                                    label: label,
                                    value: value,
                                }
                            }),
                            sentTo: formEntry.sent_to,
                            read: formEntry.read,
                            createdAt: formEntry.created_at,
                        }
                    }),
                }
            }),
            ...((link.type.name === 'social') &&
            {
                socialNetwork: {
                    id: link.socialNetworkData.id,
                    linkId: link.socialNetworkData.link_id,
                    url: link.socialNetworkData.url,
                    userId: link.socialNetworkData.user_id,
                    isUserSocial: link.socialNetworkData.is_user_social,
                    updatedAt: link.socialNetworkData.updated_at,

                    socialNetworkType: link.socialNetworkData.socialNetworkType,
                }
            }),
        }
    });

    const linkTypes = pageResponse.data.types.filter((linkType) => {
        if (!linkType.special) {
            return {
                id: linkType.id,
                name: linkType.name,
                description: linkType.description,
            }
        }
    });

    const specialLinkTypes = pageResponse.data.types.filter((linkType) => {
        if (linkType.special) {
            return {
                id: linkType.id,
                name: linkType.name,
                description: linkType.description,
            }
        }
    });

    const formTypes = pageResponse.data.formTypes.map((formType) => {
        return {
            id: formType.id,
            name: formType.name,
            description: formType.description,
        }
    });

    const socialNetworkTypes = pageResponse.data.socialNetworkTypes.map((socialNetworkType) => {
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
            links,
            page,
            theme,
            user,
            linkTypes,
            specialLinkTypes,
            formTypes,
            socialNetworkTypes,
        }
    }
});