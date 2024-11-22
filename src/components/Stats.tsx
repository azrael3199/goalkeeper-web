import React from 'react';

const features = [
  {
    title: 'Early Access Benefits',
    description:
      'Be among the first to experience our revolutionary goal-setting platform',
  },
  {
    title: 'Exclusive Features',
    description: 'Get lifetime access to premium features as an early adopter',
  },
  {
    title: 'Priority Support',
    description: 'Direct access to our founding team for feedback and support',
  },
  {
    title: 'Founding Member',
    description: 'Special recognition and benefits for our earliest supporters',
  },
];

export default function Stats() {
  return (
    <section className="py-20 px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-purple-900/10 to-gray-900" />
      <div className="container mx-auto relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Join the Waitlist
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Be part of our exclusive early access program and shape the future
            of goal achievement
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50"
            >
              <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
