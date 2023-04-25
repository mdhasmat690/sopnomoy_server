const { MongoClient } = require("mongodb");
const connectionString = process.env.ATLAS_URI;

const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

module.exports = {
  connectToServer: async function () {
    try {
      await client.connect();
      console.log("Successfully connected to MongoDB.");
      db = client.db("tools");
    } catch (err) {
      console.error(`Error connecting to MongoDB: ${err}`);
    }
  },

  getDb: function () {
    return db;
  },
};
