import { NextRequest, NextResponse } from 'next/server';
import {
  authMiddleware,
  redirectToHome,
  redirectToLogin,
} from 'next-firebase-auth-edge';
import { clientConfig, serverConfig } from './lib/firebase/config';

const PUBLIC_PATHS = ['/sign-up', '/sign-in'];

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: '/api/login',
    logoutPath: '/api/logout',
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    cookieSerializeOptions: serverConfig.cookieSerializeOptions,
    serviceAccount: serverConfig.serviceAccount,
    handleValidToken: async ({ token, decodedToken }, headers) => {
      if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
        return redirectToHome(request, { path: '/' });
      }

      return NextResponse.next({
        request: {
          headers,
        },
      });
    },
    handleInvalidToken: async (reason) => {
      return redirectToLogin(request, {
        path: '/sign-in',
        publicPaths: PUBLIC_PATHS,
      });
    },
    handleError: async (error) => {
      console.error('Unhandled authentication error', { error });

      return redirectToLogin(request, {
        path: '/sign-in',
        publicPaths: PUBLIC_PATHS,
      });
    },
  });
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/((?!_next|api|.*\\.).*)',
    '/api/login',
    '/api/logout',
  ],
};
