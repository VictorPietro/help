
import { useState } from 'react';
import { IoMdMail } from 'react-icons/io';
import EasyEdit, { Types } from 'react-easy-edit';

import styles from './styles.module.scss';

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

interface FormEntry {
    id: string;
    formEntryFields: any;
    sentTo: string;
    read: boolean;
    createdAt: string;
}

interface CustomFormProps {
    form: Form;
    handleFormChange: any;
}

const CustomContactFormEntries = (props: CustomFormProps) => {

    const [formSelected, setFormSelected] = useState(null);

    const handleFormClick = async (form?: Form) => {
        if (form) {
            if (form.id === formSelected) {
                // if click on form icon again, closes form
                setFormSelected(null);

                return;
            }

            setFormSelected(form.id);
        } else {
            // if null, "cleans" formSelected, i.e., closes form
            setFormSelected(null);
        }
    }

    return (
        <>
            <i className={styles.formIcon} onClick={() => handleFormClick(props.form)} >
                <IoMdMail />
            </i>
            {(formSelected === props.form.id) &&
                <>
                    {props.form.formEntries?.map((formEntry, index) => (
                        <div key={formEntry.id}>
                            <h5>Resposta #{index + 1}</h5>
                            {formEntry.formEntryFields.map((formEntryField, index) => (
                                <div key={`entry_${formEntry.id}_${formEntryField.fieldId}_${index}`}>
                                    <b>{formEntryField.label}:</b> <small>{formEntryField.value}</small>
                                </div>
                            ))}
                        </div>
                    ))}
                </>
            }
        </>
    );
}

export default CustomContactFormEntries;