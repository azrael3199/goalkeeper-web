'use client';

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useContext } from 'react';
import {
  CircleUserRoundIcon,
  LogOutIcon,
  SearchIcon,
  SettingsIcon,
} from 'lucide-react';
import { cn } from '@root/lib/utils/utils';
import { AppContext } from '@root/providers/AppProvider';
import Image from 'next/image';
import { logout } from '@root/lib/utils/firebaseUtils';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import NotificationsMenu from './Notifications/NotificationsMenu';

const ProfileIcon: React.FC = () => {
  const { user } = useContext(AppContext);

  if (!user) {
    return;
  }

  const onLogout = () => {
    logout();
  };

  // eslint-disable-next-line consistent-return
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="border-border p-0 w-9 h-9 rounded-full"
        >
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              alt={user.displayName!}
              width={0}
              height={0}
              sizes="100vw"
              className="rounded-full"
              style={{ width: '100%', height: 'auto' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {user.displayName?.[0]}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-24 w-fit bg-slate-900 rounded-md p-3 px-2">
        <p className="text-gray-600 font-semibold text-sm px-2">
          {user.displayName}
        </p>
        <ul className="py-1 pt-4 flex flex-col items-center gap-1 text-sm">
          <li className="flex gap-5 py-2 w-full items-center justify-center cursor-pointer hover:bg-slate-800 rounded-md">
            <CircleUserRoundIcon className="w-5" />
            <p>Account</p>
          </li>
          <li className="flex gap-5 py-2 w-full items-center justify-center cursor-pointer hover:bg-slate-800 rounded-md">
            <SettingsIcon className="w-5" />
            <p>Settings</p>
          </li>
          <li
            className="flex gap-5 py-2 w-full items-center justify-center cursor-pointer hover:bg-slate-800 rounded-md"
            onClick={onLogout}
          >
            <LogOutIcon className="w-5" />
            <p>Sign Out</p>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};

const SearchInput: React.FC<React.ComponentPropsWithRef<'div'>> = (props) => (
  <div
    {...props}
    className={cn(
      'bg-card border border-border rounded-full px-4 flex items-center',
      // eslint-disable-next-line react/destructuring-assignment, react/prop-types
      props.className
    )}
  >
    <SearchIcon className="w-5 text-gray-400" />
    <Input
      className="bg-transparent border-none focus:border-none focus-visible:border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none focus:outline-none active:border-none"
      type="text"
      placeholder="Search"
    />
  </div>
);

const Header: React.FC = () => (
  <header className="w-full flex p-3">
    <div className="grow w-full">
      <SearchInput className="w-full md:w-1/2" />
    </div>
    <div className="px-2 pr-0.5 md:pr-1 flex justify-center">
      <NotificationsMenu />
    </div>
    <div className="px-2">
      <ProfileIcon />
    </div>
  </header>
);

export default Header;
