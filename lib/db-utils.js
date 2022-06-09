import { MongoClient } from 'mongodb';

// Connection URL
const url = `mongodb+srv://adnitr:adnitr@authcluster.qr5uv.mongodb.net/?retryWrites=true&w=majority`;

export async function ConnectToDB() {
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db('users');
  const collection = db.collection('users');

  return { client, collection };
}

export async function insertDocument(collection, document) {
  await collection.insertOne(document);
}

export async function findOneDocument(collection, document) {
  const existingUser = await collection.findOne(document);
  return existingUser;
}
