require("dotenv").config();
const Express = require("express");
const app = Express();
const dbConnection = require("./db");
const controllers = require("./controllers");
const middlewares = require("./middleware");

app.use(middlewares.CORS);
app.use(Express.json());

app.use("/users", controllers.User);
app.use("/topics", controllers.Topic);
app.use("/comments", controllers.Comment);
app.use("/tags", controllers.Tag);
app.use("/ratings", controllers.Rating);

dbConnection
  .authenticate()
  .then(() => dbConnection.sync({ alter: true })) //force|alter: true
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`[Server]: App is listening on ${process.env.PORT}.`);
    });
  })
  .catch((err) => {
    console.log(`[Server]: Server crashed due to ${err}`);
  });
