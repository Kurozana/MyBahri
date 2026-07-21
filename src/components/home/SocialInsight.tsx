import { useState } from 'react'
import { TrendingUp, Sparkles, Send, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { birthdayPerson, birthdayWishes } from '@/data/home'

export function SocialInsight() {
  const [message, setMessage] = useState('')

  return (
    <Card>
      <CardHeader icon={<TrendingUp className="size-[18px]" />} title="Social Insight" />

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-mint to-primary-700 p-6 text-center text-white">
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <img src="/assets/birthday.png" alt="" className="size-full object-cover" />
          </div>
          <div className="relative">
            <h3 className="text-2xl font-extrabold drop-shadow">Happy Birthday!</h3>
            <div className="mx-auto my-4 grid size-16 place-items-center rounded-full bg-white/20 text-2xl backdrop-blur">
              🎂
            </div>
            <p className="text-lg font-bold">{birthdayPerson.name}</p>
            <p className="text-sm text-white/80">{birthdayPerson.department}</p>
          </div>
          <div className="relative mt-4 flex items-center gap-2 text-white/70">
            <ChevronLeft className="size-4" />
            <span className="text-xs">1 / 4</span>
            <ChevronRight className="size-4" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2">
            {birthdayWishes.map((w) => (
              <button
                key={w}
                onClick={() => setMessage(w)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600"
              >
                {w}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-4">
            <div className="mb-1.5 flex items-center justify-end gap-1 text-xs font-medium text-primary-600">
              <Sparkles className="size-3.5" /> Write with AI
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your personalized message here..."
              rows={2}
              className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
            <button className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-800 py-2.5 text-sm font-semibold text-white transition hover:brightness-105">
              <Send className="size-4" /> Send Message
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}
