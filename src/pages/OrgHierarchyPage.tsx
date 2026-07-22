import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Network } from 'lucide-react'
import { useApi } from '@core/hooks/useApi'
import { portalApi } from '@core/api/portal'
import type { EmployeeDto } from '@core/api/types'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/cn'

function PersonNode({ person, me }: { person: EmployeeDto; me?: boolean }) {
  return (
    <div
      className={cn(
        'flex w-44 flex-col items-center rounded-2xl border p-4 text-center transition',
        me
          ? 'border-primary-400 bg-accent-soft/50 ring-2 ring-primary-200 dark:ring-primary-500/30'
          : 'border-line bg-surface hover:border-primary-300 hover:shadow-md',
      )}
    >
      <span className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white">
        {person.initials}
      </span>
      <p className="mt-2 text-sm font-semibold leading-tight text-content">{person.name}</p>
      <p className="mt-0.5 text-xs text-subtle">{person.title}</p>
      {me && (
        <span className="mt-2 rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          You
        </span>
      )}
    </div>
  )
}

const Connector = () => <span className="h-7 w-px bg-line" />

export default function OrgHierarchyPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data, loading } = useApi(portalApi.getEmployees)

  const employees = data ?? []
  const byId = (id?: string) => employees.find((e) => e.id === id)

  const me = employees.find((e) => e.name === user?.name) ?? employees[0]
  const manager = me ? byId(me.managerId) : undefined
  const grand = manager ? byId(manager.managerId) : undefined
  // Peers share the same manager (includes me). If I have no manager, show my reports instead.
  const bottomRow = me
    ? manager
      ? employees.filter((e) => e.managerId === me.managerId)
      : employees.filter((e) => e.managerId === me.id)
    : []

  return (
    <div className="mx-auto max-w-4xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-2"
      >
        <ArrowLeft className="size-4" /> Back
      </button>

      <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-10">
        <div className="mb-8 flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-accent-soft text-primary-600 dark:text-primary-300">
            <Network className="size-[18px]" />
          </span>
          <div>
            <h1 className="text-lg font-bold text-content">Your reporting line</h1>
            <p className="text-xs text-subtle">Where you sit in the organization</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-6">
            <Skeleton className="h-28 w-44 rounded-2xl" />
            <Skeleton className="h-28 w-44 rounded-2xl" />
            <div className="flex gap-5">
              <Skeleton className="h-28 w-44 rounded-2xl" />
              <Skeleton className="h-28 w-44 rounded-2xl" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center overflow-x-auto pb-2">
            {grand && (
              <>
                <PersonNode person={grand} />
                <Connector />
              </>
            )}
            {manager && (
              <>
                <PersonNode person={manager} />
                <Connector />
              </>
            )}

            {/* bottom row: me + peers (or my reports) */}
            <div className="relative flex flex-wrap justify-center gap-5 pt-4">
              {bottomRow.length > 1 && (
                <span className="absolute left-1/2 top-0 h-px w-[calc(100%-11rem)] -translate-x-1/2 bg-line" />
              )}
              {bottomRow.map((p) => (
                <div key={p.id} className="relative flex flex-col items-center">
                  <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-line" />
                  <div className="pt-4">
                    <PersonNode person={p} me={p.id === me?.id} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
