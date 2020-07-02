const mongoose = require("mongoose");

(async () => {
  try {
    mongoose.connect(
      "mongodb+srv://Everton:mongoBasics@mongobasics.6mbam.mongodb.net/bank?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  } catch (err) {
    console.log("Erro ao conectar ao mongoDB" + err);
  }
})();

const accountSchema = mongoose.Schema({
  agencia: {
    type: Number,
    require: true,
    validate(agencia) {
      if (agencia < 0) throw new Error("Não aceita valores negativos");
    },
  },
  conta: {
    type: Number,
    require: true,
    validate(conta) {
      if (conta < 0) throw new Error("Não aceita valores negativos");
    },
  },
  name: {
    type: String,
    require: true,
    validate(name) {
      if (name < "") throw new Error("Nome não inserido");
    },
  },
  balance: {
    type: Number,
    require: true,
    validate(balance) {
      if (balance < 0) throw new Error("Não aceita valores negativos");
    },
  },
});

mongoose.model("accounts", accountSchema, "accounts");
const account = mongoose.model("accounts");

const accountModel = mongoose.model("accounts", accountSchema, "accounts");

module.exports = accountModel;

//Functions to add json file data to mongodb cluster

// const fs = require("fs").promises;

// const addAccount = (agencia, conta, name, balance) => {
//   new account({
//     agencia,
//     conta,
//     name,
//     balance,
//   })
//     .save()
//     .then(() => {
//       console.log("Documento inserido");
//     })
//     .catch((err) => console.log("Error catched: " + err));
// };

// async function getAccounts() {
//   try {
//     let data = await fs.readFile("./accounts.json", "utf8");
//     let jsonData = JSON.parse(data);
//     jsonData = jsonData.forEach(({ agencia, conta, name, balance }) => {
//       addAccount(agencia, conta, name, balance);
//     });
//   } catch (err) {
//     console.log(err);
//   }
// }
