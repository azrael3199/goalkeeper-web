'use client';

import { AppContext } from '@root/providers/AppProvider';
import { cn } from '@root/lib/utils/utils';
import React, { useContext, useEffect } from 'react';
import SwimlaneSection from '@root/components/SwimlaneSection/SwimlaneSection';

interface CountWidgetProps {
  count: string;
  color: string;
  title: string;
}

const CountWidget: React.FC<
  CountWidgetProps & React.ComponentPropsWithRef<'div'>
> = ({ count, color, title, ...props }) => (
  <div
    {...props}
    className={cn(
      'p-2 flex items-center gap-2 text-sm text-text-secondary w-fit',
      // eslint-disable-next-line react/prop-types
      props.className
    )}
  >
    <div
      className={cn(
        'rounded-full w-12 h-12 flex items-center justify-center text-normal font-bold text-text-primary'
      )}
      style={{
        backgroundColor: color,
      }}
    >
      {count}
    </div>
    <p className="lg:max-w-[60px] text-xs">{title}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const { user, isLoading, setLoading } = useContext(AppContext);

  // TODO: Replace with actual data
  const taskCounts = [
    {
      count: '5',
      color: '#562cff',
      title: 'Completed Tasks',
    },
    {
      count: '2',
      color: '#ff7a00',
      title: 'Open Tasks',
    },
    {
      count: '100%',
      color: '#00b81d',
      title: 'Productivity',
    },
  ];

  useEffect(() => {
    if (isLoading) setLoading(false); // Workaround till Next introduces interceptors
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="text-xl">Welcome, {user?.displayName} 👋</div>
      <section className="text-sm flex flex-col md:flex-row md:items-center gap-2 py-3 text-text-secondary">
        This week, you have
        <div className="flex gap-2 flex-wrap">
          {taskCounts.map((task) => (
            <CountWidget key={task.title} {...task} />
          ))}
        </div>
      </section>
      <SwimlaneSection />
    </>
  );
};
export default Dashboard;
