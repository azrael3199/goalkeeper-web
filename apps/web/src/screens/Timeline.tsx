import { Card, CardHeader, CardTitle, CardContent, Badge } from '@goalkeeper/ui';
import { Target, CalendarDays, Clock } from 'lucide-react';

export const Timeline = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Marathon Prep 2026</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Target className="w-4 h-4" /> 
            Target Date: Dec 12, 2026
          </p>
        </div>
        <Badge variant="success" className="text-sm py-1">On Track</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Journey Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Timeline Item 1 */}
            <div className="relative pl-8 border-l-2 border-[#2D9CDB]/30 space-y-2">
              <div className="absolute -left-[11px] top-0 h-5 w-5 rounded-full bg-white border-4 border-[#2D9CDB]"></div>
              <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Completed 10km Run</h4>
                    <p className="text-xs text-gray-500 mt-1">Verified by your buddy Alex.</p>
                  </div>
                  <span className="text-xs font-medium text-[#27AE60]">+300 XP</span>
              </div>
              <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                 <Clock className="w-3 h-3" /> Yesterday, 8:00 AM
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative pl-8 border-l-2 border-[#2D9CDB] space-y-2">
              <div className="absolute -left-[11px] top-0 h-5 w-5 rounded-full bg-white border-4 border-[#F2994A]"></div>
              <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Missed Recovery Swim</h4>
                    <p className="text-xs text-gray-500 mt-1">Lost your 5-day streak multiplier.</p>
                  </div>
                  <span className="text-xs font-medium text-[#EB5757]">-50 XP</span>
              </div>
              <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                 <Clock className="w-3 h-3" /> 3 days ago
              </div>
            </div>

             {/* Timeline Item 3 */}
             <div className="relative pl-8 border-l-2 border-transparent space-y-2">
              <div className="absolute -left-[11px] top-0 h-5 w-5 rounded-full bg-[#27AE60] border-4 border-[#27AE60]"></div>
              <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-white">Goal Created!</h4>
                    <p className="text-xs text-gray-500 mt-1">You pledged to run a marathon.</p>
                  </div>
              </div>
              <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                 <CalendarDays className="w-3 h-3" /> Jan 1, 2026
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Accountability Buddies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="h-10 w-10 bg-[#1A3C6E] text-white rounded-full flex items-center justify-center font-bold">AL</div>
                <div>
                   <p className="text-sm font-bold">Alex</p>
                   <p className="text-xs text-gray-500">Timezone match • Lvl 12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
             <CardHeader className="pb-2">
                <CardTitle className="text-sm">Goal Stats</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Tasks Completed</span>
                    <span className="font-bold">14/150</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Proof Rate</span>
                    <span className="font-bold text-[#27AE60]">92%</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Earned XP</span>
                    <span className="font-bold text-[#2D9CDB]">4,500</span>
                 </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
