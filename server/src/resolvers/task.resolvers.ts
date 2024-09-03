/* eslint-disable max-len */
import { Context } from '../common';
import { db } from '../utils/firebase';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TaskParent {
  // Add properties here if needed
}

interface TaskArgs {
  id: string;
}

interface CreateTaskArgs {
  title: string;
  description: string;
  parentId: string | null;
  priority: number | null;
  hoursRequired: number | null;
  status: string;
}

interface UpdateTaskArgs {
  id: string;
  title?: string;
  description?: string;
  priority?: number | null;
  hoursRequired?: number | null;
  hoursSpent?: number | null;
  status?: string;
}

interface DeleteTaskArgs {
  id: string;
}

const taskResolvers = {
  Query: {
    /**
     * Retrieves a list of tasks for the currently authenticated user.
     *
     * @param {TaskParent} _parent - The parent object (not used in this function)
     * @param {object} _args - The function arguments (not used in this function)
     * @param {Context} context - The context object containing the user's ID
     * @return {Promise<any>} A promise resolving to a list of tasks for the user
     */
    tasks: async (
      _parent: TaskParent,
      _args: object,
      context: Context
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> => {
      const userId = context.user.id; // Assuming user ID is in the context
      return db.collection('tasks').where('userId', '==', userId).get();
    },
    /**
     * Retrieves a task for the currently authenticated user by task ID.
     *
     * @param {_parent} TaskParent - The parent object (not used in this function)
     * @param {args} TaskArgs - The function arguments containing the task ID
     * @param {context} Context - The context object containing the user's ID
     * @return {Promise<any>} A promise resolving to the task data
     */
    task: async (
      _parent: TaskParent,
      args: TaskArgs,
      context: Context
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> => {
      const userId = context.user.id;
      return db
        .collection('tasks')
        .where('userId', '==', userId)
        .where('id', '==', args.id)
        .get();
    },
  },
  Mutation: {
    /**
     * Creates a new task for the currently authenticated user.
     *
     * @param {_parent} TaskParent - The parent object (not used in this function)
     * @param {CreateTaskArgs} args - The function arguments containing the task details
     * @param {Context} context - The context object containing the user's ID
     * @return {Promise<any>} A promise resolving to the newly created task
     */
    createTask: async (
      _parent: TaskParent,
      args: CreateTaskArgs,
      context: Context
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> => {
      const userId = context.user.id;
      const newTask = {
        ...args,
        userId,
      };
      return db.collection('tasks').add(newTask);
    },
    /**
     * Updates a task in the database.
     *
     * @param {TaskParent} _parent - The parent object (not used in this function)
     * @param {UpdateTaskArgs} args - The function arguments containing the task details
     * @param {Context} context - The context object containing the user's ID
     * @return {Promise<FirebaseFirestore.WriteResult>} A promise resolving to the result of the update operation
     */
    updateTask: async (
      _parent: TaskParent,
      args: UpdateTaskArgs,
      context: Context
    ): Promise<FirebaseFirestore.WriteResult> => {
      const userId = context.user.id;
      return db
        .collection('tasks')
        .doc(args.id)
        .update({ ...args, userId });
    },
    /**
     * Deletes a task from the database.
     *
     * @param {TaskParent} _parent - The parent object (not used in this function)
     * @param {DeleteTaskArgs} args - The function arguments containing the task ID
     * @return {Promise<FirebaseFirestore.WriteResult>} A promise resolving to the result of the delete operation
     */
    deleteTask: async (
      _parent: TaskParent,
      args: DeleteTaskArgs
    ): Promise<FirebaseFirestore.WriteResult> =>
      db.collection('tasks').doc(args.id).delete(),
  },
};

export default taskResolvers;
