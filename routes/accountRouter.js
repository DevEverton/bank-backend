const express = require("express");
const accountModel = require("../model/account.js");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const accounts = await accountModel.find({});
    res.send(accounts);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
