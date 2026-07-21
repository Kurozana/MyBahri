import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  LifeBuoy,
} from 'lucide-react'
import { BahriLogo } from '@/components/ui/BahriLogo'
import { cn } from '@/lib/cn'

const highlights = [
  { icon: Clock, title: 'Punch in from anywhere', desc: 'Attendance that syncs to payroll automatically.' },
  { icon: CheckCircle2, title: 'Approvals on the go', desc: 'Review and sign off workflows in a tap.' },
  { icon: Sparkles, title: 'Everything Bahri', desc: 'Services, people and news in one place.' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [busy, setBusy] = useState(false)

  const signIn = (e?: React.FormEvent) => {
    e?.preventDefault()
    setBusy(true)
    window.setTimeout(() => navigate('/'), 700)
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Brand hero — hidden on small screens */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary-800 via-primary-600 to-brand-mint p-12 text-white lg:flex lg:flex-col">
        <div className="pointer-events-none absolute -right-16 top-10 size-72 animate-float-slow rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -left-10 bottom-24 size-56 animate-float-slow rounded-full bg-white/10 [animation-delay:2s]" />
        <div className="pointer-events-none absolute right-24 bottom-10 size-24 animate-float-slow rounded-full bg-white/10 [animation-delay:4s]" />

        <div className="relative flex items-center gap-3">
          <BahriLogo className="size-11 bg-white/15 backdrop-blur" />
          <span className="text-2xl font-extrabold tracking-tight">MyBahri</span>
        </div>

        <div className="relative my-auto max-w-md">
          <h1 className="text-4xl font-extrabold leading-tight">
            Your workplace,
            <br />
            all in one place.
          </h1>
          <p className="mt-4 text-white/80">
            Sign in to access services, approvals, attendance and everything happening across Bahri.
          </p>

          <ul className="mt-10 space-y-5">
            {highlights.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex items-start gap-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/15 backdrop-blur">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="block text-sm text-white/75">{desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/60">© 2026 Bahri — Global logistics &amp; shipping</p>
      </div>

      {/* Sign-in panel */}
      <div className="flex items-center justify-center bg-page px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <BahriLogo className="size-10" />
            <span className="text-xl font-extrabold tracking-tight text-content">
              My<span className="text-primary-600 dark:text-primary-400">Bahri</span>
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-content">Welcome back</h2>
          <p className="mt-1.5 text-sm text-muted">Sign in to continue to your portal.</p>

          <button
            onClick={() => signIn()}
            disabled={busy}
            className="mt-7 flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
          >
            <ShieldCheck className="size-[18px]" />
            Continue with Bahri SSO
          </button>

          <div className="my-6 flex items-center gap-3 text-xs font-medium text-subtle">
            <span className="h-px flex-1 bg-line" />
            or sign in with email
            <span className="h-px flex-1 bg-line" />
          </div>

          <form onSubmit={signIn} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted">Email</span>
              <span className="relative block">
                <Mail className="absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-subtle" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@bahri.sa"
                  className="w-full rounded-xl border border-line bg-surface py-3 pl-11 pr-3 text-sm text-content outline-none transition placeholder:text-subtle focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted">Password</span>
              <span className="relative block">
                <Lock className="absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-subtle" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-line bg-surface py-3 pl-11 pr-11 text-sm text-content outline-none transition placeholder:text-subtle focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle transition hover:text-muted"
                >
                  {showPw ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
                </button>
              </span>
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-muted">
                <input type="checkbox" className="size-4 accent-primary-600" defaultChecked />
                Remember me
              </label>
              <a href="#" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={busy}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-xl border border-line py-3 text-sm font-semibold text-content transition hover:bg-surface-2 active:scale-[0.99]',
                busy && 'opacity-60',
              )}
            >
              {busy ? 'Signing in…' : 'Sign in'}
              {!busy && <ArrowRight className="size-4" />}
            </button>
          </form>

          <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-subtle">
            <LifeBuoy className="size-3.5" />
            Trouble signing in? Contact the IT Service Desk.
          </p>
        </div>
      </div>
    </div>
  )
}
