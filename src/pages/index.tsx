/* eslint-disable @next/next/link-passhref */
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';

import styles from './home.module.scss';

interface HomePageProps {
	setPrintHeader: any;
}

// posso pegar as props aqui como argumento de Home
export default function Home({ setPrintHeader }: HomePageProps) {
	setPrintHeader(true);

	const { user } = useContext(AuthContext);

	return (
		<>
			<Head>
				<title>Home | Lnk.App</title>
			</Head>

			<main className={styles.contentContainer}>
				<section className={styles.hero}>
					<span>👏 Olá, bem vindo</span>
					<h1>Tenha vários <span>links reunidos</span> em uma só página.</h1>
					<p>
						{user ? "Explore" : "Conheça"} nossa plataforma <br />
						{user ?
							<Link href={`/user/pages`}>
								<Button size="lg" className={`w-50 mt-4 ${styles.button}`}>
									Ver Páginas
								</Button>
							</Link>
							:
							<Link href={`/signup`}>	
								<Button size="lg" className={`w-50 mt-4 ${styles.button}`}>
									Cadastrar-se
								</Button>
							</Link>
						}
					</p>
				</section>

				<img src="/images/avatar.svg" alt="Girl coding" />
			</main>
		</>
	)
}

// todo código executado aqui dentro é no servidor node, e não no browser cliente
export const getStaticProps: GetStaticProps = async () => {
	// const price = await stripe.prices.retrieve('price_1JF1OkERAKmEEOXhoUA9snBa', {
	// 	expand: ['product']	// busca todas as informações do produto (no caso, não usaremos)
	// });

	// const product = {
	// 	priceId: price.id,
	// 	// divide por 100 para salvar em centavos e manipular com mais facilidade
	// 	amount: new Intl.NumberFormat('en-US', {
	// 		style: 'currency',
	// 		currency: 'USD',
	// 	}).format(price.unit_amount / 100),
	// }

	return {
		props: {
			// product,
		},
		revalidate: 60 * 60 * 24 // 24 hours

	}
}