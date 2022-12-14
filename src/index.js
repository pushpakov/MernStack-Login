const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/route.js");
const { default: mongoose } = require("mongoose");
const app = express();


app.use(bodyParser.json());


mongoose
.connect(
    "mongodb+srv://pushpak:pushpak1819@radoncluster.opqe2.mongodb.net/loginapi?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch( err => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 5000, function () {
  console.log("Express app running on port " + (process.env.PORT || 5000));
});