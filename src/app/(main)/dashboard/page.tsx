'use client';

import { AppContext } from '@root/context/AppContext';
import { cn } from '@root/lib/utils/utils';
import React, { useContext, useEffect } from 'react';

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
      'p-1 flex items-center gap-2 w-fit',
      // eslint-disable-next-line react/prop-types
      props.className
    )}
  >
    <div
      className={cn(
        'rounded-full w-11 h-11 flex items-center justify-center text-xs font-bold text-text-primary'
      )}
      style={{
        backgroundColor: color,
      }}
    >
      {count}
    </div>
    <p className="lg:max-w-[60px] text-xs text-muted-foreground">{title}</p>
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
    <div className="p-4 pt-8">
      <div className="text-xl flex items-center gap-2">
        Welcome, {user?.displayName} <p className="text-2xl">👋</p>
      </div>
      <section className="text-sm flex items-center gap-2 py-3 text-text-secondary">
        This week you have
        {taskCounts.map((task) => (
          <CountWidget key={task.title} {...task} />
        ))}
      </section>
    </div>
  );
};
export default Dashboard;
