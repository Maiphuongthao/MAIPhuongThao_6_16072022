const mongoose = require(`mongoose`);
const bunyan = require("bunyan");
require("dotenv").config();

//create logger to print error messages of system with bunyan
//"serializer" functions to produce a JSON-able object from a JavaScript object
function serializer(data) {
  let query = JSON.stringify(data.query);
  let options = JSON.stringify(data.options || {});

  return `db.${data.coll}.${data.method}(${query}, ${options});`;
}

let ringbuffer = new bunyan.RingBuffer({
  limit: 100,
}); /* Create a ring buffer that stores the last 100 records. */
let log = bunyan.createLogger({
  name: "MongoDB",
  src: false,
  serializers: {
    dbQuery: serializer,
  },
  streams: [
    {
      stream: process.stderr,
      level: "debug",
    },
    {
      level: "info",
      stream: process.stdout, //standard output
    },
    {
      stream: process.stderr,
      level: "error",
    },
    {
      level: "trace",
      type: "raw", // use 'raw' to get raw log record objects
      stream: ringbuffer,
    },
    {
      type: "rotating-file",
      path: "/var/logs/mongodb.log",
      period: "1d", // daily rotation
      count: 3, // keep 3 back copies
    },
  ],
});

mongoose.set("debug", function (coll, method, query, doc, options) {
  let set = {
    coll: coll,
    method: method,
    query: query,
    doc: doc,
    options: options,
  };

  log.info({
    dbQuery: set,
  });
});

if (!process.env.MONGO_URI) {
  console.log("MONGO_URI not found on .env !");
}
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connection to database established ");
  })
  .catch((error) => {
    console.log("Connection failed" + error);
  });

module.exports = mongoose.connection;
