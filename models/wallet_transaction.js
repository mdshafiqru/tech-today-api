const mongoose = require('mongoose');

const WalletTransactionSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },

    trxType: {
        type: String,
        enum: ['send', 'withdraw', 'payment', 'topup', 'dc_in', 'transfer', 'mobile_recharge'],
    },

    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        default: 0,
    },

    trxId:{
        type: String, 
    },
   
}, { timestamps: true });

const WalletTransaction = new mongoose.model("WalletTransaction", WalletTransactionSchema);

module.exports = WalletTransaction;