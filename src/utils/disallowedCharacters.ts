import React from 'react';

const disallowedRegUrl = /[`\s~%^|"<>\{\}\\]/gi;

const disallowedCharsUrl = [
    "[", "`", "~", "%", "^", "|", '"', "<", ">", "{", "}", "\\", "]", ",", " ", "'"
];

const disallowedRegUsername = /[`~!@#$%^&*()|+=?;:'",<>\{\}\[\]\\\/]/gi;

// function disableOnPress(event: React.KeyboardEvent<HTMLInputElement>, char: string) {
//     if (disallowedCharsUrl.includes(char)) {
//         event.preventDefault();
//     }
// }

// function disableOnPaste(event: React.ClipboardEvent<HTMLInputElement>, pastedValue: string) {
//     pastedValue.split("").forEach(char => {
//         if (disallowedCharsUrl.includes(char)) {
//             event.preventDefault();
//             return;
//         }
//     });
// }

function disableOnChange(event: React.ChangeEvent<HTMLInputElement>, stringValue: string, type = '') {
    let disallowedReg = disallowedRegUrl;

    switch (type) {
        case 'username':
            disallowedReg = disallowedRegUsername;
            break;
    }

    const result = stringValue.replace(disallowedReg, '');
    event.target.value = result;
}

function clearString(stringValue: string, type = ''): string {
    let disallowedReg = disallowedRegUrl;

    switch (type) {
        case 'username':
            disallowedReg = disallowedRegUsername;
            break;
    }

    const cleanString = stringValue.replace(disallowedReg, '');

    return cleanString;
}

export { disableOnChange, clearString };