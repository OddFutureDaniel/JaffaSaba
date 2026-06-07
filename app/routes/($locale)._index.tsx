import { redirect } from 'react-router';
import type { Route } from './+types/_index';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Jaffa Saba' }];
};

export async function loader() {
  throw redirect('/pages/portfolio');
}

export default function Homepage() {
  return null;
}