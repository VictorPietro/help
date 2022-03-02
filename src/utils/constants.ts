import { INotifyOptions } from 'notiflix';

interface IConstants {
    notiflix: {
        notify: INotifyOptions;
        // the other modules, etc...
    };
}

const constants: IConstants = {
    notiflix: {
        notify: {
            success: {
                background: 'green',
            },
            position: 'left-bottom',
            fontFamily: "Quicksand",
        },
        // the other modules, etc..
    },
};

export { constants };