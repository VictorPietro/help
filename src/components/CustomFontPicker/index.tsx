import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaCheck, FaFont, FaTimes } from 'react-icons/fa';

// react document is not defined
import dynamic from 'next/dynamic';
const FontPicker = dynamic(() => import('font-picker-react'), { ssr: false });

import styles from './styles.module.scss';

const CustomFontPicker = props => {
    const [selectedFont, setSelectedFont] = useState('Roboto');
    const [selectedFontConfirm, setSelectedFontConfirm] = useState('Roboto');
    const [idFont, setIdFont] = useState(null);

    const handleFontClick = async (id?: string) => {
        if (id) {
            if (id === idFont) {
                // if click on square again, closes icon picker
                setIdFont(null);

                return;
            }

            setIdFont(id);
        } else {
            // if null, "cleans" setIdFont, i.e., closes icon picker
            setIdFont(null);
        }
    }

    const handleFontChange = async (selectedFontConfirm) => {
        try {
            // handle font change in parent page that calls this child component (because there's specific handling for each page)
            const fontChanged = await props.handleFontChange(selectedFontConfirm);

            if (fontChanged) {
                handleFontClick(null);
                setSelectedFontConfirm(selectedFont);
            }
        } catch (err) {

        }
    }

    return (
        <>
            <Button className={`w-25 mt-2 ${styles.button}`} onClick={() => handleFontClick(props.id)} title="Trocar fonte">
                <FaFont />
            </Button>
            {(idFont === props.id) &&
                <>
                    {/* @ts-ignore */}
                    <FontPicker
                        apiKey={process.env.NEXT_PUBLIC_GOOGLE_FONTS_DEV_API_KEY}
                        activeFontFamily={selectedFont}
                        onChange={(nextFont) =>
                            setSelectedFont(nextFont.family)
                        }
                    />
                    <p className="apply-font">A fonte escolhida estará aplicada neste texto.</p>

                    <Button className={`w-25 mt-2 ${styles.button}`} onClick={() => handleFontChange(selectedFontConfirm)} title="Trocar fonte">
                        <FaCheck />
                    </Button>
                    <Button className={`w-25 mt-2 ${styles.button}`} onClick={() => {
                        setSelectedFont(selectedFontConfirm);
                        handleFontClick(null);
                    }} title="Trocar fonte">
                        <FaTimes />
                    </Button>
                </>
            }
        </>
    );
}

export default CustomFontPicker;