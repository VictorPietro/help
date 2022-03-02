// parecido com o _app.tsx mas é carregado uma única vez
// pode ser comparado com o index.html do React

import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from "next/script";
import { resetServerContext } from 'react-beautiful-dnd';

export default class MyDocument extends Document {
    render() {
        // fixing react-beautiful-dnd "prop `data-rbd-draggable-context-id` did not match" error
        resetServerContext();

        return (
            <Html>
                <Head>
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap" rel="stylesheet" />
                    <link rel="shortcut icon" href="/favicon.ico" />
                    <Script type="text/javascript" src="notiflix/dist/notiflix-3.1.0.min.js" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}