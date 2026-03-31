import * as serverBuild from 'virtual:react-router/server-build';
import {createRequestHandler, storefrontRedirect} from '@shopify/hydrogen';
import {createHydrogenRouterContext} from '~/lib/context';

export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      const hydrogenContext = await createHydrogenRouterContext(
        request,
        env,
        executionContext,
      );

      const handleRequest = createRequestHandler({
        build: serverBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => hydrogenContext,
      });

      const response = await handleRequest(request);

      response.headers.set(
        'Content-Security-Policy',
        [
          `default-src 'self' https://cdn.shopify.com https://shopify.com`,
          `script-src 'self' 'unsafe-inline' https://cdn.shopify.com https://shopify.com`,
          `connect-src 'self' https://cdn.shopify.com/ https://monorail-edge.shopifysvc.com https://${env.PUBLIC_STORE_DOMAIN} https://formspree.io http://localhost:* ws://localhost:* ws://127.0.0.1:* ws://*.tryhydrogen.dev:*`,
          `style-src 'self' 'unsafe-inline' https://cdn.shopify.com`,
          `img-src 'self' data: https://cdn.shopify.com`,
          `font-src 'self' https://cdn.shopify.com`,
        ].join('; ')
      );

      if (hydrogenContext.session.isPending) {
        response.headers.set(
          'Set-Cookie',
          await hydrogenContext.session.commit(),
        );
      }

      if (response.status === 404) {
        return storefrontRedirect({
          request,
          response,
          storefront: hydrogenContext.storefront,
        });
      }

      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};