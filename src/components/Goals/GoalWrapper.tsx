'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { goalData } from '@root/lib/utils/dummies';
import { Goal } from '@root/lib/types/common';
import GoalCard from './GoalCard';

const GoalWrapper = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Simulate fetching goals from an API
    const fetchGoals = async () => {
      // Replace with actual API call

      setGoals(goalData);
    };

    fetchGoals();
  }, []);

  const handleGoalClick = (goalId: string) => {
    router.push(`/goals/${goalId}`);
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 gap-2 md:gap-4">
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onClick={() => handleGoalClick(goal.id)}
        />
      ))}
    </div>
  );
};

export default GoalWrapper;
