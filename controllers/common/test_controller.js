const _ = require('lodash');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const WalletTransaction = require('../../models/wallet_transaction');
const User = require('../../models/user');
const Wallet = require('../../models/wallet');
const { user } = require('./auth_controller');

const createTestTransactions = async (req, res) => {
    try {

        res.status(200).json({message: 'request submitted', success: true});

        return await handleCreate();

    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}

function getUserID() {
    const users = ["6442130dd5600e2302869c97", "64425583fc36d761d85614ad", "644255cf9a4f26aff45c285b", "644255eb4341f46482ed593c"];
    const index = Math.floor(Math.random() * users.length);
    const user = users[index];
    return user;
}

function getTrxType(trxTypes) {
    const index = Math.floor(Math.random() * trxTypes.length);
    const trxType = trxTypes[index];
    return trxType;
}

function getAmount() {
    return Math.floor(Math.random() * (10000 - 10)) + 10;
}

async function handleCreate(){

    try {

        
        const trxTypes = ['send', 'withdraw', 'payment', 'topup', 'dc_in', 'transfer', 'mobile_recharge'];
        

        const startTime = new Date();
        console.log(`start time ${startTime.toString()}`);

        let count = 1;

        while (count <= 54300) {
            let user = getUserID();
            let trxType = getTrxType(trxTypes);
            let amount = getAmount();

            const trxData = { user, trxType, amount };

            await createTransaction(trxData);
            // await new Promise((resolve) => setTimeout(resolve, 2));

            count++;
        }

        const finishTime = new Date();
        console.log(`finish time ${finishTime.toString()}`);

    } catch (error) {
        console.log(`error: ${error.message}`);
        return error.message;
    }

}

const createSingleTransaction = async (req, res) => {
    try {

        
        const trxTypes = ['send', 'withdraw', 'payment', 'topup', 'dc_in', 'transfer', 'mobile_recharge'];
        

        let user = getUserID();
        let trxType = getTrxType(trxTypes);
        let amount = getAmount();

        const trxData = { user, trxType, amount };

        const startTime = new Date().toISOString();
        console.log(`start time ${startTime.toString()}`);

        const transaction = await createTransaction(trxData);

        const finishTime = new Date().toISOString();
        console.log(`finish time ${finishTime.toString()}`);

        return res.status(200).json({message: 'transaction created', success: true, transaction});

    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}

const createWallets = async (req, res) => {
    try {

        const users = await User.find();

        let count = 0;
       
        for (const user of users) {
            await Wallet.create({user: user.id});
            count++;
        }

        return res.status(200).json({message: `${count} wallets created`, success: true});

    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}

const createUsers = async (req, res) => {
    try {

        res.status(200).json({message: 'user create request submitted', success: true});

        return await handleCreateUser();

    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}

async function handleCreateUser(){

    try {

        let i = 1;

        const startTime = new Date().toISOString();
        console.log(`start time ${startTime.toString()}`);

        while (i <= 17500) {
            await generateUser();
            // await new Promise((resolve) => setTimeout(resolve, 2));
            i++;
        }

        const finishTime = new Date().toISOString();
        console.log(`finish time ${finishTime.toString()}`);

    } catch (error) {
        console.log(error.message);
        return error.message;
    }
}

  
async function generateUser() {

    try {

        const allowedCharacters = 'abcdefghijmnpqrstwxyz123456789';
        const userName = _.shuffle(allowedCharacters).join('').substring(0, 12);

        const emailProviders = ['gmail.com', 'yahoo.com', 'yandex.com', 'outlook.com', 'techtoday.com'];

        const index = Math.floor(Math.random() * emailProviders.length);
        const emailExt = emailProviders[index];

        let email = `${userName}@${emailExt}`;
    
        const existingUser = await User.findOne({email});
    
        if(existingUser){
            await new Promise((resolve) => setTimeout(resolve, 2));
            generateUser();
        } else {

            const salt = bcrypt.genSaltSync(10);
            let password = bcrypt.hashSync("123456", salt);
            
            const user = await User.create({name: userName, email, password});
            const amount = getAmount();

            await Wallet.create({user: user._id, balance: amount});

            return true;
        }
        
    } catch (error) {
        return error.message;
    }
}

async function createTransaction(trxData) {

    try {

        const allowedCharacters = 'ABCDEFGHJLMNPQRSTWXYZabcdefghijmnpqrstwxyz123456789';
        const trxId = _.shuffle(allowedCharacters).join('').substring(0, 12);
    
        const transaction = await WalletTransaction.findOne({trxId});
    
        if(transaction){
            await new Promise((resolve) => setTimeout(resolve, 2));
            createTransaction(trxData);
        } else {
            trxData.trxId = trxId;
            const transaction = await WalletTransaction.create(trxData);
            return transaction;
        }
        
    } catch (error) {
        return error.message;
    }
}


const sendBalanceToWallet = async (req, res) => {
    try {

        const {user, amount} = req.body;


        const startTime = new Date().toISOString();
        console.log(`start time ${startTime.toString()}`);
        
        const wallet = await Wallet.findOne({user});
        
        const searchTime = new Date().toISOString();
        console.log(`search time ${searchTime.toString()}`);

        wallet.balance = wallet.balance + parseFloat(amount);
        await wallet.save();

        const endTime = new Date().toISOString();
        console.log(`end time ${endTime.toString()}`);

        res.status(200).json({message: 'wallet updated', success: true, wallet});

        return await handleCreateUser();

    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}

const getLatestTransactions = async (req, res) => {

    try {

        const {skip} = req.body; 

        const pipeline = [
            {
              $match: { user:  new mongoose.Types.ObjectId(req.userId)}
            },
            {
                $lookup: {
                  from: "users",
                  localField: "user",
                  foreignField: "_id",
                  as: "userData"
                }
            },
            {
              $sort: { createdAt: -1 }
            },
            {
              $skip: skip ?? 0
            },
            {
              $limit: 10 // Limit the result to the latest 10 transactions (adjust as needed).
            },

            {
                $project: {
                  id: 1,
                  trxType: 1,
                  amount: 1,
                  trxId: 1,
                  createdAt: 1,
                  user: 1,
                  userData: {
                    name: { $arrayElemAt: ["$userData.name", 0] },
                    email: { $arrayElemAt: ["$userData.email", 0] },
                    avatar: { $arrayElemAt: ["$userData.avatar", 0] },
                  }
                }
            }
        ];

        const result = await WalletTransaction.aggregate(pipeline).exec();

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}


const getTrxSummary = async (req, res) => {

    try {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const secondLastMonth = new Date(today);
        secondLastMonth.setMonth(today.getMonth() - 2);

        const startOf2ndLastMonth = new Date(secondLastMonth.getFullYear(), secondLastMonth.getMonth(), 1);

        const endOfCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

        const pipeline = [
            {
              $match: {
                user: new mongoose.Types.ObjectId(req.userId),
                createdAt: { $gte: startOf2ndLastMonth, $lt: endOfCurrentMonth },
              },
            },
           
            {
                $sort : { createdAt: 1 }
            },
           
            {
                $group: {
                    _id: {
                        month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
                    },
                    transactions: {
                        $push: {
                        trxType: "$trxType",
                        count: 1,
                        total: "$amount" 
                        }
                    },
                    start_amount: { $first: "$amount" }, // First balance in the group (first transaction of the month)
                    end_amount: { $last: "$amount" } // Last balance in the group (last transaction of the month)
                }
            },

            {
                $unwind: "$transactions" // Unwind the transactions array to prepare for the next grouping
            },

            {
                $group:  {
                    _id: {
                      // year: "$_id.year",
                      month: "$_id.month",
                      trxType: "$transactions.trxType"
                    },
                    start_amount: { $first: "$start_amount" },
                    end_amount: { $last: "$end_amount" },
                    count: { $sum: "$transactions.count" }, // Count of transactions for each trxType
                    total: { $sum: "$transactions.total" } // Total amount for each trxType
                }
            },

            {
                $group: {
                    _id: {
                      // year: "$_id.year",
                      month: "$_id.month"
                    },
                    start_amount: { $first: "$start_amount" },
                    end_amount: { $last: "$end_amount" },
                    transactions: {
                      $push: {
                        trxType: "$_id.trxType",
                        count: "$count",
                        total: "$total"
                      }
                    }
                }
            },

            {
                $sort : { _id: -1 }
            },

            {
                $project: {
                    _id: 1,
                    start_amount: 1,
                    end_amount: 1,
                    transactions: 1,
                },
            },

            
          ];

        const result = await WalletTransaction.aggregate(pipeline).exec();

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}



const checkSkip = async (req, res)=> {

    try {

        const skip = req.params.skip;

        if(skip){
            const skipInt = parseInt(skip, 10);
            
            if (isNaN(skipInt)) {
                return res.status(400).json({message: "skip should be a number", success: false});
            }
            const limit = 10;

           
            return res.status(200).json({skip, limit});

        } else {
            return res.status(400).json({message: "Unknown query parameter used", success: false});
        }

    } catch (error) {
        return res.status(500).json({message: error.message, success: false});
    }
}


module.exports = {
    checkSkip,
    getTrxSummary,
    getLatestTransactions,
    sendBalanceToWallet,
    createUsers,
    createWallets,
    createTestTransactions,
    createSingleTransaction,
}