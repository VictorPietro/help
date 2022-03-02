
import { useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import { Button } from 'react-bootstrap';
import { useForm, FormProvider } from "react-hook-form";
import DOMPurify from 'dompurify';
import { Notify } from 'notiflix';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import styles from './styles.module.scss';
import { api } from '../../services/apiClient';
import { constants } from '../../utils/constants';
import CustomFormInput from '../CustomFormInput';
import CustomFormTextArea from '../CustomFormTextArea';

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

interface CustomFormProps {
    link: Link;
    handleFormChange: any;
    linksState: any;
    setLinks: any;
    successMessage: string;
    handleFormFieldChange: any;
    submitDisabled: boolean;
}

const CustomContactFormView = (props: CustomFormProps) => {

    const [linkForm, setLinkForm] = useState(null);

    const handleFormClick = async (link?: Link) => {
        if (link) {
            if (link.id === linkForm) {
                // if click on form icon again, closes form
                setLinkForm(null);

                return;
            }

            setLinkForm(link.id);
        } else {
            // if null, "cleans" linkForm, i.e., closes form
            setLinkForm(null);
        }
    }

    const handleFormSubmit = async (values) => {
        if (props.submitDisabled) {
            return;
        }

        // DOMPurify.sanitize every field
        Object.keys(values).forEach(input => {
            values[input] = DOMPurify.sanitize(values[input]);
        });

        let form_html = '';

        props.link.form.formFields.filter((formField: FormField) => {
            if (formField.status) return formField;
        }).forEach((formField: FormField) => {
            form_html += `<b>${formField.label}:</b> ${DOMPurify.sanitize(values[formField.id])}<br>`;
        });

        const form_data = JSON.stringify(values);

        try {
            await api.post('formEntries', {
                form_id: props.link.form.id,
                form_data,
                form_html,
            });

            Notify.success("Formulário enviado com sucesso.", constants.notiflix.notify);
            methods.reset();

            return true;
        } catch (err) {
        }
    }

    const methods = useForm();

    return (
        <>
            <i className={styles.formIcon} onClick={() => handleFormClick(props.link)} >
                <FaCaretDown />
            </i>
            {(linkForm === props.link.id) &&
                <FormProvider {...methods} >
                    <form onSubmit={methods.handleSubmit(handleFormSubmit)}>
                        <h6>{props.link.form.description}</h6>
                        <br />
                        {props.link.form.formFields.filter((formField: FormField) => {
                            if (formField.status) return formField;
                        }).map((formField: FormField) => (
                            <div key={formField.id + `-form_field_view`}>
                                {
                                    ((formField.inputType === 'text') || (formField.inputType === 'email')) &&
                                    <CustomFormInput
                                        formField={formField}
                                    />
                                }
                                {
                                    (formField.inputType === 'textarea') &&
                                    <CustomFormTextArea
                                        formField={formField}
                                    />
                                }
                            </div>
                        ))}
                        <Button type={"submit"} variant="primary" size="lg" className={`w-25 ${styles.button}`} disabled={props.submitDisabled}>
                            Enviar
                        </Button>
                    </form>
                </FormProvider>
            }
        </>
    );
}

export default CustomContactFormView;