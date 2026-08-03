import { useState } from 'react'
import { TrendingUp, Send, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { birthdayPeople, birthdayWishes } from '@core/content/home'
import { asset } from '@/lib/asset'
import { useToast } from '@/components/ui/Toast'

export function SocialInsight() {
  const toast = useToast()
  const [message, setMessage] = useState('')
  const [index, setIndex] = useState(0)

  const person = birthdayPeople[index]
  const move = (dir: number) =>
    setIndex((i) => (i + dir + birthdayPeople.length) % birthdayPeople.length)

  const send = () => {
    if (!message.trim()) return
    toast(`Birthday wish sent to ${person.name.split(' ')[0]} 🎉`)
    setMessage('')
  }

  return (
    <Card>
      <CardHeader icon={<TrendingUp className="size-[18px]" />} title="Social Insight" />

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-mint to-primary-700 p-6 text-center text-white">
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <img src={asset('assets/birthday.png')} alt="" className="size-full object-cover" />
          </div>
          <div className="relative">
            <h3 className="text-2xl font-extrabold drop-shadow">Happy Birthday!</h3>
            <div className="mx-auto my-4 grid size-16 place-items-center rounded-full bg-white/20 text-2xl backdrop-blur">
              🎂
            </div>
            <p className="text-lg font-bold">{person.name}</p>
            <p className="text-sm text-white/80">{person.department}</p>
          </div>
          <div className="relative mt-4 flex items-center gap-3">
            <button
              onClick={() => move(-1)}
              className="grid size-6 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-xs text-white/80">
              {index + 1} / {birthdayPeople.length}
            </span>
            <button
              onClick={() => move(1)}
              className="grid size-6 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2">
            {birthdayWishes.map((w) => (
              <button
                key={w}
                onClick={() => setMessage(w)}
                className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition hover:border-primary-300 hover:bg-accent-soft/50 hover:text-primary-600 dark:hover:text-primary-300"
              >
                {w}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your personalized message here..."
              rows={2}
              className="w-full resize-none rounded-xl border border-line bg-surface p-3 text-sm text-content outline-none transition placeholder:text-subtle focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"
            />
            <button
              onClick={send}
              disabled={!message.trim()}
              className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-800 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-50"
            >
              <Send className="size-4" /> Send Message
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}
