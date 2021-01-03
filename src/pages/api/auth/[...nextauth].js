import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  providers: [
    Providers.IdentityServer4({
      id: 'identity-server4',
      name: 'IdentityServer4',
      scope: 'openid profile characterapi',
      domain: process.env.IdentityServer4_Domain,
      clientId: process.env.IdentityServer4_CLIENT_ID,
      clientSecret: process.env.IdentityServer4_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session: async (session, user) => {
      session.accessToken = user.accessToken
      session.subject = user.subject
      return Promise.resolve(session)
    },
    jwt: async (token, user, account) => {
      if (account) {
        token.accessToken = account.accessToken
        token.subject = account.id
      }
      return Promise.resolve(token)
    },
  },
}

export default (req, res) => NextAuth(req, res, options)
