import { redirect, useActionData } from 'react-router';
import type { Route } from './+types/password';

export async function action(args: Route.ActionArgs) {
  const { request, context } = args;
  const { env } = context;
  const formData = await request.formData();
  const password = formData.get('password');

  if (password === env.STOREFRONT_PASSWORD) {
    throw redirect('/', {
      headers: {
        'Set-Cookie': 'storefront_auth=true; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400',
      },
    });
  }

  return { error: 'Incorrect password' };
}

export default function Password() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="password-page">
      <div className="password-inner">
        <img
          src="/JaffaWordmarkTransparent(1).png"
          alt="Jaffa Saba"
          className="password-logo"
        />
        <form method="post" className="password-form">
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            className="password-input"
            autoComplete="off"
            autoFocus
          />
          {actionData?.error && (
            <p className="password-error">{actionData.error}</p>
          )}
          <button type="submit" className="password-submit">
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}