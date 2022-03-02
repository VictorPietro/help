
import { useState } from 'react';
import { FaRegFileAlt, FaTrashAlt } from 'react-icons/fa';
import EasyEdit, { Types } from 'react-easy-edit';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Confirm } from 'notiflix';

import styles from './styles.module.scss';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import CustomSwitch from '../CustomSwitch';
import CustomCheckbox from '../CustomCheckbox';

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
    handleDeleteFormField: any;
}

const CustomContactFormEditor = (props: CustomFormProps) => {

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

    const handleDeleteFormField = async (form_field_id: string, form_field_placeholder: string, link: Link) => {
        try {
            await props.handleDeleteFormField(form_field_id, form_field_placeholder, link);
        } catch (err) {
        }
    }

    return (
        <>
            <i className={styles.formIcon} onClick={() => handleFormClick(props.link)} >
                <FaRegFileAlt />
            </i>
            {(linkForm === props.link.id) &&
                <>
                    <b>Tipo de formulário: </b>{props.link.form.formType.description}
                    <br />
                    <b>Campos: </b>
                    <br />
                    <Droppable type="formFieldsDroppable" droppableId={`formFieldsList#${props.link.id}#${props.link.form.id}`}>
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className={styles.page}>
                                {props.link.form.formFields.map((formField: FormField, index) => (
                                    <Draggable key={formField.id} draggableId={formField.id} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} title="Arraste para reordenar os campos do formulário">
                                                <b>Nome do campo:</b> {formField.label}
                                                <br />
                                                <b>Status:</b> <CustomSwitch field={formField} currentStatus={formField.status} handleFieldStatusChange={props.handleFormFieldChange} specificData={{ status: true }} />

                                                <i className={styles.trashIcon} onClick={() => handleDeleteFormField(formField.id, formField.placeholder, props.link)} >
                                                    <FaTrashAlt />
                                                </i>

                                                <br />
                                                <b>Obrigatório:</b> <CustomCheckbox field={formField} currentChecked={formField.required} handleFieldCheckboxChange={props.handleFormFieldChange} specificData={{ required: true }} />
                                                <br />
                                                <b>Placeholder:</b> {formField.placeholder}
                                                <br />
                                            </div>

                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    <h3>Respostas: </h3>

                    <br />

                    <b>Deseja enviar para e-mail? </b>
                    <CustomSwitch field={props.link.form} currentStatus={props.link.form.responseEmail} handleFieldStatusChange={props.handleFormChange} specificData={{ response_email: true, response_to_email: props.link.form.responseToEmail, description: props.link.form.description, thank_you_message: props.link.form.thankYouMessage, link_id: props.link.id, form_id: props.link.form.id }} />

                    <br />

                    <b>E-mail: </b>
                    <EasyEdit
                        type={Types.TEXT}
                        onSave={() => console.log()}
                        onBlur={(value) => props.handleFormChange(props.link.form, { response_to_email: value, description: props.link.form.description, thank_you_message: props.link.form.thankYouMessage, link_id: props.link.id, form_id: props.link.form.id })}
                        disableAutoSubmit={true}
                        value={(props.link.form.responseToEmail.length > 0) ? props.link.form.responseToEmail : null}
                        saveOnBlur
                        placeholder="Escolha um e-mail"
                        attributes={{
                            name:
                                "awesome-input",
                            id:
                                `input-responseToEmail-${props.link.form.id}`,
                        }}
                        instructions=""
                    />

                    <h4>Additional settings</h4>

                    <br />

                    <b>Descrição: </b>
                    <EasyEdit
                        type={Types.TEXT}
                        onSave={() => console.log()}
                        onBlur={(value) => props.handleFormChange(props.link.form, { response_to_email: props.link.form.responseToEmail, description: value, thank_you_message: props.link.form.thankYouMessage, link_id: props.link.id, form_id: props.link.form.id })}
                        disableAutoSubmit={true}
                        value={(props.link.form.description.length > 0) ? props.link.form.description : null}
                        saveOnBlur
                        placeholder="Escolha uma descrição"
                        attributes={{
                            name:
                                "awesome-input",
                            id:
                                `input-description-${props.link.form.id}`,
                        }}
                        instructions=""
                    />

                    <br />

                    <b>Mensagem de agradecimento: </b>
                    <EasyEdit
                        type={Types.TEXT}
                        onSave={() => console.log()}
                        onBlur={(value) => props.handleFormChange(props.link.form, { response_to_email: props.link.form.responseToEmail, description: props.link.form.description, thank_you_message: value, link_id: props.link.id, form_id: props.link.form.id })}
                        disableAutoSubmit={true}
                        value={(props.link.form.thankYouMessage.length > 0) ? props.link.form.thankYouMessage : null}
                        saveOnBlur
                        placeholder="Digite uma mensagem de agradecimento"
                        attributes={{
                            name:
                                "awesome-input",
                            id:
                                `input-thankYouMessage-${props.link.form.id}`,
                        }}
                        instructions=""
                    />
                </>
            }
        </>
    );
}

export default CustomContactFormEditor;