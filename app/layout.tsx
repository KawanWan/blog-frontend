// app/layout.tsx
import '../styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';    // <-- importe o Header

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}