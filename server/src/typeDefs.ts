import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    hello: String!
  }
  type Mutation {
    register(data: CreateUserInput): User!
    login(email: String!, password: String!): User!
  }
  type User {
    id: ID!
    firstName: String!
    lastLame: String!
    email: String!
    bets: [Bet!]!
  }
  type Bet {
    id: ID!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }
  input CreateUserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }
`;
