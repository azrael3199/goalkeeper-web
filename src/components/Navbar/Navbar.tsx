'use client';

import { cn } from '@root/lib/utils/utils';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { Separator } from '../ui/separator';
import NAV_ITEMS from './NavItems';

interface SidebarSectionItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  selected?: boolean;
}

interface SidebarSectionProps {
  children: React.ReactNode;
  title?: string;
}

const SidebarSectionItem: React.FC<
  SidebarSectionItemProps & React.ComponentProps<'div'>
> = ({ children, icon, selected = false, ...props }) => (
  <div
    {...props}
    className={cn(
      'flex gap-3 w-full items-center text-gray-400 text-sm p-2 px-4 cursor-pointer rounded-md hover:bg-slate-900',
      {
        'bg-slate-800 hover:bg-slate-800': selected,
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

const SidebarSection: React.FC<
  SidebarSectionProps & React.ComponentPropsWithRef<'section'>
> = ({ children, title, ...props }) => (
  // eslint-disable-next-line react/prop-types
  <section {...props} className={cn('p-3', props.className)}>
    {title && (
      <p className="uppercase text-gray-600 py-2 font-bold text-sm">{title}</p>
    )}
    <nav className="flex flex-col gap-1 items-center py-2">{children}</nav>
  </section>
);

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const onNavItemClick = (route: string) => {
    if (pathname !== route) {
      router.push(route);
    }
  };

  return (
    <aside className="hidden md:block min-w-[200px] grow min-h-screen border-r border-r-border px-2">
      <section id="logo-space" className="p-4 flex justify-center items-center">
        <div className="w-56">
          <Image
            src="/goalkeeper-main.svg"
            alt="Brand Logo"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </section>
      <Separator />
      <SidebarSection title="Menu">
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
      </SidebarSection>
    </aside>
  );
};

export default Navbar;
