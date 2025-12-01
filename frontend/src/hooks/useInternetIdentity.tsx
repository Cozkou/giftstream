import { createContext, useContext, ReactNode } from 'react';

interface InternetIdentityContextType {
  identity: any;
  isAuthenticated: boolean;
}

const InternetIdentityContext = createContext<InternetIdentityContextType>({
  identity: null,
  isAuthenticated: false,
});

export function InternetIdentityProvider({ children }: { children: ReactNode }) {
  // Mock implementation - no authentication required per spec
  return (
    <InternetIdentityContext.Provider value={{ identity: null, isAuthenticated: true }}>
      {children}
    </InternetIdentityContext.Provider>
  );
}

export function useInternetIdentity() {
  return useContext(InternetIdentityContext);
}

