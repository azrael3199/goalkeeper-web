import React from 'react';
import { Edit2 } from 'lucide-react';
import { Task } from '@root/lib/types/common';
import { goalData } from '@root/lib/utils/dummies';
import { getContrastForColorInBW } from '@root/lib/utils/utils';
import { DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';

interface TaskDialogProps {
  id: string;
  data: Task;
  isEditing?: boolean;
}

const TaskDialog = ({ id, data, isEditing = true }: TaskDialogProps) => (
  <>
    <DialogHeader>
      <DialogTitle>{isEditing ? 'Edit' : 'Create'} task</DialogTitle>
      {/* <DialogDescription>
        {isEditing ? 'Edit' : 'Create'} {isEditing ? '' : 'new'} task
      </DialogDescription> */}
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Task Name
        </Label>
        <Input id="name" value={data.title} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="username" className="text-right">
          Description
        </Label>
        <Input id="username" value={data.description} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="parent" className="text-right">
          Parent Goal
        </Label>
        <div className="col-span-3 flex items-center gap-3">
          <Badge
            className="min-h-6 max-w-full px-2"
            style={{
              backgroundColor: goalData.find(
                (goal) => goal.id === data.parentId
              )?.overlayColor,
              color: getContrastForColorInBW(
                goalData.find((goal) => goal.id === data.parentId)
                  ?.overlayColor || '#FFFFFF'
              ),
            }}
          >
            <div className="!truncate">
              {goalData.find((goal) => goal.id === data.parentId)?.title}
            </div>
          </Badge>
          <Button variant="ghost" className="p-0 hover:bg-transparent">
            <Edit2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
    <DialogFooter>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </>
);

export default TaskDialog;
