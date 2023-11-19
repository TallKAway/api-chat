require("dotenv").config();

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const route = require("./routes");
const http = require("http");
const socket = require('./socket/socketio.js');
const { rabbitMQProducer } = require("./amqp/producer");

dotenv.config();

const PORT = process.env.PORT || 3007;

const api = express();
const server = http.createServer(api);
socket(server);

api.use(express.json());
api.use(express.urlencoded({ extended: true }));
api.use(express.static("public"));
api.use(cors({
  origin: '*'
}));

const ads = [{ Message: `Chat api is running on Port: ${PORT}` }];

api.get("/", (req, res) => {
  res.send(ads);
});
api.get("/socket", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

route(api);

server
  .listen(PORT, async () => {
    console.info(`Listening on port ${PORT}`);
    try {
      await rabbitMQProducer.connect();
      // await rabbitMQProducerApiFormation.connect();
    } catch (error) {
      console.info(`Error while connecting amqp`);
    }
  })
  .setTimeout(50000);

module.exports = api;


