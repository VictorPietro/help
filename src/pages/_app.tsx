import { AppProps } from "next/app"
import { Header } from "../components/Header";
import { AuthProvider } from "../contexts/AuthContext"

import '../styles/global.scss'
import 'bootstrap/dist/css/bootstrap.css';
import { useState } from "react";

import 'notiflix/dist/notiflix-3.2.4.min.css';

// se quiser que algo repita em todas as páginas, é nesse arquivo que se coloca
// sempre que o usuário trocar de tela, esse arquivo será recarregado
function MyApp({ Component, pageProps }: AppProps) {
	const [printHeader, setPrintHeader] = useState(true);

	return (
		<AuthProvider>
			{printHeader && <Header />}
			<Component setPrintHeader={setPrintHeader} {...pageProps} />
		</AuthProvider>
	);
}

export default MyApp
