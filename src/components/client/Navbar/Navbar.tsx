'use client';

import env from '@root/environment';

const Navbar = () => (
  <nav className="bg-blue-500 dark:bg-slate-800 py-4 flex justify-between items-center">
    <h1 className="text-white text-2xl font-bold ml-8">{env.appTitle}</h1>
    <div className="mr-8 flex">
      <button
        type="button"
        className="bg-white text-primary dark:text-primary px-4 py-2 rounded mr-4"
      >
        Login
      </button>
      <button
        type="button"
        className="bg-blue-700 dark:bg-primary text-white px-4 py-2 rounded"
      >
        Sign Up
      </button>
    </div>
  </nav>
);

export default Navbar;
