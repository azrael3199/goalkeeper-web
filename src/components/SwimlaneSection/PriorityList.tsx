import { Task } from '@root/lib/redux/reducers/tasksReducer';
import PriorityGrouping from './PriorityGrouping';

type PriorityListProps = {
  data: {
    title: 'High' | 'Medium' | 'Low';
    tasks: Task[];
  }[];
};

const PriorityList = ({ data }: PriorityListProps) => (
  <section className="p-2 py-1 flex flex-col gap-3">
    {data.map(({ title, tasks }) => {
      if (tasks.length === 0) return null;
      return <PriorityGrouping key={title} title={title} data={tasks} />;
    })}
  </section>
);

export default PriorityList;
