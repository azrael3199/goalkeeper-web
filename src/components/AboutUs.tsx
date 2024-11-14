import React from 'react';
import { Target, Users, Heart, Sparkles } from 'lucide-react';

const values = [
  {
    icon: <Target className="w-6 h-6 text-primary" />,
    title: 'Mission Driven',
    description:
      "We're on a mission to help millions achieve their goals through smart technology and human connection.",
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: 'Community First',
    description:
      'Built with and for our community of goal-setters, dreamers, and achievers.',
  },
  {
    icon: <Heart className="w-6 h-6 text-primary" />,
    title: 'User Focused',
    description:
      "Every feature we build starts with understanding our users' needs and challenges.",
  },
  {
    icon: <Sparkles className="w-6 h-6 text-primary" />,
    title: 'Innovation Led',
    description:
      'Constantly pushing boundaries with AI and technology to make goal achievement easier.',
  },
];

export default function AboutUs() {
  return (
    <section id="about" className="py-20 px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-purple-900/10 to-gray-900" />
      <div className="container mx-auto relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                About Goalkeeper
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              We&apos;re building the future of goal achievement, combining
              cutting-edge technology with human psychology
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Our Story</h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  Born from the frustration of scattered goal-tracking tools and
                  lack of accountability, Goalkeeper was created to
                  revolutionize how people achieve their goals.
                </p>
                <p>
                  We believe that everyone has the potential to achieve
                  extraordinary things with the right tools, support, and
                  motivation. That&apos;s why we&apos;ve built a platform that
                  combines AI-powered insights with human connection.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"
                alt="Team Collaboration"
                className="rounded-2xl shadow-2xl shadow-primary/10 border border-gray-800/50"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-primary/50 transition-all duration-300"
              >
                <div className="bg-gray-700/50 p-3 rounded-lg w-fit mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
