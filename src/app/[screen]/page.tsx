import Image from 'next/image';
import env from '@root/environment';
import AuthIllustration from '@root/components/client/AuthIllustration';
import AuthWrapper from './AuthWrapper';

type IAuthPageProps = {
  params: {
    screen: string;
    [key: string]: unknown;
  };
};

function AuthPage({ params }: IAuthPageProps) {
  return (
    <div className="h-screen">
      <div className="md:flex h-full">
        {/* Left Side: SVG Image */}
        <div className="md:w-2/3 md:h-full w-full h-1/5">
          <div className="flex items-center justify-center h-full">
            <AuthIllustration register={params.screen === 'register'} />
          </div>
        </div>

        {/* Right Side: Login Panel | SignUp Panel */}
        <div
          className="pt-5 md:w-1/3 md:h-full w-full h-4/5 md:flex md:items-center md:justify-center dark:bg-gray-800 rounded-t-xl md:rounded-l-xl"
          style={{ boxShadow: '-1px 1px 5px rgba(255, 255, 255, 0.8)' }}
        >
          <div className="w-full py-5 px-10 md:w-3/4 animate-fade-in max-h-full overflow-y-auto">
            <div className="flex w-full items-center justify-center">
              <Image
                src="/goalkeeper-main.svg"
                alt={env.appTitle!}
                style={{
                  height: '60%',
                  width: '60%',
                }}
                height={10}
                width={10}
              />
            </div>
            <AuthWrapper />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
