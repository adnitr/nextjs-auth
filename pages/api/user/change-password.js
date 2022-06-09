import { getSession } from 'next-auth/client';
import { ConnectToDB, findOneDocument } from '../../../lib/db-utils';
import { isMatch, hashPassword } from '../../../lib/auth-utils';

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return;
  }

  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ message: 'Unauthorized!' });
    return;
  }

  const email = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const { client, collection } = await ConnectToDB();

  const user = await findOneDocument(collection, { email });

  if (!user) {
    res.status(404).json({ message: 'User not found!' });
    client.close();
    return;
  }

  if (!isMatch(oldPassword, user.password)) {
    res.status(400).json({ message: 'Enter the correct password' });
    client.close();
    return;
  }

  if (!newPassword || newPassword.trim() === '' || newPassword.length < 7) {
    res.status(400).json({
      message: 'Enter valid new password - atleast 7 characters long.',
    });
    client.close();
    return;
  }

  await collection.updateOne(
    { email },
    { $set: { password: hashPassword(newPassword) } }
  );

  res.status(200).json({ message: 'password change successful' });
  client.close();
}

export default handler;
