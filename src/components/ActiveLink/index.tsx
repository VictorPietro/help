import { useRouter } from 'next/dist/client/router';
import Link, { LinkProps } from "next/link";
import { ReactElement, cloneElement } from "react";

interface ActiveLinkProps extends LinkProps {
    children: ReactElement;
    activeClassName: string;
}

export function ActiveLink({ children, activeClassName, ...rest }: ActiveLinkProps) {
    const { asPath } = useRouter();

    const className = asPath === rest.href
        ? activeClassName
        : ''

    // o cloneElement será usado para adicionar a className ao elemento que vier em children
    return (
        <Link {...rest}>
            {cloneElement(children, {
                className
            })}
        </Link>
    );
}