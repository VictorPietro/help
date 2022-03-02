/* eslint-disable @next/next/link-passhref */
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { ActiveLink } from '../ActiveLink';
import { SignInButton } from '../SignInButton';

import styles from './styles.module.scss';

export function Header() {
    const { user } = useContext(AuthContext);

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/">
                    <img src="/images/logo.png" alt="Lnk.App" />
                </Link>
                <nav>
                    <ActiveLink activeClassName={styles.active} href="/">
                        <a>Início</a>
                    </ActiveLink>
                    {/* o parâmetro "prefetch" em um Link deixa a página pré carregada */}
                    {user ?
                        <ActiveLink activeClassName={styles.active} href="/user/pages">
                            <a>Páginas</a>
                        </ActiveLink>
                        : ''
                    }
                    {user ?
                        <ActiveLink activeClassName={styles.active} href="/user/settings">
                            <a>Configurações</a>
                        </ActiveLink>
                        : ''
                    }
                </nav>

                <SignInButton />
            </div>
        </header>
    );
}