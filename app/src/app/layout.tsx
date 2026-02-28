import { Outfit, Dancing_Script } from 'next/font/google';
import './globals.css';
import '@/shared/styles/nprogress.css';
import { Providers } from '@/shared/providers/Providers';
import { NProgressBar } from '@/shared/components/NProgressBar';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { NavigationProvider } from '@/shared/contexts/NavigationContext';
import { UserDataProvider } from '@/shared/contexts/UserDataContext';
import { UserDataInitializer } from '@/shared/components/UserDataInitializer';
import { FrameworkInitializer } from '@/features/frameworks';

const outfit = Outfit({
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: '--font-dancing-script',
});

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <Providers>
      <NavigationProvider>
        <UserDataProvider>
          <UserDataInitializer />
          <FrameworkInitializer />
          <NProgressBar />
          {children}
        </UserDataProvider>
      </NavigationProvider>
    </Providers>
  );

  return (
    <html lang="en">
      <body className={`${outfit.className} ${dancingScript.variable} bg-[#1e1f22]`}>
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            {content}
          </GoogleOAuthProvider>
        ) : (
          content
        )}
      </body>
    </html>
  );
}
