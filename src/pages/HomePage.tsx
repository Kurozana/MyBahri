import { PromotionsBanner } from '@/components/home/PromotionsBanner'
import { DailyAttendance } from '@/components/home/DailyAttendance'
import { CeoMessage } from '@/components/home/CeoMessage'
import { Multimedia } from '@/components/home/Multimedia'
import { UpcomingMeetings } from '@/components/home/UpcomingMeetings'
import { QuickActions } from '@/components/home/QuickActions'
import { MostUsedServices } from '@/components/home/MostUsedServices'
import { Extensions } from '@/components/home/Extensions'
import { TodoList } from '@/components/home/TodoList'
import { CalendarCard } from '@/components/home/CalendarCard'
import { EmployeeOfMonth } from '@/components/home/EmployeeOfMonth'
import { SocialInsight } from '@/components/home/SocialInsight'
import { OrgStructure } from '@/components/home/OrgStructure'

export default function HomePage() {
  return (
    <div className="space-y-5">
      <PromotionsBanner />

      {/* Attendance + CEO row */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)]">
        <DailyAttendance />
        <CeoMessage />
      </div>

      {/* Main 2/3 + 1/3 grid */}
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Left column */}
        <div className="space-y-5">
          <Multimedia />
          <TodoList />
          <div className="grid gap-5 md:grid-cols-2">
            <CalendarCard />
            <EmployeeOfMonth />
          </div>
          <SocialInsight />
          <OrgStructure />
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <UpcomingMeetings />
          <QuickActions />
          <MostUsedServices />
          <Extensions />
        </div>
      </div>
    </div>
  )
}
