import { createContext, useContext } from 'react';

// Todo, find a way to share this between here and auth service
export interface UserPayload {
  id: string;
  email: string;
}

const UserContext = createContext<null | UserPayload>(null);

export const UserContextProvider = UserContext.Provider;

export function useUserContext() {
  return useContext(UserContext);
}
