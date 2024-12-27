'use client';

import React from 'react';
import { BellIcon, Megaphone } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const NOTIFICATIONS = [
  {
    id: 1,
    title:
      'You have 5 uncompleted tasks. Be sure to complete them before the time is up',
    isoDate: '2022-01-01',
    source: 'Source 1',
  },
  {
    id: 2,
    title:
      'You have 5 uncompleted tasks. Be sure to complete them before the time is up',
    isoDate: '2022-01-01',
    source: 'Source 2',
  },
  {
    id: 3,
    title:
      'You have 5 uncompleted tasks. Be sure to complete them before the time is up',
    isoDate: '2022-01-01',
    source: 'Source 3',
  },
  {
    id: 4,
    title:
      'You have 5 uncompleted tasks. Be sure to complete them before the time is up',
    isoDate: '2022-01-01',
    source: 'Source 4',
  },
];

const NotificationsMenu = () => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" className="p-2 relative">
        <BellIcon className="w-[1.2rem] h-[1.2rem]" />
        {NOTIFICATIONS.length > 0 && (
          <div className="absolute top-[6px] right-[6px] w-2 h-2 bg-red-600 rounded-full text-[6px] flex items-center justify-center" />
        )}
      </Button>
    </PopoverTrigger>
    <PopoverContent
      sideOffset={5}
      className="relative m-2 mt-0 max-h-[300px] md:max-h-[500px] w-[400px] flex flex-col gap-2 border border-border rounded-md text-xs bg-card p-2"
    >
      <p className="text-card-foreground text-lg font-semibold">
        Notifications{' '}
        {NOTIFICATIONS.length > 0 ? `(${NOTIFICATIONS.length})` : ''}
      </p>
      {NOTIFICATIONS.map((notification) => (
        <div
          key={notification.id}
          className="flex px-2 gap-2 items-center bg-secondary rounded-md"
        >
          <div className="h-9 aspect-square bg-card flex items-center justify-center rounded-full">
            <Megaphone className="w-3/5 h-3/5" />
          </div>
          <div className="flex flex-col gap-1 p-2 ">
            <p>{notification.title}</p>
            <p className="text-gray-400 text-xs text-right">
              {new Date(notification.isoDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </PopoverContent>
  </Popover>
);

export default NotificationsMenu;
