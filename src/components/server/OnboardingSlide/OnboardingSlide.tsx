import Image from 'next/image';
import React from 'react';

interface OnboardingSlideProps {
  imageSrc: string;
  title: string;
  description: string;
  reverse?: boolean;
  active?: boolean;
}

const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  imageSrc,
  title,
  description,
  reverse = false,
  active = false,
}) => (
  <div
    className={`w-screen h-full pb-10 pt-4 px-10 flex flex-col md:flex-row items-center justify-center ${
      reverse ? 'md:flex-row-reverse' : ''
    }`}
  >
    <div className="md:w-1/2 p-12">
      <div className="relative w-full h-full">
        <div
          className="aspect-w-1 aspect-h-1"
          style={{ height: '100%', width: '100%' }}
        >
          <Image
            src={imageSrc}
            alt="Illustration"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
            }}
            height={100}
            width={100}
          />
        </div>
      </div>
    </div>
    <div className="md:w-1/2 mt-6 md:mt-0">
      <h2 className="text-3xl font-bold mb-4 dark:text-white">{title}</h2>
      <p
        className={`text-lg text-gray-700 dark:text-slate-400 ${
          active ? 'opacity-100 animate-fade-in' : 'opacity-0'
        } transition-opacity duration-500`}
      >
        {description}
      </p>
    </div>
  </div>
);

export default OnboardingSlide;
