import React from 'react';
import {
  Target,
  Trophy,
  Users,
  Shield,
  Layout,
  Bell,
  Library,
  Smartphone,
} from 'lucide-react';

const features = [
  {
    icon: <Target className="w-8 h-8 text-blue-500" />,
    title: 'AI-Powered SMART Goals',
    description:
      "Our AI analyzes your goals to ensure they're Specific, Measurable, Achievable, Relevant, and Time-bound.",
  },
  {
    icon: <Trophy className="w-8 h-8 text-yellow-500" />,
    title: 'Gamified Progress',
    description:
      'Stay motivated with karma points, achievements, and rewards as you progress towards your goals.',
  },
  {
    icon: <Users className="w-8 h-8 text-green-500" />,
    title: 'Community Support',
    description:
      "Join a community of goal-setters, share experiences, and get motivated by others' success stories.",
  },
  {
    icon: <Shield className="w-8 h-8 text-purple-500" />,
    title: 'Accountability System',
    description:
      'Our unique verifier system ensures you stay accountable and honest with your progress.',
  },
  {
    icon: <Layout className="w-8 h-8 text-blue-500" />,
    title: 'Smart Dashboard',
    description:
      'Track your progress with beautiful charts, analytics, and insights all in one place.',
  },
  {
    icon: <Bell className="w-8 h-8 text-pink-500" />,
    title: 'Smart Notifications',
    description:
      'Get intelligent reminders and motivational nudges exactly when you need them.',
  },
  {
    icon: <Library className="w-8 h-8 text-orange-500" />,
    title: 'Goal Libraries',
    description:
      'Access pre-made goal templates and best practices from successful achievers.',
  },
  {
    icon: <Smartphone className="w-8 h-8 text-teal-500" />,
    title: 'Cross-Platform',
    description:
      'Stay connected with your goals on iOS, Android, and web platforms.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-purple-900/10 to-gray-900" />
      <div className="container mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Powerful Features
            </span>{' '}
            for Ambitious Goals
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to transform your goals from dreams to reality
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className="group bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl hover:transform hover:-translate-y-1 transition-all duration-300 border border-gray-700/50 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="bg-gray-700/50 p-3 rounded-lg w-fit mb-4 group-hover:bg-gray-700/70 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
