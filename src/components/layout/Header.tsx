import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, Cloud, IdCard, LogOut, Palette, ShieldAlert } from 'lucide-react'
import { BahriLogo } from '@/components/ui/BahriLogo'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { OccasionSwitcher } from '@/components/ui/OccasionSwitcher'
import { ReleaseNotesButton } from '@/components/layout/ReleaseNotesButton'
import { Can } from '@/components/auth/Can'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/Toast'
import { useApi } from '@core/hooks/useApi'
import { getWeather, RIYADH } from '@core/api/weather'
import { roleLabels } from '@core/auth/permissions'

const fetchWeather = (signal: AbortSignal) => getWeather(RIYADH.lat, RIYADH.lon, signal)

export function Header() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user, logout } = useAuth()
  const { data: weather } = useApi(fetchWeather)
  const [open, setOpen] = useState(false)

  const signOut = () => {
    setOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <BahriLogo className="size-9" />
          <span className="text-lg font-extrabold tracking-tight text-content">
            My<span className="text-primary-600 dark:text-primary-400">Bahri</span>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button className="hidden items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-medium text-muted transition hover:bg-surface-2 sm:flex">
            <Cloud className="size-4 text-primary-500" />
            <span className="font-semibold text-content">
              {weather ? `${weather.tempC}°C` : '—'}
            </span>
            <span className="text-subtle">{RIYADH.city}</span>
          </button>

          <OccasionSwitcher />
          <ReleaseNotesButton />
          <ThemeToggle />

          <button className="grid size-9 place-items-center rounded-full border border-line bg-surface text-primary-600 transition hover:bg-surface-2 dark:text-primary-400">
            <IdCard className="size-[18px]" />
          </button>

          <button className="relative grid size-9 place-items-center rounded-full border border-line bg-surface text-muted transition hover:bg-surface-2">
            <Bell className="size-[18px]" />
            <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
              3
            </span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition hover:bg-surface-2"
            >
              <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-xs font-bold text-white">
                {user?.initials ?? '—'}
              </span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-sm font-semibold text-content">{user?.name}</span>
                <span className="block text-xs text-subtle">{user ? roleLabels[user.role] : ''}</span>
              </span>
              <ChevronDown className="size-4 text-subtle" />
            </button>

            {open && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                <div className="absolute right-0 top-12 z-50 w-64 animate-toast-in rounded-2xl border border-line bg-surface p-2 shadow-xl">
                  <div className="flex items-center gap-3 px-2.5 py-2">
                    <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white">
                      {user?.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-content">{user?.name}</p>
                      <p className="truncate text-xs text-subtle">{user?.email}</p>
                    </div>
                  </div>
                  <div className="px-2.5 pb-2">
                    <span className="inline-flex items-center rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-primary-700 dark:text-primary-300">
                      {user ? roleLabels[user.role] : ''}
                    </span>
                  </div>

                  <div className="my-1 h-px bg-line" />

                  <Can permission="content.manage">
                    <button
                      onClick={() => {
                        setOpen(false)
                        toast('Content Studio — coming soon', 'info')
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm text-content transition hover:bg-surface-2"
                    >
                      <Palette className="size-4 text-primary-500" /> Content Studio
                    </button>
                  </Can>
                  <Can permission="admin.access">
                    <button
                      onClick={() => {
                        setOpen(false)
                        toast('Admin Console — coming soon', 'info')
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm text-content transition hover:bg-surface-2"
                    >
                      <ShieldAlert className="size-4 text-primary-500" /> Admin Console
                    </button>
                  </Can>

                  <button
                    onClick={signOut}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-400/10"
                  >
                    <LogOut className="size-4" /> Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
