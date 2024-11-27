'use client';

import React, { useEffect, useState } from 'react';
import { Goal } from '@root/lib/types/common';
import GoalCard from './GoalCard';

const GoalWrapper = () => {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    // Simulate fetching goals from an API
    const fetchGoals = async () => {
      // Replace with actual API call
      const fetchedGoals: Goal[] = [
        {
          id: '1',
          userId: 'user1',
          title: 'Run a Marathon',
          description:
            'Train to complete a full marathon within the next 12 months.',
          bgImageUrl:
            'https://images.unsplash.com/photo-1524046026319-4a3bce40c999?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
          overlayColor: '#FF4500', // Orange Red
          status: 'IN_PROGRESS',
          expectedCompletionDate: '2024-11-22',
          createdAt: '2023-11-22',
          updatedAt: '2023-11-22',
          currentHoursSpent: 20,
          expectedHours: 200,
        },
        {
          id: '2',
          userId: 'user2',
          title: 'Read 50 Books',
          description:
            'Expand knowledge by reading 50 books over the next year.',
          bgImageUrl:
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
          overlayColor: '#8A2BE2', // Blue Violet
          status: 'NOT_STARTED',
          expectedCompletionDate: '2025-01-01',
          createdAt: '2023-11-22',
          updatedAt: '2023-11-22',
          currentHoursSpent: 0,
          expectedHours: 400,
        },
        {
          id: '3',
          userId: 'user3',
          title: 'Master Meditation',
          description:
            'Achieve advanced proficiency in meditation within 18 months.',
          bgImageUrl:
            'https://images.unsplash.com/photo-1529693662653-9d480530a697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
          overlayColor: '#FFD700', // Gold
          status: 'IN_PROGRESS',
          expectedCompletionDate: '2025-05-22',
          createdAt: '2023-11-01',
          updatedAt: '2023-11-20',
          currentHoursSpent: 100,
          expectedHours: 600,
        },
        {
          id: '4',
          userId: 'user4',
          title: 'Start a Vegetable Garden',
          description:
            'Cultivate a home vegetable garden over the next 6 months.',
          bgImageUrl:
            'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
          overlayColor: '#32CD32', // Lime Green
          status: 'NOT_STARTED',
          expectedCompletionDate: '2024-05-22',
          createdAt: '2023-11-15',
          updatedAt: '2023-11-20',
          currentHoursSpent: 0,
          expectedHours: 50,
        },
        {
          id: '5',
          userId: 'user5',
          title: 'Learn to Play the Guitar',
          description: 'Become proficient in playing the guitar within a year.',
          bgImageUrl:
            'https://images.unsplash.com/photo-1535587566541-97121a128dc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
          overlayColor: '#1E90FF', // Dodger Blue
          status: 'IN_PROGRESS',
          expectedCompletionDate: '2024-11-22',
          createdAt: '2023-06-01',
          updatedAt: '2023-11-21',
          currentHoursSpent: 150,
          expectedHours: 500,
        },
      ];

      setGoals(fetchedGoals);
    };

    fetchGoals();
  }, []);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 gap-2 md:gap-4">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
};

export default GoalWrapper;
