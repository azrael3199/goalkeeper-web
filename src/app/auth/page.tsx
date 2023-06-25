import Image from 'next/image';
import Login from './Login';

function LoginPage() {
  return (
    <div className="h-screen">
      <div className="md:flex h-full">
        {/* Left Side: SVG Image */}
        <div className="md:w-2/3 md:h-full w-full h-1/3">
          <div className="flex items-center justify-center h-full">
            <div className="p-8 animate-fade-in">
              <Image
                src="/illustrations/authentication.svg"
                alt="Image"
                width={900}
                height={900}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Login Panel | SignUp Panel */}
        <div className="py-10 px-10 md:w-1/3 md:h-full w-full h-2/3 flex items-center justify-center dark:bg-gray-800 rounded-t-xl md:rounded-t-none md:rounded-l-xl">
          <div className="md:w-3/4">
            <div className="flex w-full items-center justify-center">
              <Image
                src="/goalkeeper-main.svg"
                alt="Goalkeeper"
                style={{
                  height: '60%',
                  width: '60%',
                }}
                height={10}
                width={10}
              />
            </div>
            <div className="py-4">
              <Login />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
