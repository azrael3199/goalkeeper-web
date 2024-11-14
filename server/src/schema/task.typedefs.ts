const taskTypeDefs = `#graphql
  type Task {
    id: ID!
    userId: ID!
    title: String
    description: String
    parentId: ID
    priority: Int
    hoursRequired: Int
    hoursSpent: Int
    status: String
  }

  type Query {
    tasks: [Task]
    task(id: ID!): Task
  }

  type Mutation {
    createTask(
      userId: ID!
      title: String
      description: String
      parentId: ID
      priority: Int
      hoursRequired: Int
      status: String
    ): Task
    updateTask(
      id: ID!
      title: String
      description: String
      priority: Int
      hoursRequired: Int
      hoursSpent: Int
      status: String
    ): Task
    deleteTask(id: ID!): Boolean
  }
`;

export default taskTypeDefs;
