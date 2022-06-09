import validator from 'validator';
import {
  ConnectToDB,
  insertDocument,
  findOneDocument,
} from '../../../lib/db-utils';
import { hashPassword } from '../../../lib/auth-utils';

async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    //server-side validations
    if (
      !email ||
      !validator.isEmail(email) ||
      !password ||
      password.trim().length < 7
    ) {
      res.status(422).json({
        message:
          'Provide valid email and password. Password should be atleast 7 characters long.',
      });
      return;
    }

    // try connecting to the database
    let client, collection;
    try {
      const connectionObj = await ConnectToDB();
      client = connectionObj.client;
      collection = connectionObj.collection;
    } catch (err) {
      res.status(500).json({ message: 'Connection to the database failed!' });
      return;
    }

    //finding if an user already exists
    const user = await findOneDocument(collection, { email });
    if (user) {
      res.status(400).json({ message: 'Email already taken!' });
      client.close();
      return;
    }

    //try inserting the document
    try {
      await insertDocument(collection, {
        email,
        password: hashPassword(password),
      });
      res.status(201).json({ message: 'User signedup successfully!' });
    } catch (err) {
      res.status(500).json({ message: 'Inserting to the database failed!' });
    }
    client.close();
  }
}

export default handler;
