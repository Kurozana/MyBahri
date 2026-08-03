import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { AdminLayout } from '@/pages/admin/AdminLayout'
import { ToastProvider } from '@/components/ui/Toast'
import { OccasionProvider } from '@/hooks/useOccasion'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { RequireAuth } from '@/components/auth/RequireAuth'
import { RequireAdmin } from '@/components/admin/RequireAdmin'
import { FirstLoadSplash } from '@/components/ui/FirstLoadSplash'
import { BrandLoader } from '@/components/ui/BrandLoader'
import { MaintenancePage } from '@/components/ui/MaintenancePage'
import { useMaintenance } from '@/hooks/useAdminSettings'

// Each page is its own code-split chunk — the browser only downloads what it visits.
const HomePage = lazy(() => import('@/pages/HomePage'))
const StubPage = lazy(() => import('@/pages/StubPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const CeoMessagePage = lazy(() => import('@/pages/CeoMessagePage'))
const OrgHierarchyPage = lazy(() => import('@/pages/OrgHierarchyPage'))
const AttendancePage = lazy(() => import('@/pages/AttendancePage'))
// Admin console modules
const AdminHome = lazy(() => import('@/pages/admin/AdminHome'))
const UsersPage = lazy(() => import('@/pages/admin/UsersPage'))
const NotificationsPage = lazy(() => import('@/pages/admin/NotificationsPage'))
const AuditPage = lazy(() => import('@/pages/admin/AuditPage'))
const AnalyticsPage = lazy(() => import('@/pages/admin/AnalyticsPage'))
const IntegrationsPage = lazy(() => import('@/pages/admin/IntegrationsPage'))
const ConsoleChangelogPage = lazy(() => import('@/pages/admin/ConsoleChangelogPage'))
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage'))
const ReleaseNotesAdminPage = lazy(() => import('@/pages/ReleaseNotesAdminPage'))

const router = createBrowserRouter(
  [
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
        { path: 'org', element: <OrgHierarchyPage /> },
        { path: 'attendance', element: <AttendancePage /> },
        {
          path: 'admin',
          element: (
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          ),
          children: [
            { index: true, element: <AdminHome /> },
            { path: 'users', element: <UsersPage /> },
            { path: 'notifications', element: <NotificationsPage /> },
            { path: 'audit', element: <AuditPage /> },
            { path: 'analytics', element: <AnalyticsPage /> },
            { path: 'integrations', element: <IntegrationsPage /> },
            { path: 'release-notes', element: <ReleaseNotesAdminPage /> },
            { path: 'changelog', element: <ConsoleChangelogPage /> },
            { path: 'settings', element: <SettingsPage /> },
          ],
        },
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

/** Shows the maintenance page to non-admins when maintenance mode is on.
 *  The /login route stays reachable so admins can sign in and turn it off. */
function MaintenanceGate({ children }: { children: ReactNode }) {
  const maintenance = useMaintenance()
  const { user, status } = useAuth()
  const onLogin = window.location.pathname.replace(/\/+$/, '').endsWith('/login')
  if (maintenance.enabled && status !== 'loading' && user?.role !== 'admin' && !onLogin) {
    return <MaintenancePage maintenance={maintenance} />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <OccasionProvider>
      <AuthProvider>
        <ToastProvider>
          <FirstLoadSplash />
          <MaintenanceGate>
            <RouterProvider router={router} />
          </MaintenanceGate>
        </ToastProvider>
      </AuthProvider>
    </OccasionProvider>
  )
}
