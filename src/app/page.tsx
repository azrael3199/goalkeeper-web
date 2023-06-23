'use client';

import Navbar from '@root/components/client/Navbar/Navbar';
import OnboardingSlide from '@root/components/server/OnboardingSlide/OnboardingSlide';
import React, { useEffect, useState } from 'react';

const slides = [
  {
    key: 'slide_1',
    imageSrc: '/illustrations/onboarding_slide1.svg',
    title: 'Slide 1',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    key: 'slide_2',
    imageSrc: '/illustrations/onboarding_slide2.svg',
    title: 'Slide 2',
    description:
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    key: 'slide_3',
    imageSrc: '/illustrations/onboarding_slide3.svg',
    title: 'Slide 3',
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
];

const SLIDE_CHANGE_TIMER = 10000;

const LandingPage = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prevSlide: number) =>
        prevSlide === slides.length - 1 ? 0 : prevSlide + 1
      );
    }, SLIDE_CHANGE_TIMER);

    return () => clearInterval(interval);
  }, []);

  const handleSlideChange = (slideIndex: number) => {
    setActiveSlide(slideIndex);
  };

  const handleSlideMove = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      // Move to the previous tab
      setActiveSlide((prevSlide: number) =>
        prevSlide > 0 ? prevSlide - 1 : 0
      );
    } else if (e.key === 'ArrowRight') {
      // Move to the next tab
      setActiveSlide((prevSlide: number) =>
        prevSlide === slides.length - 1 ? 0 : prevSlide + 1
      );
    }
  };

  return (
    <div className="flex flex-col h-screen dark:bg-slate-900">
      <Navbar />
      <main className="relative h-full overflow-x-hidden overflow-y-auto">
        <div
          className="flex w-full h-full transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${activeSlide * 100}%)`,
          }}
        >
          {slides.map((slide, index) => (
            <div key={slide.key} className="w-screen h-full">
              <OnboardingSlide
                imageSrc={slide.imageSrc}
                title={slide.title}
                description={slide.description}
                reverse={index % 2 !== 0}
                active={activeSlide === index}
              />
            </div>
          ))}
        </div>
        <div className="absolute bottom-6 w-full flex justify-center mt-6">
          {slides.map((slide, index) => (
            <div
              role="tab"
              tabIndex={index}
              key={slide.key}
              className={`w-4 h-4 mx-2 rounded-full ${
                index === activeSlide ? 'bg-gray-200' : 'bg-gray-500'
              }`}
              onClick={() => handleSlideChange(index)}
              onKeyDown={(e) => handleSlideMove(e)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
