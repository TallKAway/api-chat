const userRouter = require("./routes/chat.route");

module.exports = (app) => {
  app.use("/chat", userRouter);
};
