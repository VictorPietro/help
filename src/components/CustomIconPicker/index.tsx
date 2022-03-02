import { useState } from 'react';
import { FaSmile } from 'react-icons/fa';
import { IconList, IconPicker } from 'react-fa-icon-picker';
import { Button } from 'react-bootstrap';

import styles from './styles.module.scss';

interface Link {
    id: string;
    title: string;
    order: number;
    url: string;
    dateStart: Date;
    dateStartFormatted: string;
    dateEnd: Date;
    dateEndFormatted: string;
    visits_count: number;
    updatedAt: string;
}

const CustomIconPicker = props => {
    const [value, setValue] = useState<IconList>("")
    const [linkIcon, setLinkIcon] = useState(null);

    const handleIconClick = async (link?: Link) => {
        if (link) {
            if (link.id === linkIcon) {
                // if click on smile icon again, closes icon picker
                setLinkIcon(null);

                return;
            }

            setLinkIcon(link.id);
        } else {
            // if null, "cleans" setLinkIcon, i.e., closes icon picker
            setLinkIcon(null);
        }
    }

    const handleIconChange = async (selectedIcon, link: Link) => {
        try {
            // handle icon Change in parent page that calls this child component (because there's specific handling for each page)
            const iconChanged = await props.handleIconChange(selectedIcon, link);

            if (iconChanged) {
                setValue(selectedIcon);
                setLinkIcon(null);
                handleIconClick(null);
            }
        } catch (err) {

        }
    }

    return (
        <>
            <Button className={`w-25 mt-2 ${styles.button}`} onClick={() => handleIconClick(props.link)} title="Adicionar ícone">
                {props.fileInputText}
            </Button>
            {(linkIcon === props.link.id) &&
                <IconPicker value={value} onChange={(selectedIcon) => handleIconChange(selectedIcon, props.link)} />
            }
        </>
    );
}

export default CustomIconPicker;