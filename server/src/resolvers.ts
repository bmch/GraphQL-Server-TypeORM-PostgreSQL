import { IResolvers } from 'graphql-tools';
import * as bcrypt from 'bcryptjs';

import { User } from './entity/User';
import { Bet } from './entity/Bet';

export const resolvers: IResolvers = {
  Query: {
    users: async (_, { query }) => {
      if (!query) {
        //return  all users
        return await User.find();
      }

      return await User.find({
        where: [
          { firstName: query.toLowerCase() },
          { lastName: query.toLowerCase() }
        ]
      });
    },
    bets: async (_, { query }) => {
      if (!query) {
        return await Bet.find();
      }

      return await Bet.find({
        where: [
          { goal: query.toLowerCase() },
          { description: query.toLowerCase() }
        ]
      });
    }
  },
  Mutation: {
    register: async (_, { data }) => {
      const emailTaken = await User.findOne({ where: { email: data.email } });

      if (emailTaken) {
        throw new Error('E-mail address already in use');
      }

      const hashedPassword = await bcrypt.hash(data.password, 12);

      const user = await User.create({
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName
      }).save();
      console.log('saved user', user);
      // we don't want to return meta data and password?
      return user;
    },
    login: async (_, { email, password }, { req }) => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error('Could not find your account');
      }
      const comparison = await bcrypt.compare(password, user.password);
      if (!comparison) {
        throw new Error(
          'Wrong password. Try again or click Forgot password to reset it'
        );
      }
      req.session.userId = user.id;
      return user;
    },
    createBet: async (_, { data }, { req }) => {
      if (!req.session.userId) {
        throw new Error('session userid not found');
      }
      const user = await User.findOne(req.session.userId);
      if (!user) {
        throw new Error('no user exists with session id');
      }

      const bet = Bet.create({
        goal: data.goal,
        description: data.description,
        endDate: data.endDate,
        isPublished: data.isPublished,
        user: user
      }).save();

      return bet;
    }
  },
  User: {
    bets: async parent => {
      return await Bet.find({ where: { user: parent.id } });
    }
  },
  Bet: {
    creator: async parent => {
      console.log(parent, 'parent user id ');
      return await User.find(parent.user);
    }
  }
};
