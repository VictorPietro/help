import React, { useState } from 'react';

// import styles from './styles.module.scss';

const CustomCheckbox = ({ field, currentChecked, specificData, handleFieldCheckboxChange }) => {
    const [checked, setChecked] = useState(currentChecked);

    const handleFieldChange = async (field) => {
        try {
            const fieldChanged = await handleFieldCheckboxChange(field, specificData);

            if (fieldChanged) {
                setChecked(!checked);
            }
        } catch (err) {

        }
    }

    return (
        <>
            <input type="checkbox" onChange={() => handleFieldChange(field)} checked={checked} />
        </>
    );
};

export default CustomCheckbox;