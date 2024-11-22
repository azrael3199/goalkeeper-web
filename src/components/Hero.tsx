import React from 'react';
import Image from 'next/image';
import { ChevronRight, Play } from 'lucide-react';
import { Button } from './ui/button';

export default function Hero() {
  return (
    <section className="hero-section relative min-h-screen flex items-center pt-24 pb-20 px-6 overflow-hidden">
      <div className="container mx-auto relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Pre-launch Badge */}
          <div className="fade-in-left inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <span className="animate-pulse w-2 h-2 rounded-full bg-primary mr-2" />
            <span className="text-sm text-primary-light">
              Coming Soon - Join the Waitlist
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 fade-in-up">
            <span className="bg-gradient-to-r from-primary-light via-primary to-primary-dark text-primary bg-clip-text">
              Transform Your Goals
            </span>
            <br />
            Into Reality
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto fade-in">
            Your AI-powered goal-tracking companion. Set SMART goals, track
            progress, and achieve more with our gamified productivity platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 scale-in">
            <Button className="group bg-primary hover:bg-primary-dark px-8 py-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
              Join Early Access
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button className="bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center border border-gray-700/50">
              <Play className="mr-2 w-5 h-5" />
              Watch Preview
            </Button>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 relative fade-in-up-slow">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />
            <div className="absolute -inset-px bg-gradient-to-r from-primary/20 to-primary-dark/20 rounded-t-2xl" />
            <Image
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2400&q=80"
              alt="Dashboard Preview"
              className="rounded-t-2xl shadow-2xl shadow-primary/10 border border-gray-800/50"
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
