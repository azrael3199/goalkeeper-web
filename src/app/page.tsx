'use client';

import Navbar from '@root/components/client/Navbar';
import ProtectedRoute from '@root/components/client/ProtectedRoute';
import LoadingOverlay from '@root/components/server/LoadingOverlay';
import OnboardingSlide from '@root/components/server/OnboardingSlide';
import { AppContext } from '@root/context/AppContext';
import i18n from '@root/i18n';
import { useContext, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';

const slides = [
  {
    key: 'slide_1',
    imageSrc: '/illustrations/onboarding_slide1.svg',
    title: 'slideTitle1',
    description: 'slideDesc1',
  },
  {
    key: 'slide_2',
    imageSrc: '/illustrations/onboarding_slide2.svg',
    title: 'slideTitle2',
    description: 'slideDesc2',
  },
  {
    key: 'slide_3',
    imageSrc: '/illustrations/onboarding_slide3.svg',
    title: 'slideTitle3',
    description: 'slideDesc3',
  },
];

const SLIDE_CHANGE_TIMER = 10000;

const LandingPage = () => {
  const { isLoading, setLoading } = useContext(AppContext);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (isLoading) setLoading(false); // Workaround till Next introduces interceptors
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prevSlide: number) =>
        prevSlide === slides.length - 1 ? 0 : prevSlide + 1
      );
    }, SLIDE_CHANGE_TIMER);

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setActiveSlide((prevSlide: number) =>
      prevSlide === slides.length - 1 ? 0 : prevSlide + 1
    );
  };

  const handlePrev = () => {
    setActiveSlide((prevSlide: number) => (prevSlide > 0 ? prevSlide - 1 : 0));
  };

  const handleSlideChange = (slideIndex: number) => {
    setActiveSlide(slideIndex);
  };

  const handleSlideMove = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      // Move to the previous tab
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      // Move to the next tab
      handleNext();
    }
  };

  return (
    <ProtectedRoute redirectToDashboardOnSuccess>
      <I18nextProvider i18n={i18n}>
        <div className="flex flex-col h-screen">
          <Navbar />
          <main className="relative h-full overflow-x-hidden overflow-y-auto">
            <div
              className="flex w-full md:h-full transition-transform duration-500 ease-in-out"
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
            <div
              role="tablist"
              className="fixed bottom-6 w-full flex justify-center mt-6"
            >
              {slides.map((slide, index) => (
                <div
                  role="tab"
                  tabIndex={0}
                  key={slide.key}
                  className={`w-4 h-4 mx-2 rounded-full ${
                    index === activeSlide ? 'bg-gray-400' : 'bg-gray-700'
                  }`}
                  onClick={() => handleSlideChange(index)}
                  onKeyDown={(e) => handleSlideMove(e)}
                />
              ))}
            </div>
          </main>
        </div>
        <LoadingOverlay />
      </I18nextProvider>
    </ProtectedRoute>
  );
};

export default LandingPage;
