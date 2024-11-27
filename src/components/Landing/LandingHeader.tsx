'use client';

import { AppContext } from '@root/providers/AppProvider';
import env from '@root/environment';
import paths from '@root/routes';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { fontLeagueSpartan } from '@root/app/fonts';
import { cn } from '@root/lib/utils/utils';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';

function LandingHeader() {
  const router = useRouter();
  const { setLoading } = useContext(AppContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = (navPath: string) => {
    setLoading(true);
    router.replace(navPath);
  };

  return (
    <header
      className={cn(
        'fixed w-full z-50 transition-all duration-300',
        fontLeagueSpartan.variable,
        {
          'bg-gray-900/95 backdrop-blur-md py-4': isScrolled,
          'bg-transparent py-6': !isScrolled,
        }
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* <div className="flex items-center space-x-2"> */}
        {/* <DarkThemeToggle /> */}
        <div className="flex items-center justify-center text-white text-2xl font-bold inline">
          <Image
            src="/goalkeeper-main.svg"
            alt={env.appTitle}
            style={{ objectFit: 'contain', objectPosition: 'center' }}
            width={50}
            height={50}
            priority
          />
          <span className="hidden md:flex justify-center items-center mt-2">
            <h1 className="text-white mr-0.5 ml-1">Goal</h1>
            <h1 className="text-primary">Keeper.</h1>
          </span>
        </div>
        {/* </div> */}

        <nav className="hidden lg:flex items-center space-x-8 -ml-16">
          <a
            href="#features"
            className="text-gray-300 hover:text-primary transition-colors"
          >
            Features
          </a>
          <a
            href="#dashboard"
            className="text-gray-300 hover:text-primary transition-colors"
          >
            Dashboard
          </a>
          <a
            href="#pricing"
            className="text-gray-300 hover:text-primary transition-colors"
          >
            Pricing
          </a>
          <a
            href="#about_us"
            className="text-gray-300 hover:text-primary transition-colors"
          >
            About Us
          </a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button
            type="button"
            className="bg-primary/10 hover:bg-primary/20 text-primary px-6 py-2 rounded-full transition-all duration-300"
            onClick={() => {
              navigate(paths.login);
            }}
          >
            Join Waitlist
          </Button>
        </div>

        <Button
          type="button"
          variant="link"
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-900/95 backdrop-blur-md py-4">
          <div className="container mx-auto px-6 flex flex-col space-y-4">
            <a
              href="#features"
              className="text-gray-300 hover:text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#dashboard"
              className="text-gray-300 hover:text-primary transition-colors"
            >
              Dashboard
            </a>
            <a
              href="#pricing"
              className="text-gray-300 hover:text-primary transition-colors"
            >
              Pricing
            </a>
            <a
              href="#about_us"
              className="text-gray-300 hover:text-primary transition-colors"
            >
              About Us
            </a>
            <hr className="border-gray-800" />
            <Button
              type="button"
              className="bg-primary/10 hover:bg-primary/20 text-primary px-6 py-2 rounded-full transition-all duration-300"
            >
              Join Waitlist
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export default LandingHeader;
