const express = require("express");
const accountModel = require("../model/account.js");
const router = express.Router();

//Get all accounts
router.get("/accounts", async (req, res) => {
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

//Tranfer endpoint
router.patch("/transfer/from/:conta1/to/:conta2", async (req, res) => {
  try {
    const fee = 8;
    const amount = req.body.amount;
    const { conta1, conta2 } = req.params;
    const account1 = await accountModel.findOne({ conta: conta1 });
    const account2 = await accountModel.findOne({ conta: conta2 });
    if (!account1 || !account2) {
      throw "Account not found";
    }

    if (account1.agencia !== account2.agencia) {
      if (amount > account1.balance) {
        throw "No sufficient balance to transfer. Insert another amount and try again.";
      }
      const updatedAccount1 = await accountModel.findOneAndUpdate(
        {
          conta: conta1,
        },
        { balance: account1.balance - amount - fee },
        { new: true }
      );
      const updatedAccount2 = await accountModel.findOneAndUpdate(
        {
          conta: conta2,
        },
        { balance: account2.balance + amount },
        { new: true }
      );
      res.send({ account1: updatedAccount1, account2: updatedAccount2 });
    } else {
      if (amount > account1.balance) {
        throw "No sufficient balance to transfer. Insert another amount and try again.";
      }

      const updatedAccount1 = await accountModel.findOneAndUpdate(
        {
          conta: conta1,
        },
        { balance: account1.balance - amount },
        { new: true }
      );
      const updatedAccount2 = await accountModel.findOneAndUpdate(
        {
          conta: conta2,
        },
        { balance: account2.balance + amount },
        { new: true }
      );
      res.send({ account1: updatedAccount1, account2: updatedAccount2 });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//Average on an agency endpoint
router.get("/media/:agencia", async (req, res) => {
  try {
    const agencia = req.params.agencia;
    const accounts = await await accountModel.aggregate([
      { $match: { agencia: parseInt(agencia) } },
      { $group: { _id: { agencia: "$agencia" }, media: { $avg: "$balance" } } },
    ]);
    res.send(accounts);
  } catch (err) {
    res.status(500).send(err);
  }
});

//List of accounts with smaller balances sorted endpoint
router.get("/smallbalances/:size", async (req, res) => {
  try {
    const size = parseInt(req.params.size);
    const accounts = await accountModel.aggregate([
      { $sort: { balance: 1 } },
      { $limit: size },
    ]);

    res.send(
      accounts.map(({ agencia, conta, balance }) => {
        return { agencia, conta, balance };
      })
    );
  } catch (err) {
    res.status(500).send(err);
  }
});

//List of accounts with higher balances sorted endpoint
router.get("/highbalances/:size", async (req, res) => {
  try {
    const size = parseInt(req.params.size);
    const accounts = await accountModel.aggregate([
      { $sort: { balance: -1, name: 1 } },
      { $limit: size },
    ]);

    res.send(
      accounts.map(({ agencia, conta, balance }) => {
        return { agencia, conta, balance };
      })
    );
  } catch (err) {
    res.status(500).send(err);
  }
});

//Private agency endpoint
router.patch("/private", async (req, res) => {
  try {
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
