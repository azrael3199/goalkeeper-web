import React from 'react';
import { LineChart, BarChart, Activity } from 'lucide-react';
import Image from 'next/image';

export default function Dashboard() {
  return (
    <section id="dashboard" className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/20 via-blue-900/10 to-gray-900" />

      <div className="container mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                Visualize Your Progress
              </span>{' '}
              with Our Smart Dashboard
            </h2>

            <p className="text-gray-300 mb-8 text-lg">
              Track your journey with intuitive analytics and beautiful
              visualizations. Our smart dashboard provides real-time insights
              into your goal progress.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: <LineChart className="w-6 h-6 text-blue-500" />,
                  title: 'Progress Tracking',
                  description:
                    'Monitor your goals with interactive charts and progress indicators',
                },
                {
                  icon: <BarChart className="w-6 h-6 text-purple-500" />,
                  title: 'Performance Analytics',
                  description:
                    'Get detailed insights into your productivity patterns',
                },
                {
                  icon: <Activity className="w-6 h-6 text-green-500" />,
                  title: 'Activity Timeline',
                  description:
                    'View your goal completion history and milestone achievements',
                },
              ].map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=80"
              alt="Dashboard Interface"
              className="rounded-2xl shadow-2xl shadow-blue-500/10 border border-gray-800/50"
              width={2400}
              height={800}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
