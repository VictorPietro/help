import NextLink from 'next/link';

export { Link };

// built-in Next.js link component accepts an href attribute but requires an <a> tag to be nested inside it to work
function Link({ href, children, ...props }) {
    return (
        <NextLink href={href}>
            <a {...props}>
                {children}
            </a>
        </NextLink>
    );
}