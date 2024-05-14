import { ObjectId } from 'mongodb';

/**
 * Represents an Account document stored in MongoDB.
 *
 * @typedef {Object} AccountMongoDocument
 * @property {ObjectId} _id - The unique identifier for the account document.
 * @property {string} address - The address associated with the account.
 * @property {string | null} name - The name associated with the account, can be null.
 */
export type AccountMongoDocument = {
  _id: ObjectId;
  address: string;
  name: string | null;
};
