import { IResolvers } from 'graphql-tools';
import * as bcrypt from 'bcryptjs';

import { User } from './entity/User';

export const resolvers: IResolvers = {
  Query: {
    hello: () => `hello`
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
    }
  }
};
