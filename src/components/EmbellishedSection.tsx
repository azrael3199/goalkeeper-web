import { cn } from '@root/lib/utils/utils';
import { Separator } from './ui/separator';

interface EmbellishedSectionProps {
  id?: string;
  title: string;
  className?: string;
  children?: React.ReactNode;
  slotProps?: {
    title?: React.ComponentPropsWithoutRef<'h2'>;
    separator?: React.ComponentPropsWithoutRef<'div'>;
    children?: React.ComponentPropsWithoutRef<'div'>;
  };
}

const EmbellishedSection = ({
  id,
  title,
  className,
  children,
  slotProps,
}: EmbellishedSectionProps) => (
  <section id={id} className={cn('p-2 w-full', className)}>
    <h2 className={cn('text-xl font-semibold', slotProps?.title?.className)}>
      {title}
    </h2>
    <Separator className={cn('my-2', slotProps?.separator?.className)} />
    <div className={cn('md:p-3', slotProps?.children?.className)}>
      {children}
    </div>
  </section>
);

export default EmbellishedSection;
