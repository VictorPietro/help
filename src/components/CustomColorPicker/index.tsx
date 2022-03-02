import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaCheck, FaPaintBrush, FaPalette, FaTimes } from 'react-icons/fa';
import { HexColorPicker, HexColorInput } from "react-colorful";

import { GradientPicker } from 'react-linear-gradient-picker';
import { Panel as ColorPicker } from 'rc-color-picker';
import 'react-linear-gradient-picker/dist/index.css';

import styles from './styles.module.scss';

const WrappedColorPicker = ({ onSelect, ...rest }) => (
    <ColorPicker {...rest} onChange={c => {
        onSelect(c.color, c.alpha / 100);
    }} />
);

const CustomColorPicker = props => {
    const [color, setColor] = useState(props.color)
    const [idColor, setIdColor] = useState(null);

    const handlePickerClick = async (id?: string) => {
        if (id) {
            if (id === idColor) {
                // if click on square again, closes icon picker
                setIdColor(null);

                return;
            }

            setIdColor(id);
        } else {
            // if null, "cleans" setIdColor, i.e., closes icon picker
            setIdColor(null);
        }
    }

    const handleFlatColorChange = async (selectedColor) => {
        try {
            if (props.type !== 'gradient') {
                // console.log(selectedColor)
                setColor(selectedColor);
            } else {
                // console.log(palette)
                setPalette(selectedColor);
            }
            // handle icon Change in parent page that calls this child component (because there's specific handling for each page)
            // const colorChanged = await props.handleColorChange(selectedColor, 'flat');

            // if (colorChanged) {
            setColor(selectedColor);
            // }
        } catch (err) {

        }
    }

    const handleFlatColorConfirm = async (type: string) => {
        handlePickerClick(null)

        try {
            if (type !== 'gradient') {
                const colorChanged = await props.handleColorChange(color, type);
            } else {
                const colorChanged = await props.handleColorChange(palette, type);
            }
        } catch (err) {

        }
    }

    const [palette, setPalette] = useState([
        { offset: '0.00', color: 'rgb(0, 0, 0)' },
        { offset: '1.00', color: 'rgb(255, 0, 0)' }
    ]);

    return (
        <>

            {(idColor !== props.id) &&
                <Button className={`w-25 mt-2 ${styles.button}`} onClick={() => handlePickerClick(props.id)} title="Trocar cor">
                    {
                        (props.type !== 'gradient') ? <FaPaintBrush /> : <FaPalette />
                    }
                </Button>
            }
            {(idColor === props.id) && (props.type !== 'gradient') &&
                <>
                    <HexColorPicker color={color} onChange={handleFlatColorChange} />
                    <HexColorInput color={color} onChange={handleFlatColorChange} />
                    <Button className={`w-25 mt-2 ${styles.button}`} onClick={() => handlePickerClick(null)} title="Cancelar troca de cor">
                        <FaTimes />
                    </Button>
                    <Button className={`w-25 mt-2 ${styles.button}`} onClick={() => handleFlatColorConfirm(props.type)} title="Trocar cor">
                        <FaCheck />
                    </Button>
                </>
            }

            {(idColor === props.id) && (props.type === 'gradient') &&
                <>
                    <GradientPicker {...{
                        width: 320,
                        paletteHeight: 32,
                        palette,
                        onPaletteChange: setPalette
                    }}>
                        <WrappedColorPicker onSelect={() => { }} />
                    </GradientPicker>
                    <br />
                    <br />
                    <br />
                    <br />
                    <Button className={`w-25 mt-2 ${styles.button}`} onClick={() => handlePickerClick(null)} title="Cancelar troca de cor">
                        <FaTimes />
                    </Button>
                    <Button className={`w-25 mt-2 ${styles.button}`} onClick={() => handleFlatColorConfirm(props.type)} title="Trocar cor">
                        <FaCheck />
                    </Button>
                </>
            }
            {/* {(props.type === 'gradient') &&
                <Button className={`w-25 mt-2 ${styles.button}`} onClick={() => palette.map((color) => (console.log(`${color.color} ${color.offset}`)))} title="Trocar cor" style={toRN(`
                    background: linear-gradient(90deg,
                        ${palette.map((color) => (
                    `${color.color} ${color.offset}`
                ))
                    } 
                    );`)
                }>
                    <FaTimes />
                </Button>
            } */}
        </>
    );
}

export default CustomColorPicker;