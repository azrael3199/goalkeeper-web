import goalResolvers from './goal.resolvers';
import taskResolvers from './task.resolvers';

const resolvers = {
  ...taskResolvers,
  ...goalResolvers,
};

export default resolvers;
