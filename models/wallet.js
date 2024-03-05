const mongoose = require('mongoose');

const WalletSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },

    balance: {
        type: Number,
        default: 0,
    },

   
}, { timestamps: true });

const Wallet = new mongoose.model("Wallet", WalletSchema);

module.exports = Wallet;