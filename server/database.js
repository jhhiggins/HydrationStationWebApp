import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://MongoCompass:D1vers10n@cluster0.svy4qvm.mongodb.net/';
const MONGODB_DB_NAME = 'hydrationstation';

/** A class representing a database to store scores */
class Database {
  constructor() {
    this.client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    this.collectionName = 'users';
  }

  async getCollection() {
    const db = this.client.db(MONGODB_DB_NAME);
    return db.collection(this.collectionName);
  }

  //create new user
  async createUser(username, password, totalRefills, bottleSize, waterCount, bottleSaved) {
    const collection = await this.getCollection();
    const user = {
        username,
        password,
        totalRefills: totalRefills !== undefined ? totalRefills : 0,
        bottleSize: bottleSize !== undefined ? bottleSize : 16,
        waterCount: waterCount !== undefined ? waterCount : 0,
        bottleSaved: bottleSaved !== undefined ? bottleSaved : 0,
      };
  
      await collection.insertOne(user);
  }

  async getUser(username, password) {
    const collection = await this.getCollection();
    try {
        const user = await collection.findOne({username: username, password: password});

        //check if user is found
        if(user) {
            console.log('user found');
            return user;
        } else {
            console.log('no user found');
            return null
        }
    } catch (err) {
        console.log(err);
        return null;
    }
  }

  async updateUser(username, password, totalRefills, bottleSize, waterCount, bottleSaved) {
    const collection = await this.getCollection();
    try {
        const res = await collection.updateOne(
            {username: username, password: password},
            {$set: {
                totalRefills: totalRefills,
                bottleSize: bottleSize,
                waterCount: waterCount,
                bottleSaved: bottleSaved
            }}
        );
    
        //check if update was successful
        if (res.modifiedCount === 1) {
            console.log('user updated successfully');
        } else {
            console.log('user update failed!!!');
        }
    } catch (err) {
        console.log(err);
    }
  }

  async deleteUser(username, password) {
    const collection = await this.getCollection();
    try {
        const res = await collection.deleteOne({ username: username, password: password });

        //check if delete was successful
        if (res.deletedCount === 1) {
            console.log('user deleted successfully');
        } else {
            console.log('user delete failed!!!');
        }
    } catch (err) {
        console.log(err);
    }
  }

}

const database = new Database();

export { database };