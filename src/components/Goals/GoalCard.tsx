import React from 'react';
import { Goal as GoalType } from '@root/lib/types/common';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@root/components/ui/card';
import Image from 'next/image';
import DonutChart from '../Charts/DonutChart';

const PROGRESS_STRINGS = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

const STATUS_COLORS = {
  NOT_STARTED: '#FF450099', // Orange Red
  IN_PROGRESS: '#FFA50099', // Orange
  COMPLETED: '#00800099', // Green
};

const GoalCard: React.FC<{ goal: GoalType }> = ({ goal: goalProp }) => {
  const goal = goalProp;
  const overlayColor = goal.overlayColor || '#000000';

  // Chart Data
  const chartData = [
    { name: 'Hours Spent', value: goal.currentHoursSpent ?? 0 },
    {
      name: 'Hours Remaining',
      value: Math.max(
        (goal.expectedHours ?? 0) - (goal.currentHoursSpent ?? 0),
        0
      ),
    },
  ];

  const totalHours = chartData.reduce((sum, item) => sum + item.value, 0);
  const percentage =
    totalHours > 0
      ? Math.round(((goal.currentHoursSpent ?? 0) / totalHours) * 100)
      : 0;

  return (
    <Card className="cursor-pointer relative h-full w-full rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:shadow-xl hover:scale-[102%]">
      {/* Background Image */}
      {goal.bgImageUrl && (
        <Image
          src={goal.bgImageUrl}
          alt={goal.title || 'Goal Background'}
          className="absolute inset-0 object-cover object-top w-full h-full"
          layout="fill"
        />
      )}
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${overlayColor}80, ${overlayColor}cc)`,
          zIndex: 10,
        }}
      />
      {/* Content */}
      <div className="relative z-20 flex flex-col justify-between h-full text-white">
        {/* Header */}
        <CardHeader className="p-6 bg-gray-900 bg-opacity-50">
          <CardTitle className="text-2xl font-bold mb-1">
            {goal.title ?? 'Untitled Goal'}
          </CardTitle>
          <p className="text-sm italic">{goal.description ?? ''}</p>
        </CardHeader>
        {/* Chart and Compact Details */}
        <CardContent className="p-3 md:px-6 md:py-4 bg-gray-900 bg-opacity-70">
          <div className="flex items-center gap-4">
            {/* Dynamic DonutChart */}
            <DonutChart
              data={chartData}
              label={
                <div className="text-center text-sm font-bold text-white">
                  <p>{percentage}%</p>
                </div>
              }
              colors={['#169E1B', '#D1D5DB']}
              className="w-20 h-20"
              tooltipFormatter={(value, name) => `${name}: ${value} hrs`}
              showPercentages
            />
            {/* Compact Details */}
            <div className="grid grid-cols-1 gap-2 lg:gap-4 lg:grid-cols-2 text-sm grow">
              {/* Status */}
              <p className="flex items-center gap-2 grow">
                <span className="font-medium text-gray-300 flex items-center gap-1">
                  <i className="fas fa-tasks text-green-500" /> Status:
                </span>
                <span
                  className="flex ml-auto items-center bg-opacity-60 rounded-full cursor-default px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-indigo-600 transition-colors"
                  style={{
                    backgroundColor: goal.status
                      ? STATUS_COLORS[goal.status]
                      : '#1A202C99',
                  }}
                >
                  {goal.status ? PROGRESS_STRINGS[goal.status] : 'Not Set'}
                </span>
              </p>

              {/* Expected Completion */}
              <p className="flex items-center gap-2 grow">
                <span className="font-medium text-gray-300 flex items-center gap-1">
                  <i className="fas fa-calendar-alt text-purple-500" /> Expected
                  Completion:
                </span>
                <span className="flex items-center ml-auto rounded-full cursor-default bg-slate-700 bg-opacity-60 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-indigo-600 transition-colors">
                  {goal.expectedCompletionDate
                    ? new Date(goal.expectedCompletionDate).toLocaleDateString(
                        'en-US',
                        {
                          day: '2-digit',
                          month: 'short',
                          year: '2-digit',
                        }
                      )
                    : 'Not Set'}
                </span>
              </p>

              {/* Created On */}
              <p className="flex items-center gap-2 grow">
                <span className="font-medium text-gray-300 flex items-center gap-1">
                  <i className="fas fa-calendar-plus text-yellow-600" /> Created
                  On:
                </span>
                <span className="flex items-center ml-auto cursor-default rounded-full bg-slate-700 bg-opacity-60 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-indigo-600 transition-colors">
                  {goal.createdAt
                    ? new Date(goal.createdAt).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: '2-digit',
                      })
                    : 'Not Set'}
                </span>
              </p>

              {/* Last Updated */}
              <p className="flex items-center gap-2 grow">
                <span className="font-medium text-gray-300 flex items-center gap-1">
                  <i className="fas fa-sync-alt text-red-600" /> Last Updated:
                </span>
                <span className="flex items-center ml-auto rounded-full cursor-default bg-slate-700 bg-opacity-60 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-indigo-600 transition-colors">
                  {goal.updatedAt
                    ? new Date(goal.updatedAt).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: '2-digit',
                      })
                    : 'Not Set'}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default GoalCard;
