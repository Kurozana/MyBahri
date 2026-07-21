import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ToastProvider } from '@/components/ui/Toast'
import { OccasionProvider } from '@/hooks/useOccasion'
import { FirstLoadSplash } from '@/components/ui/FirstLoadSplash'
import { BrandLoader } from '@/components/ui/BrandLoader'

// Each page is its own code-split chunk — the browser only downloads what it visits.
const HomePage = lazy(() => import('@/pages/HomePage'))
const StubPage = lazy(() => import('@/pages/StubPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))

const router = createBrowserRouter([
  // Login stands alone — no header/sidebar shell.
  {
    path: '/login',
    element: (
      <Suspense fallback={<div className="grid min-h-screen place-items-center bg-page"><BrandLoader /></div>}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'workspace', element: <StubPage /> },
      { path: 'knowledge', element: <StubPage /> },
      { path: 'locations', element: <StubPage /> },
      { path: 'media', element: <StubPage /> },
      { path: 'tasks', element: <StubPage /> },
      { path: 'messages', element: <StubPage /> },
    ],
  },
])

export default function App() {
  return (
    <OccasionProvider>
      <ToastProvider>
        <FirstLoadSplash />
        <RouterProvider router={router} />
      </ToastProvider>
    </OccasionProvider>
  )
}
