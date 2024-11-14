import { Task } from '../redux/reducers/tasksReducer';

export const transformTasksByStatus = (tasks: Task[]) => {
  const groupedTasks: { title: string; tasks: Task[] }[] = [
    {
      title: 'To Do',
      tasks: [],
    },
    {
      title: 'In Progress',
      tasks: [],
    },
    {
      title: 'Done',
      tasks: [],
    },
  ];

  tasks.forEach((task) => {
    if (task.status === 'TODO') {
      groupedTasks[0].tasks.push(task);
    } else if (task.status === 'IN_PROGRESS') {
      groupedTasks[1].tasks.push(task);
    } else if (task.status === 'DONE') {
      groupedTasks[2].tasks.push(task);
    }
  });

  return groupedTasks;
};

export const transformTasksByPriority = (tasks: Task[]) => {
  const groupedTasks: { title: string; tasks: Task[] }[] = [
    {
      title: 'Highest',
      tasks: [],
    },
    {
      title: 'High',
      tasks: [],
    },
    {
      title: 'Medium',
      tasks: [],
    },
    {
      title: 'Low',
      tasks: [],
    },
    {
      title: 'Lowest',
      tasks: [],
    },
  ];

  tasks.forEach((task) => {
    if (task.priority === 1) {
      groupedTasks[0].tasks.push(task);
    } else if (task.priority === 2) {
      groupedTasks[1].tasks.push(task);
    } else if (task.priority === 3) {
      groupedTasks[2].tasks.push(task);
    } else if (task.priority === 4) {
      groupedTasks[3].tasks.push(task);
    } else if (task.priority === 5) {
      groupedTasks[4].tasks.push(task);
    }
  });

  return groupedTasks;
};
