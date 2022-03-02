import { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';

import styles from './styles.module.scss';

const FileUploader = props => {
    // Create a reference to the hidden file input element
    const hiddenFileInput = useRef(null);

    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = event => {
        hiddenFileInput.current.click();
    };

    const [selectedFile, setSelectedFile] = useState<File>();
    const [isSelected, setIsSelected] = useState(false);
    const [imageAsBase64, setImageAsBase64] = useState('');

    const changeHandler = (event) => {
        if (event.target.files.length !== 0) {
            setSelectedFile(event.target.files[0]);
            setIsSelected(true);

            let image_as_base64 = URL.createObjectURL(event.target.files[0])
            setImageAsBase64(image_as_base64);

            if (props.handleChangeImageInParent) {
                props.handleChangeImageInParent(event.target.files[0]);
            }
        }
    };

    const handleSubmission = () => {
        props.handleSubmission(selectedFile, setSelectedFile, setIsSelected, props.item);
    }

    return (
        <>
            <Button className={`w-25 mt-2 ${styles.button}`} onClick={handleClick}>
                {props.fileInputText}
            </Button>
            <input
                type="file"
                accept="image/*"
                ref={hiddenFileInput}
                onChange={changeHandler}
                className={styles.hiddenButton}
            />
            {(isSelected && selectedFile) ? (
                <div className={`mt-3`}>
                    <p>Arquivo: {selectedFile?.name} <small>({selectedFile?.type})</small></p>
                    <img className={`${styles.selectedImagePreview}`} src={imageAsBase64} alt="Preview da imagem selecionada" />
                    {!props.hideSaveButton &&
                        <Button onClick={handleSubmission} className={`w-25 mt-2 ${styles.button}`}>
                            Salvar Imagem
                        </Button>
                    }
                </div>
            ) : (
                ''
            )}
        </>
    );
}

export default FileUploader;