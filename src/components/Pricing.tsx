import React from 'react';
import { Check } from 'lucide-react';
import { Button } from './ui/button';

const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for getting started with goal tracking',
    features: [
      'Up to 3 active goals',
      'Basic goal tracking',
      'Community access',
      'Mobile app access',
      'Progress dashboard',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '9.99',
    description: 'Ideal for ambitious goal-setters',
    features: [
      'Unlimited active goals',
      'AI-powered SMART analysis',
      'Advanced analytics',
      'Priority support',
      'Verifier system',
      'Custom goal templates',
      'Calendar integration',
      'No ads',
    ],
    cta: 'Join Waitlist',
    popular: true,
  },
  {
    name: 'Team',
    price: '19.99',
    description: 'Perfect for teams and organizations',
    features: [
      'Everything in Pro',
      'Team goal tracking',
      'Collaborative features',
      'Team analytics',
      'Admin dashboard',
      'API access',
      'Custom branding',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-purple-900/10 to-gray-900" />
      <div className="container mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Simple, Transparent Pricing
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your goal-setting journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className={`flex flex-col relative bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 hover:transform hover:-translate-y-1 ${
                plan.popular
                  ? 'border-primary shadow-lg shadow-primary/20'
                  : 'border-gray-700/50 hover:border-primary/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-white text-sm px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="mb-3">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="text-gray-400">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8 grow">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    // eslint-disable-next-line react/no-array-index-key
                    key={featureIndex}
                    className="flex items-center text-gray-300"
                  >
                    <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full py-3 px-6 rounded-full font-medium transition-all duration-300 ${
                  plan.popular
                    ? 'bg-primary hover:bg-primary-dark text-white'
                    : 'bg-gray-700/50 hover:bg-gray-700 text-white'
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-400">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}
