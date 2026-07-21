import { Trophy } from 'lucide-react'
import { employeeOfMonth as emp } from '@core/content/home'

export function EmployeeOfMonth() {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-primary-900 to-primary-800 p-6 text-white shadow-[0_18px_40px_-24px_rgba(15,23,41,0.9)]">
      <div className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full bg-white/5" />
      <div className="relative flex items-center gap-2">
        <Trophy className="size-5 text-amber-300" />
        <div>
          <h2 className="text-lg font-extrabold">Employee of the Month</h2>
          <p className="text-xs text-white/60">{emp.month}</p>
        </div>
      </div>

      <div className="relative mt-6 flex flex-1 flex-col items-center text-center">
        <div className="grid size-20 place-items-center rounded-full bg-white/10 text-2xl font-bold ring-4 ring-white/10">
          {emp.initials}
        </div>
        <p className="mt-3 text-lg font-bold">{emp.name}</p>
        <p className="text-sm text-white/70">{emp.title}</p>

        <div className="mt-5 w-full rounded-xl bg-white/10 p-3.5 backdrop-blur">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/80">Impact Score</span>
            <span className="font-bold">{emp.impactScore}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-300"
              style={{ width: `${emp.impactScore}%` }}
            />
          </div>
        </div>
      </div>

      <button className="relative mt-5 w-full rounded-xl bg-white py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-white/90">
        Congratulate Mohammed 🎉
      </button>
    </div>
  )
}
