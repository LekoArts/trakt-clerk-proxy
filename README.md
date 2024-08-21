# trakt-clerk-proxy

[Clerk](https://www.clerk.com) supports adding [OAuth with a custom auth provider](https://clerk.com/docs/authentication/social-connections/custom-provider). OpenID Connect (OIDC) compatible authentication providers have the highest compatibility, however you can also connect other providers that require a bit more setup.

One of those providers is [Trakt](https://trakt.tv) as it requires an `trakt-api-key` header to be present on the **User info URL** call. To mitigate this, you'll need to provide a proxy between Trakt <-> Proxy <-> Clerk. This [Hono](https://hono.dev/) project is exactly doing that.

## Usage

1. Follow the instructions of [OAuth with a custom auth provider](https://clerk.com/docs/authentication/social-connections/custom-provider)
1. If you haven't already, create an account with [Cloudflare](https://www.cloudflare.com)
1. Clone this repository and install the dependencies.

    ```shell
    git clone git@github.com:LekoArts/trakt-clerk-proxy.git
    cd trakt-clerk-proxy
    pnpm install
    ```

1. Deploy it to Cloudflare with `pnpm run deploy`
1. Add `CLIENT_ID` as a [Secret](https://developers.cloudflare.com/workers/configuration/secrets/#adding-secrets-to-your-project) to the deployed worker. You can get the `CLIENT_ID` from your [Trakt OAuth page](https://trakt.tv/oauth/applications).
1. Use the URL of the deployed Cloudflare Worker as the **User info URL** inside your Clerk dashboard for the OAuth connection.

## Local development

If you want to edit this proxy, start the development server with `pnpm run dev`. If you want to try out your local version inside Clerk, use something like [ngrok](https://ngrok.com/) to get a deployed URL of your local instance.