import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Layout } from '@/components/layout'
import { AuthProvider } from '@/contexts/auth-context'
import { RealtimeProvider } from '@/contexts/realtime-context'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { ToastProvider } from '@/components/ui/toast'
import { ErrorBoundary } from '@/components/error-boundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Elysium Systems Dashboard',
  description: 'Advanced enterprise dashboard for Elysium Systems - Next-generation AI and data analytics platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ErrorBoundary>
        <ToastProvider>
          <AuthProvider>
            <ProtectedRoute>
              <RealtimeProvider>
                <Layout>
                  {children}
                </Layout>
              </RealtimeProvider>
            </ProtectedRoute>
          </AuthProvider>
        </ToastProvider>
      </ErrorBoundary>
      </body>
    </html>
  )
}
