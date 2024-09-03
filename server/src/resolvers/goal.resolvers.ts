import { Context } from '../common';
import { db } from '../utils/firebase';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface GoalParent {
  // Add properties here if needed
}

interface GoalArgs {
  id: string;
}

interface CreateGoalArgs {
  title: string;
  description: string;
  tasks?: string[]; // Array of Task IDs, can be empty or undefined
}

interface UpdateGoalArgs {
  id: string;
  title?: string;
  description?: string;
  tasks?: string[]; // Array of Task IDs, can be empty or undefined
}

interface DeleteGoalArgs {
  id: string;
}

const goalResolvers = {
  Query: {
    /**
     * Retrieves a list of goals for the currently authenticated user.
     */
    goals: async (
      _parent: GoalParent,
      _args: object,
      context: Context
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> => {
      const userId = context.user.id;
      const goalsSnapshot = await db
        .collection('goals')
        .where('userId', '==', userId)
        .get();

      const goals = await Promise.all(
        goalsSnapshot.docs.map(async (doc) => {
          const goal = doc.data();
          if (goal.tasks && goal.tasks.length > 0) {
            const tasksSnapshot = await db
              .collection('tasks')
              .where('id', 'in', goal.tasks)
              .get();
            goal.tasks = tasksSnapshot.docs.map((taskDoc) => taskDoc.data());
          } else {
            goal.tasks = []; // Ensure it's an empty array if no tasks
          }
          return goal;
        })
      );

      return goals;
    },

    /**
     * Retrieves a goal by ID for the currently authenticated user.
     */
    goal: async (
      _parent: GoalParent,
      args: GoalArgs,
      context: Context
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> => {
      const userId = context.user.id;
      const goalSnapshot = await db
        .collection('goals')
        .where('userId', '==', userId)
        .where('id', '==', args.id)
        .get();

      if (goalSnapshot.empty) return null;

      const goal = goalSnapshot.docs[0].data();
      if (goal.tasks && goal.tasks.length > 0) {
        const tasksSnapshot = await db
          .collection('tasks')
          .where('id', 'in', goal.tasks)
          .get();
        goal.tasks = tasksSnapshot.docs.map((taskDoc) => taskDoc.data());
      } else {
        goal.tasks = []; // Ensure it's an empty array if no tasks
      }

      return goal;
    },
  },

  Mutation: {
    /**
     * Creates a new goal for the currently authenticated user.
     */
    createGoal: async (
      _parent: GoalParent,
      args: CreateGoalArgs,
      context: Context
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> => {
      const userId = context.user.id;

      const newGoal = {
        ...args,
        userId,
        tasks: args.tasks || [], // Default to an empty array if no tasks are provided
      };

      const goalDoc = await db.collection('goals').add(newGoal);
      return goalDoc.get();
    },

    /**
     * Updates a goal in the database.
     */
    updateGoal: async (
      _parent: GoalParent,
      args: UpdateGoalArgs,
      context: Context
    ): Promise<FirebaseFirestore.WriteResult> => {
      const userId = context.user.id;

      return db
        .collection('goals')
        .doc(args.id)
        .update({ ...args, userId });
    },

    /**
     * Deletes a goal from the database.
     */
    deleteGoal: async (
      _parent: GoalParent,
      args: DeleteGoalArgs
    ): Promise<FirebaseFirestore.WriteResult> =>
      db.collection('goals').doc(args.id).delete(),
  },
};

export default goalResolvers;
