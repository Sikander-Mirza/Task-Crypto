import sequelize from "./Infractructure/db.mjs";
import express from "express"; // import express with a lowercase 'e'

const app = express(); // initialize express correctly

const start = () => {
  const PORT = 9000;

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // Authenticate Sequelize and sync the database
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connected to the database successfully.");

      // Sync the database and create tables if they don't exist
      return sequelize.sync({ alter: true });
    })
    .then(() => {
      console.log("Database & tables created!");
    })
    .catch((err) => {
      console.error("Error connecting to the database or creating tables:", err);
    });
};

export default start;
