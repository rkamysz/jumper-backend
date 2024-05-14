import { ObjectId } from 'mongodb';

export type AccountMongoDocument = {
  _id: ObjectId;
  address: string;
  name: string | null;
};
