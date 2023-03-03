const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "backend/config/config.env" });
const connectToDataBase = require("./database");

//uncaught error
process.on("uncaughtException", (error) => {
  console.log(`Server is shutting down due to uncaught error`);
  console.log(`Error:- ${error}`);

  process.exit(1);
});

connectToDataBase();
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});

//unhandled promise rejection
process.on("unhandledRejection", (error) => {
  console.log(`Server is shutting down due to unhandled promise rejection`);
  console.log(`Error:- ${error}`);

  server.close(() => {
    process.exit(1);
  });
});
