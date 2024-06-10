const mongoose = require("mongoose");

const url = `mongodb://localhost:27017/ecommerce`;

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (true) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(url, {
        maxPoolSize: 100,
      })
      .then(() => {
        console.log(`Mongoose connected successfully!`);
      })
      .catch((err) => console.log(`Error Connected`));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongo = Database.getInstance();

module.exports = instanceMongo;
