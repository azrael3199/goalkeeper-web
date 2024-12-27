'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Columns, List } from 'lucide-react';
import clsx from 'clsx';
import {
  transformTasksByPriority,
  transformTasksByStatus,
} from '@root/lib/utils/transforms';
import { Task } from '@root/lib/types/common';
import { taskData } from '@root/lib/utils/dummies';
import {
  endOfWeek,
  format,
  isThisMonth,
  isThisWeek,
  startOfWeek,
} from 'date-fns';
import Swimlane from './Swimlane';
import SectionWrapper from '../SectionWrapper';
import { Button } from '../ui/button';
import PriorityList from './PriorityList';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SwimlaneSectionProps {}

const SwimlaneSection: React.FC<SwimlaneSectionProps> = () => {
  const [selectedLayout, setSelectedLayout] = useState<number>(1);
  const [isMonthly] = useState<boolean>(false);
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(new Date()));
  const [data, setData] = useState<{ title: string; tasks: Task[] }[]>(() => {
    if (selectedLayout === 0) {
      return transformTasksByPriority(taskData, weekStart);
    }
    return transformTasksByStatus(taskData, weekStart);
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState<number>(1);

  const swimlaneData = transformTasksByStatus(taskData, weekStart);

  const onViewToggle = (selectedIndex: number) => {
    setSelectedLayout(selectedIndex);
    if (selectedIndex === 0) {
      setData(transformTasksByPriority(taskData, weekStart));
    } else {
      setData(transformTasksByStatus(taskData, weekStart));
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollPosition(target.scrollLeft);
  };

  const handlePreviousWeekChange = () => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() - 7);
    setWeekStart(newDate);
    if (selectedLayout === 0) {
      setData(transformTasksByPriority(taskData, newDate));
    } else {
      setData(transformTasksByStatus(taskData, newDate));
    }
  };

  const handleNextWeekChange = () => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() + 7);
    setWeekStart(newDate);
    if (selectedLayout === 0) {
      setData(transformTasksByPriority(taskData, newDate));
    } else {
      setData(transformTasksByStatus(taskData, newDate));
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      setScrollPosition(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef.current]);

  const getSectionTitle = (date: Date) => {
    if (isMonthly) {
      if (isThisMonth(date)) {
        return `This Month (${format(date, 'MMMM yyyy')})`;
      }
      return format(date, 'MMMM yyyy');
    }
    if (isThisWeek(date)) {
      return `This Week (${format(date, 'dd MMM')} - ${format(
        endOfWeek(date),
        'dd MMM'
      )})`;
    }
    return `${format(date, 'dd MMM')} - ${format(endOfWeek(date), 'dd MMM')}`;
  };

  return (
    <SectionWrapper
      title={getSectionTitle(weekStart)}
      titleComponent={
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="p-2"
            onClick={handlePreviousWeekChange}
          >
            <ChevronLeft className="w-5 w-aspect-1 h-aspect-1" />
          </Button>
          <h2 className="text-center">{getSectionTitle(weekStart)}</h2>
          <Button
            variant="ghost"
            className="p-2"
            onClick={handleNextWeekChange}
          >
            <ChevronRight className="w-5 w-aspect-1 h-aspect-1" />
          </Button>
        </div>
      }
      actions={
        <>
          <Button
            variant="outline"
            className={clsx('p-2', {
              'bg-accent hover:bg-accent': selectedLayout === 0,
            })}
            onClick={() => onViewToggle(0)}
          >
            <List className="w-5 w-aspect-1 h-aspect-1" />
          </Button>
          <Button
            variant="outline"
            className={clsx('p-2', {
              'bg-accent hover:bg-accent': selectedLayout === 1,
            })}
            onClick={() => onViewToggle(1)}
          >
            <Columns className="w-5 w-aspect-1 h-aspect-1" />
          </Button>
        </>
      }
    >
      {selectedLayout === 0 ? (
        // @ts-expect-error Ignore the type error
        <PriorityList data={data} />
      ) : (
        <section className="lg:relative">
          <div
            className="py-1 rounded-lg z-10 hidden lg:flex items-center justify-center lg:absolute w-10 lg:-left-4 lg:hover:cursor-pointer lg:top-1/2 lg:-translate-y-1/2 h-full bg-gradient-to-r from-card to-transparent flex items-center transition-opacity duration-200"
            style={{
              visibility: scrollPosition === 0 ? 'hidden' : 'visible',
            }}
          >
            <ChevronLeft
              className="text-3xl text-foreground w-6 h-6"
              onClick={() => {
                containerRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
                setScrollPosition(containerRef.current?.scrollLeft ?? 0);
              }}
            />
          </div>
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="relative lg:grid lg:grid-flow-col lg:auto-rows-fr lg:gap-3 lg:overflow-x-scroll py-1"
            style={{ scrollBehavior: 'smooth', scrollbarGutter: 'stable' }}
          >
            {swimlaneData.map((swimlane) => (
              <Swimlane
                key={swimlane.title}
                title={swimlane.title}
                className="lg:min-h-[375px] lg:min-w-[350px]"
                data={swimlane.tasks}
              />
            ))}
          </div>
          <div
            className="rounded-lg z-10 hidden lg:flex items-center justify-center lg:absolute w-10 lg:-right-4 lg:hover:cursor-pointer lg:top-1/2 lg:-translate-y-1/2 h-full bg-gradient-to-l from-card to-transparent flex items-center transition-opacity duration-200"
            style={{
              visibility:
                scrollPosition >=
                (containerRef.current?.scrollWidth ?? 0) -
                  (containerRef.current?.clientWidth ?? 0) -
                  10
                  ? 'hidden'
                  : 'visible',
            }}
          >
            <ChevronRight
              className="text-3xl text-foreground w-6 h-6"
              onClick={() => {
                containerRef.current?.scrollTo({
                  left: containerRef.current?.scrollWidth ?? 0,
                  behavior: 'smooth',
                });
                setScrollPosition(containerRef.current?.scrollLeft ?? 0);
              }}
            />
          </div>
        </section>
      )}
    </SectionWrapper>
  );
};

export default SwimlaneSection;
