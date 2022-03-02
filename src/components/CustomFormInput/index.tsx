import { FieldValues, FormState, useFormContext, UseFormGetValues } from "react-hook-form";
// import styles from './styles.module.scss';

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
    formField: FormField;
}

export default function CustomFormInput({ formField, ...rest }: CustomFormProps) {
    const { register, formState, getValues } = useFormContext();
    const isRequired = (formField.required === true) ? 'required' : null;

    return (
        <div>
            <input
                {...register(formField.id, {
                    required: isRequired,
                    disabled: !formField.status,
                    pattern: /^[a-zA-Z0-9\.\s@]+$/,
                })}
                id={formField.id}
                className={`formField_input form-control ${formState.errors[formField.id] ? 'is-invalid' : ''}`}
                name={formField.id}
                type={formField.inputType}
                placeholder={`${formField.placeholder}${((formField.required === true) ? `*` : ``)}`}
                onChange={() => {
                    // console.log(getValues());
                }}
                // required={(formField.required === true)}
                {...rest}
            />

            {formState.errors[formField.id]?.type === 'required' &&
                <div className="invalid-feedback">Este campo é obrigatório</div>
            }
            {formState.errors[formField.id]?.type === 'pattern' &&
                <div className="invalid-feedback">Caracteres não permitidos</div>
            }
        </div>
    );
}