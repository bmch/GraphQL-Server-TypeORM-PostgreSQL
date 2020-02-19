import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    hello: String!
  }
  type Mutation {
    register(data: CreateUserInput): User!
    login(email: String!, password: String!): User!
    createBet(data: CreateBetInput): Bet!
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
    goal: String!
    description: String!
    createdAt: String!
    updatedAt: String
    endDate: String!
    idPublished: Boolean!
    won: Boolean
    creator: User!
  }
  input CreateUserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }
  input CreateBetInput {
    goal: String!
    description: String!
    endDate: String!
    isPublished: Boolean!
  }
`;
