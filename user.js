const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    username:{ type: String,},
    child: [{ type: Number }],
    earngametap: { type: Number},
    claimgametap: { type: Number  },
    earngamespin:{ type: Number },
    claimgamespin:{ type: Number }
  }
);

module.exports = mongoose.model("User", userSchema, "user");
