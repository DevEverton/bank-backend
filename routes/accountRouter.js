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

router.patch("/:agencia/:conta", async (req, res) => {
  try {
    const { agencia, conta } = req.params;
    const account = await findAccount(accountModel, agencia, conta);
    const updatedAccount = await accountModel.findOneAndUpdate(
      {
        agencia,
        conta,
      },
      {
        balance: account.balance + req.body.deposito,
      },
      { new: true }
    );

    res.send(updatedAccount);
  } catch (err) {
    res.status(500).send(err);
  }
});

const findAccount = async (model, agencia, conta) => {
  try {
    const account = await model.findOne({ agencia, conta });
    if (account) {
      return account;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = router;
