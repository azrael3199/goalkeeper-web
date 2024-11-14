const goalTypeDefs = `#graphql
   type Goal {
    id: ID!
    userId: ID!
    title: String
    description: String
    tasks: [Task!] # Task list can be empty
  }

  type Query {
    goals: [Goal]
    goal(id: ID!): Goal
  }

  type Mutation {
    createGoal(
      userId: ID!
      title: String
      description: String
      tasks: [ID!]
    ): Goal
    updateGoal(
      id: ID!
      title: String
      description: String
      tasks: [ID!]
    ): Goal
    deleteGoal(id: ID!): Boolean
  }
`;

export default goalTypeDefs;
