import { IdTokenResult, User } from 'firebase/auth';
import { Task } from '../redux/reducers/tasksReducer';
import { Goal } from '../types/common';

// TODO: Use later
// eslint-disable-next-line import/prefer-default-export
export const dummyUser: User = {
  displayName: "Mike O'Hearn",
  emailVerified: true,
  email: 'mikeyohearn@gmail.com',
  phoneNumber: '+1-202-555-0131',
  refreshToken: 'refresh-token',
  isAnonymous: false,
  metadata: {},
  providerData: [],
  tenantId: null,
  delete(): Promise<void> {
    throw new Error('Function not implemented.');
  },
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  getIdToken(forceRefresh?: boolean | undefined): Promise<string> {
    throw new Error('Function not implemented.');
  },
  getIdTokenResult(
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    forceRefresh?: boolean | undefined
  ): Promise<IdTokenResult> {
    throw new Error('Function not implemented.');
  },
  reload(): Promise<void> {
    throw new Error('Function not implemented.');
  },
  toJSON(): object {
    throw new Error('Function not implemented.');
  },
  photoURL:
    'https://cdn.shopify.com/s/files/1/1957/2713/files/tile-partner-mike-titan-ohearn_150x.png?v=1655998083',
  providerId: 'some-provider-id',
  uid: 'some-uid',
};

export const taskData: Task[] = [
  {
    id: '1',
    title: 'Run 5 miles',
    description: 'Go out to run 5 miles',
    parentId: '3',
    priority: 1,
    hoursRequired: 3,
    hoursSpent: 2,
    status: 'TODO',
  },
  {
    id: '2',
    title: 'Clean 10 dishes',
    description: 'Clean 10 dishes',
    parentId: '4',
    priority: 4,
    hoursRequired: 3,
    hoursSpent: 2,
    status: 'TODO',
  },
  {
    id: '5',
    title: 'Do the laundry',
    description: 'Do the laundry',
    parentId: '2',
    priority: 5,
    hoursRequired: 3,
    hoursSpent: 2,
    status: 'TODO',
  },
  {
    id: '3',
    title: 'Read a book',
    description: 'Read 15 pages',
    parentId: '1',
    priority: 3,
    hoursRequired: 3,
    hoursSpent: 2,
    status: 'IN_PROGRESS',
  },
  {
    id: '4',
    title: 'Meditate',
    description: 'Meditate for 10 minutes',
    parentId: '5',
    priority: 2,
    hoursRequired: 3,
    hoursSpent: 2,
    status: 'DONE',
  },
];

export const goalData: Goal[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'Run a Marathon',
    description: 'Train to complete a full marathon within the next 12 months.',
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
    description: 'Expand knowledge by reading 50 books over the next year.',
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
    description: 'Achieve advanced proficiency in meditation within 18 months.',
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
    description: 'Cultivate a home vegetable garden over the next 6 months.',
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
