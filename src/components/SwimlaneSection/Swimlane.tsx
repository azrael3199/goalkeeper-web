import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@root/components/ui/card';
import { cn } from '@root/lib/utils/utils';

interface SwimlaneProps {
  children: React.ReactNode;
  title: string;
}

const Swimlane: React.FC<
  SwimlaneProps & React.ComponentPropsWithRef<'div'>
> = ({ children, title, ...props }) => (
  <Card
    {...props}
    className={cn(
      'w-full h-full flex flex-col',
      // eslint-disable-next-line react/prop-types
      props.className ?? ''
    )}
  >
    <CardHeader className="p-2">
      <CardTitle className="text-slate-500 text-xs font-semibold">
        {title.toLocaleUpperCase()}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-2 pr-2 flex flex-col items-center gap-2 h-full pb-8">
      {children}
    </CardContent>
  </Card>
);

export default Swimlane;
