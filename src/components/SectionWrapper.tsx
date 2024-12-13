import { cn } from '@root/lib/utils/utils';

type Props = {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

const SectionWrapper = ({ title, actions, children, className }: Props) => (
  <div>
    <div
      className={cn(
        'w-full flex justify-between items-center gap-3 p-2 pb-1',
        className
      )}
    >
      <h2>{title}</h2>
      <div className="flex justifty-center items-center p-1 gap-2">
        {actions}
      </div>
    </div>
    {children}
  </div>
);

export default SectionWrapper;
