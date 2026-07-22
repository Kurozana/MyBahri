import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ToastProvider } from '@/components/ui/Toast'
import { OccasionProvider } from '@/hooks/useOccasion'
import { AuthProvider } from '@/hooks/useAuth'
import { RequireAuth } from '@/components/auth/RequireAuth'
import { FirstLoadSplash } from '@/components/ui/FirstLoadSplash'
import { BrandLoader } from '@/components/ui/BrandLoader'

// Each page is its own code-split chunk — the browser only downloads what it visits.
const HomePage = lazy(() => import('@/pages/HomePage'))
const StubPage = lazy(() => import('@/pages/StubPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const CeoMessagePage = lazy(() => import('@/pages/CeoMessagePage'))

const router = createBrowserRouter(
  [
    // Login stands alone — no header/sidebar shell, no auth required.
    {
      path: '/login',
      element: (
        <Suspense
          fallback={
            <div className="grid min-h-screen place-items-center bg-page">
              <BrandLoader />
            </div>
          }
        >
          <LoginPage />
        </Suspense>
      ),
    },
    // Everything else requires a signed-in user.
    {
      path: '/',
      element: (
        <RequireAuth>
          <Layout />
        </RequireAuth>
      ),
      children: [
        { index: true, element: <HomePage /> },
        { path: 'ceo-message', element: <CeoMessagePage /> },
        { path: 'workspace', element: <StubPage /> },
        { path: 'knowledge', element: <StubPage /> },
        { path: 'locations', element: <StubPage /> },
        { path: 'media', element: <StubPage /> },
        { path: 'tasks', element: <StubPage /> },
        { path: 'messages', element: <StubPage /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
)

export default function App() {
  return (
    <OccasionProvider>
      <AuthProvider>
        <ToastProvider>
          <FirstLoadSplash />
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthProvider>
    </OccasionProvider>
  )
}
