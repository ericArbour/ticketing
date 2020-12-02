import { useUserContext } from '../contexts/user-context';

export default function Index() {
  const currentUser = useUserContext();

  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
}
