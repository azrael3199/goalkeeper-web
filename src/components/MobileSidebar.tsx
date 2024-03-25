'use client';

import { cn } from '@root/lib/utils/utils';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

import { EarthIcon, HomeIcon } from 'lucide-react';
import paths from '@root/routes';

interface SidebarSectionItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  selected?: boolean;
}

const SidebarSectionItem: React.FC<
  SidebarSectionItemProps & React.ComponentProps<'div'>
> = ({ children, icon, selected = false, ...props }) => (
  <div
    {...props}
    className={cn(
      'flex flex-col gap-1 w-full items-center text-gray-400 text-sm p-2 cursor-pointer rounded-full',
      {
        'bg-gray-300': selected,
        'text-background': selected,
      },
      // eslint-disable-next-line react/prop-types
      props.className
    )}
  >
    {icon}
    {children}
  </div>
);

const MobileSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const onNavItemClick = (route: string) => {
    if (pathname !== route) {
      router.push(route);
    }
  };

  return (
    <aside className="flex gap-1 md:hidden border-t border-t-border p-2">
      <SidebarSectionItem
        icon={<HomeIcon className="w-5" />}
        selected={pathname === paths.dashboard}
        onClick={() => onNavItemClick(paths.dashboard)}
      >
        Home
      </SidebarSectionItem>
      <SidebarSectionItem
        icon={<EarthIcon className="w-5" />}
        selected={pathname === paths.spaces}
        onClick={() => onNavItemClick(paths.spaces)}
      >
        Spaces
      </SidebarSectionItem>
    </aside>
  );
};

export default MobileSidebar;
