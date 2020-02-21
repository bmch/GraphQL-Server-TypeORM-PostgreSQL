import { IResolvers } from 'graphql-tools';
import * as bcrypt from 'bcryptjs';

import { User } from './entity/User';
import { Bet } from './entity/Bet';
import { signToken } from './utils/authToken';

export const resolvers: IResolvers = {
  // check if postgres models being returned need to be
  // amended and trimed (e.g. remove password and meta data ) before being sent

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

      // we don't want to return meta data and password?
      return user;
    },
    login: async (_, { email, password }, { req }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Could not find your account');
      }

      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error(
          'Wrong password. Try again or click Forgot password to reset it'
        );
      }

      const token = signToken({ userId: user.id, email: user.email });
      return {
        userId: user.id,
        token: token,
        tokenExpiration: 1
      };
    },
    createBet: async (_, { data }, { req }) => {
      if (!req.currentUser) {
        throw new Error('userid in auth token not found');
      }

      const user = await User.findOne(req.currentUser);
      if (!user) {
        throw new Error('no user exists with id found in auth payload');
      }

      const bet = Bet.create({
        goal: data.goal,
        description: data.description,
        endDate: data.endDate,
        isPublished: data.isPublished,
        ownerId: user.id
      }).save();

      return bet;
    }
  },
  User: {
    bets: async parent => {
      return await Bet.find({ ownerId: parent.id });
    }
  },
  Bet: {
    owner: async parent => {
      const foundUser = await User.findOne(parent.ownerId);
      return foundUser;
    }
  }
};
