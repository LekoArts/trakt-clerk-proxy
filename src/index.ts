import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'

const TRAKT_USER_SETTINGS = 'https://api.trakt.tv/users/settings'
const TRAKT_USER_ME  = 'https://api.trakt.tv/users/me'

type Bindings = {
  /**
   * This is the `client_id` mentioned at https://trakt.docs.apiary.io/#introduction/required-headers
   * You need to set this value as an environment variable.
   * @see https://developers.cloudflare.com/workers/configuration/environment-variables/
   */
  CLIENT_ID: string
}

interface UserSettingsResponse {
  user: {
    username: string
    name: string
    ids: {
      slug: string
      uuid: string
    }
    images: {
      avatar: {
        full: string
      }
    }
  }
}

interface UserResponse {
  username: string
  name: string
  ids: {
    slug: string
  }
  images: {
    avatar: {
      full: string
    }
  }
}

const app = new Hono<{ Bindings: Bindings }>()
app.use(logger())

app.get('/', async (c) => {
  const authorization = c.req.header('authorization')

  if (!authorization) {
    throw new HTTPException(401, { message: 'Authorization header is missing. This is likely an invalid request, make sure to only call this URL as part of the OAuth flow of Clerk.' })
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': authorization,
    'trakt-api-key': c.env.CLIENT_ID,
    'trakt-api-version': '2',
  }

  const userSettingsRes = await fetch(TRAKT_USER_SETTINGS, {
    headers
  })
  const userRes = await fetch(TRAKT_USER_ME, {
    headers
  })

  const userSettings = await userSettingsRes.json() as UserSettingsResponse
  const user = await userRes.json() as UserResponse

  /**
   * You can use these values for Attribute Mapping in Clerk
   * @see https://clerk.com/docs/authentication/social-connections/custom-provider#attribute-mapping
   */
  return c.json({
    uuid: userSettings.user.ids.uuid,
    avatar_url: userSettings.user.images.avatar.full,
    name: userSettings.user.name,
    username: userSettings.user.username,
    slug: user.ids.slug,
  })
})

export default app
