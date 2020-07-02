const express = require("express");
const app = express();
const accountRouter = require("./routes/accountRouter.js");

app.use(express.json());
app.use("/accounts", accountRouter);

app.listen(5000, async () => {
  try {
    console.log("Api Started!");
  } catch (err) {
    console.log(err);
  }
});
