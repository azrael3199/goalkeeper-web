'use client';

import SignInWithGoogle from '@root/components/client/SignInWithGoogle';
import React from 'react';

const Login = () => (
  <div className="p-3 rounded-md text-left">
    <form>
      <div className="mb-3">
        <label
          htmlFor="username"
          className="block text-gray-800 dark:text-white"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          className="w-full border-gray-300 dark:border-gray-600 p-2 rounded"
        />
      </div>
      <div className="mb-8">
        <label
          htmlFor="password"
          className="block text-gray-800 dark:text-white"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          className="w-full border-gray-300 dark:border-gray-600 p-2 rounded"
        />
      </div>
      <div className="text-center mb-4">
        <button
          type="submit"
          className="bg-primary hover:bg-cyan-500 text-white py-2 px-4 rounded w-full"
        >
          <b className="uppercase">Login</b>
        </button>
      </div>
      <div className="flex items-center justify-center w-full mb-4">
        <SignInWithGoogle onClick={() => {}} />
      </div>
    </form>
    <div className="mt-4 text-center w-full">
      <p className="mb-4 text-gray-800 dark:text-white">
        Don&apos;t have an account?{' '}
        <a href="/signup" className="text-blue-500">
          Sign Up
        </a>
      </p>
    </div>
  </div>
);

export default Login;
