'use client';

import { useParams } from 'next/navigation';

const GoalDetailsPage = () => {
  const { id } = useParams();

  return <div>Goal: {id}</div>;
};

export default GoalDetailsPage;
