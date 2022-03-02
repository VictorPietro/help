
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        Providers.Credentials({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Email and Password',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                // Add logic here to look up the user from the credentials supplied eg from db or api
                const user = { id: 1, name: 'J Smith', email: 'jsmith@example.com' }

                if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                    return Promise.resolve(user)
                } else {
                    // If you return null or false then the credentials will be rejected
                    return Promise.resolve(null)
                    // You can also Reject this callback with an Error or with a URL:
                    // return Promise.reject(new Error('error message')) // Redirect to error page
                    // return Promise.reject('/path/to/redirect')        // Redirect to a URL
                }
            }
        })
    ],
    callbacks: {
        // permite modificar os dados da session
        async session(session) {
            try {
                const userActiveSubscription = true;
                // TODO userActiveSubscription: get user by email where subscription is active

                return {
                    ...session,
                    activeSubscription: userActiveSubscription
                }
            } catch {
                return {
                    ...session,
                    activeSubscription: null
                }
            }
        },
        async signIn(user, account, profile) {
            const { email } = user;

            try {
                // TODO get user by email
                // TODO login using our backend
                return true
            } catch {
                return false
            }
        },
        // jwt function always runs before session, so whatever data you pass to jwt token will be available on session function and you can do whatever you want with it
        async jwt(token, user) {
            if (user) {
                token.user = user;
            }

            return token;
        },
    }
});