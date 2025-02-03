/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useAppDispatch } from '@root/lib/redux/store';
import { updateTask } from '@root/lib/redux/reducers/tasksReducer';
import { Task } from '@root/lib/types/common';
import React from 'react';
import { PopoverContent } from '../ui/popover';

interface CardActionsProps {
  data: Task;
}

const CardActions: React.FC<CardActionsProps> = ({ data }) => {
  const dispatch = useAppDispatch();

  return (
    <PopoverContent sideOffset={5} className="p-0 w-fit">
      <ul id="task-actions" className="p-1 text-xs">
        <li
          className="cursor-pointer hover:bg-secondary p-2 rounded-md"
          onClick={() => dispatch(updateTask({ ...data, status: 'DONE' }))}
        >
          Mark as done
        </li>
      </ul>
    </PopoverContent>
  );
};

export default CardActions;
