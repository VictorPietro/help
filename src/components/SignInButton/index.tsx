import { FaUserAlt } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import styles from './styles.module.scss';
import { Link } from '../Link';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export function SignInButton() {
    const { user, signOutFromClient } = useContext(AuthContext);

    return user?.id ? (
        <button
            type="button"
            className={styles.signInButton}
            onClick={() => signOutFromClient()}
        >
            <FaUserAlt color="#04d361" />
            {user.email} - Sair
            <FiX color="#737380" className={styles.closeIcon} />
        </button>
    ) : (
        <Link href={`/login`}>
            <button
                type="button"
                className={styles.signInButton}
            // onClick={() => signIn()}    // no parâmetro pode-se passar qual provider do next auth quer utilizar, ex: github
            >
                <FaUserAlt color="#eba417" />
                Entrar
            </button>
        </Link>
    );
}