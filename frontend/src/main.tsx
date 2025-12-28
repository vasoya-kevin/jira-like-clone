import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/globals.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { TicketProvider } from './context/TicketContext.tsx'
import { UserProvider } from './context/UserContext.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <AuthProvider>
      <UserProvider>
        <TicketProvider>
          <App />
        </TicketProvider>
      </UserProvider>
    </AuthProvider>
  // </StrictMode>
)
