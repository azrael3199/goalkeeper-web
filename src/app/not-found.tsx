import Translator from '@root/components/client/Translator';
import Image from 'next/image';

const NotFound = () => (
  <div className="flex justify-center items-center h-screen w-screen">
    <div className="text-center w-fit">
      <div className="p-8 mb-8 text-center dark:text-white text-6xl">404</div>
      <div className="flex items-center justify-center">
        <Image
          src="/illustrations/not_found.svg"
          alt="not found"
          style={{
            objectFit: 'contain',
            objectPosition: 'center',
            height: '50%',
            width: '50%',
          }}
          height={10}
          width={10}
        />
      </div>
      <div className="p-8 mt-8 text-center dark:text-white text-lg">
        <Translator stringToTranslate="errors.pageNotFound" />
      </div>
    </div>
  </div>
);

export default NotFound;
