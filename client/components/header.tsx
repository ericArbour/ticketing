import Link from 'next/link';
import { useUserContext } from '../contexts/user-context';

export default function Header() {
  const currentUser = useUserContext();
  const links: { label: string; href: string }[] = [];
  if (!currentUser) links.push({ label: 'Sign Up', href: '/auth/signup' });
  if (!currentUser) links.push({ label: 'Sign In', href: '/auth/signin' });
  if (currentUser) links.push({ label: 'Sign Out', href: '/auth/signout' });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {links.map(({ label, href }) => (
            <li key={href} className="nav-item">
              <Link href={href}>
                <a className="nav-link">{label}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
