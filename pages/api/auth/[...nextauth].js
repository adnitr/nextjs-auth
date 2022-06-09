import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { ConnectToDB } from '../../../lib/db-utils';
import { isMatch } from '../../../lib/auth-utils';

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const { client, collection } = await ConnectToDB();
        const foundUser = await collection.findOne({
          email: credentials.email,
        });
        if (!foundUser) {
          client.close();
          throw new Error('No such user found!');
        }
        const isGenuineUser = isMatch(credentials.password, foundUser.password);

        if (!isGenuineUser) {
          client.close();
          throw new Error('Email or password do not match!');
        }
        client.close();

        return {
          email: foundUser.email,
        };
      },
    }),
  ],
});
