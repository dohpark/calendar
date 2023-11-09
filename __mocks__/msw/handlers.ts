import { HttpHandler, http } from 'msw';

export const handlers: HttpHandler[] = [
  // Intercept the "GET /resource" request.
  http.get(
    '/resource',
    () =>
      // And respond with a "text/plain" response
      // with a "Hello world!" text response body.
      new Response('Hello world!'),
  ),
];
