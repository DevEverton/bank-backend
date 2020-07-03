const express = require("express");
const accountModel = require("../model/account.js");
const router = express.Router();

//Get all accounts
router.get("/", async (req, res) => {
  try {
    const accounts = await accountModel.find({});
    res.send(accounts);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Deposit endpoint
router.patch("/deposito/:agencia/:conta", async (req, res) => {
  try {
    const { agencia, conta } = req.params;
    const deposit = req.body.deposito;
    const account = await findAccount(accountModel, agencia, conta);
    if (!account) {
      throw "Account not found";
    }
    if (deposit < 0) {
      throw "Cannot deposit a negative value";
    }

    const updatedAccount = await accountModel.findOneAndUpdate(
      {
        agencia,
        conta,
      },
      {
        balance: account.balance + deposit,
      },
      { new: true }
    );
    res.send(updatedAccount);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Withdraw endpoint
router.patch("/saque/:agencia/:conta", async (req, res) => {
  try {
    const { agencia, conta } = req.params;
    const withdraw = req.body.saque;
    const account = await findAccount(accountModel, agencia, conta);
    if (!account) {
      throw "Account not found";
    }
    if (account.balance < withdraw) {
      throw "This account doesn't have enough limit. Please insert another amount and try again.";
    }
    const updatedAccount = await accountModel.findOneAndUpdate(
      {
        agencia,
        conta,
      },
      {
        balance: account.balance - withdraw,
      },
      { new: true }
    );
    res.send(updatedAccount);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Get account balance endpoint
router.get("/saldo/:agencia/:conta", async (req, res) => {
  try {
    const { agencia, conta } = req.params;
    const account = await findAccount(accountModel, agencia, conta);
    if (!account) {
      throw "Account not found";
    }
    res.send({ name: account.name, balance: account.balance });
  } catch (err) {
    res.status(500).send(err);
  }
});

//Delete account endpoint
router.delete("/delete/:agencia/:conta", async (req, res) => {
  try {
    const { agencia, conta } = req.params;
    const account = await accountModel.findOneAndDelete({ agencia, conta });
    const accounts = await accountModel.find({});
    if (!account) {
      throw "Account not found";
    }
    res.send({ activeAccounts: accounts.length });
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
