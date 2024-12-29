/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { cn } from '@root/lib/utils/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Calendar } from './calendar';
import { ScrollArea, ScrollBar } from './scroll-area';

interface DateTimePickerProps {
  selectedDateTime: string;
  onChange: (date: string) => void;
  hours?: number[];
  containerId?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selectedDateTime,
  onChange,
  hours = Array.from({ length: 24 }, (_, i) => i),
  containerId,
}) => {
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  const handleTimeChange = (
    currentDateTime: string,
    unit: 'hour' | 'minute' | 'ampm',
    value: number | string
  ) => {
    const date = new Date(currentDateTime || new Date());

    if (unit === 'hour') {
      date.setHours(value as number);
    } else if (unit === 'minute') {
      date.setMinutes(value as number);
    } else if (unit === 'ampm') {
      const hours = date.getHours();
      date.setHours(
        value === 'PM'
          ? hours < 12
            ? hours + 12
            : hours
          : hours >= 12
          ? hours - 12
          : hours
      );
    }

    return date.toISOString();
  };

  return (
    <Popover open={isDatePickerOpen} onOpenChange={setDatePickerOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'w-fit text-left font-normal cursor-pointer border border-border flex rounded-md px-3 py-2 flex items-center justify-between text-sm',
            !selectedDateTime && 'text-muted-foreground'
          )}
        >
          {selectedDateTime ? (
            <span className="whitespace-nowrap mr-3">
              {format(new Date(selectedDateTime), 'PPP hh:mm a')}
            </span>
          ) : (
            <span className="whitespace-nowrap mr-3">Pick a Date & Time</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start"
        container={document.getElementById(containerId ?? 'root')}
      >
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={new Date(selectedDateTime)}
            onSelect={(day) => {
              const newDate = day?.toISOString();
              onChange(newDate || new Date().toISOString());
            }}
            initialFocus
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      selectedDateTime &&
                      new Date(selectedDateTime).getHours() % 12 === hour % 12
                        ? 'default'
                        : 'ghost'
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => {
                      const newDate = handleTimeChange(
                        selectedDateTime,
                        'hour',
                        hour
                      );
                      onChange(newDate);
                    }}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      selectedDateTime &&
                      new Date(selectedDateTime).getMinutes() === minute
                        ? 'default'
                        : 'ghost'
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => {
                      const newDate = handleTimeChange(
                        selectedDateTime,
                        'minute',
                        minute
                      );
                      onChange(newDate);
                    }}
                  >
                    {minute}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="">
              <div className="flex sm:flex-col p-2">
                {['AM', 'PM'].map((ampm) => (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={
                      selectedDateTime &&
                      ((ampm === 'AM' &&
                        new Date(selectedDateTime).getHours() < 12) ||
                        (ampm === 'PM' &&
                          new Date(selectedDateTime).getHours() >= 12))
                        ? 'default'
                        : 'ghost'
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => {
                      const newDate = handleTimeChange(
                        selectedDateTime,
                        'ampm',
                        ampm
                      );
                      onChange(newDate);
                    }}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateTimePicker;
