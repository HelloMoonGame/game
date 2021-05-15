import { Log, User, UserManager, UserManagerSettings } from 'oidc-client'

export default class AuthService {
  public userManager: UserManager

  private static _instance: AuthService
  public static getInstance(): AuthService {
    if (!this._instance) this._instance = new AuthService()
    return this._instance
  }

  constructor() {
    const settings: UserManagerSettings = {
      authority: `https://${process.env.NEXT_PUBLIC_AUTH_AUTHORITY}`,
      client_id: process.env.NEXT_PUBLIC_AUTH_CLIENT_ID,
      redirect_uri: `${process.env.NEXT_PUBLIC_URL}/auth/signin-callback`,
      silent_redirect_uri: `${process.env.NEXT_PUBLIC_URL}/auth/renew-callback`,
      post_logout_redirect_uri: process.env.NEXT_PUBLIC_URL,
      response_type: 'code',
      scope: 'openid email characterapi',
      client_secret: process.env.NEXT_PUBLIC_AUTH_CLIENT_SECRET,
    }
    this.userManager = new UserManager(settings)

    Log.logger = console
    Log.level = Log.INFO
  }

  public getUser(): Promise<User | null> {
    return this.userManager.getUser()
  }

  public login(): Promise<void> {
    return this.userManager.signinRedirect()
  }

  public renewToken(): Promise<User> {
    return this.userManager.signinSilent()
  }

  public logout(): Promise<void> {
    return this.userManager.signoutRedirect()
  }

  public getUserOrLogin(): Promise<User | null> {
    return this.getUser().then((user) => {
      if (user && user.access_token && !user.expired) {
        return user
      } else if (user) {
        return this.renewToken().then((renewedUser) => renewedUser)
      } else {
        this.login()
        return null
      }
    })
  }
}
