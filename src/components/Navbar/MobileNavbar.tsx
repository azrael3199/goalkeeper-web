'use client';

import { cn } from '@root/lib/utils/utils';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import NAV_ITEMS from './NavItems';

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
      'flex flex-col gap-1 w-full items-center text-gray-400 text-sm p-2 cursor-pointer rounded-lg',
      {
        'bg-accent hover:bg-secondary': selected,
        'font-semibold text-gray-200': selected,
      },
      // eslint-disable-next-line react/prop-types
      props.className
    )}
  >
    {icon}
    {children}
  </div>
);

const MobileNavbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const onNavItemClick = (route: string) => {
    if (pathname !== route) {
      router.push(route);
    }
  };

  return (
    <aside className="flex w-full gap-1 md:hidden border-t border-t-border p-2 bg-background">
      {NAV_ITEMS.map((item) => (
        <SidebarSectionItem
          key={item.title}
          icon={item.icon}
          selected={pathname === item.path}
          onClick={() => onNavItemClick(item.path)}
        >
          {item.title}
        </SidebarSectionItem>
      ))}
    </aside>
  );
};

export default MobileNavbar;
