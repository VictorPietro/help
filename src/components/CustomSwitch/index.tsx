import React, { useState } from 'react';
import Switch from 'react-switch';

// import styles from './styles.module.scss';

const CustomSwitch = ({ field, currentStatus, specificData, handleFieldStatusChange }) => {
    const [status, setStatus] = useState(currentStatus);

    const handleFieldChange = async (field) => {
        try {
            const fieldChanged = await handleFieldStatusChange(field, specificData);

            if (fieldChanged) {
                setStatus(!status);
            }
        } catch (err) {

        }
    }

    return (
        <>
            <Switch onChange={() => handleFieldChange(field)} checked={status} />
        </>
    );
};

export default CustomSwitch;