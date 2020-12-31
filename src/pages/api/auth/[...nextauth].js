import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  providers: [
    Providers.IdentityServer4({
      id: 'identity-server4',
      name: 'IdentityServer4',
      scope: 'openid profile',
      domain: process.env.IdentityServer4_Domain,
      clientId: process.env.IdentityServer4_CLIENT_ID,
      clientSecret: process.env.IdentityServer4_CLIENT_SECRET,
    }),
  ],
}

export default (req, res) => NextAuth(req, res, options)
