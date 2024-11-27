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
    <Card className="relative h-full w-full rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
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
          <CardTitle className="text-2xl font-bold mb-2">
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
            <div className="md:grid md:gap-2 grid-cols-2 text-sm">
              <p>
                <span className="font-medium">Status:</span>{' '}
                {goal.status ?? 'Not Set'}
              </p>
              <p>
                <span className="font-medium">Expected Completion:</span>{' '}
                {goal.expectedCompletionDate
                  ? new Date(goal.expectedCompletionDate).toLocaleDateString()
                  : 'Not Set'}
              </p>
              <p>
                <span className="font-medium">Created On:</span>{' '}
                {goal.createdAt
                  ? new Date(goal.createdAt).toLocaleDateString()
                  : 'Not Set'}
              </p>
              <p>
                <span className="font-medium">Last Updated:</span>{' '}
                {goal.updatedAt
                  ? new Date(goal.updatedAt).toLocaleDateString()
                  : 'Not Set'}
              </p>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default GoalCard;
