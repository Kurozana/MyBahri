import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ToastProvider } from '@/components/ui/Toast'
import { OccasionProvider } from '@/hooks/useOccasion'

// Each page is its own code-split chunk — the browser only downloads what it visits.
const HomePage = lazy(() => import('@/pages/HomePage'))
const StubPage = lazy(() => import('@/pages/StubPage'))

const router = createBrowserRouter([
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
        <RouterProvider router={router} />
      </ToastProvider>
    </OccasionProvider>
  )
}
