
const user = require('./user')
const express = require('express');
const router = express.Router();



router.get('/gamelogintap/:gameid', async (req, res) => {
    try {
        let gameid = req.params.gameid;

        let gameiddata = await user.findOne({ id: gameid });
        console.log("gameiddata",gameiddata)
        if (gameiddata) {
            gameiddata={
                id:gameiddata.id,
                boster:gameiddata.child.length,
                earngametap:gameiddata.earngametap,
                claimgametap:gameiddata.claimgametap,
                referrallink:'https://t.me/fufitestcoin_bot'+(gameiddata.id)
            }
            res.status(200).send({ status: true, result: gameiddata,});
        } else {
            res.status(200).send({ status: false, result: `user not registered plase click this link ${`https://t.me/fufitestcoin_bot`} and get your login game id  ` });

        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, result: "Error" });
    }
});

router.get('/storetapdata/:gameid/:count', async (req, res) => {
    let gameid = req.params.gameid;
    let count= req.params.count;
    try {
        let data = await user.updateOne(
            { id: gameid },
            {
                $inc: { earngametap: count }
            }
        );
        res.status(200).send({ status: true, result: 'success' });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(200).send({ status: false, result: 'failed' });

    }


})

router.get('/claimtapreward/:gameid', async (req, res) => {
    let gameid = req.params.gameid;
    try {

        const gameiddata = await user.findOne({ id: gameid })
        console.log(gameiddata.earngametap)
        if(gameiddata.earngametap){
            let data = await user.updateOne(
                { id: gameid },
                {
                    $inc: { claimgametap: gameiddata.earngametap },
                    $set: { earngametap: 0 }
                    
                }
            );
            res.status(200).send({ status: true, result: 'success' });
        }else{
            res.status(200).send({ status: false, result: 'failed' });
        }
      
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(200).send({ status: false, result: 'failed' });

    }


})

router.get('/gameloginspin/:gameid', async (req, res) => {
    try {
        let gameid = req.params.gameid;

        const gameiddata = await user.findOne({ id: gameid }).select('earngamespin claimgamespin');

        if (gameiddata) {
            res.status(200).send({ status: true, result: gameiddata });
        } else {
            res.status(200).send({ status: false, result: `user not registered plase click this link ${`https://t.me/fufitestcoin_bot`} and get your login game id  ` });

        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, result: "Error" });
    }
});
router.get('/storespindata/:gameid/:count', async (req, res) => {
    let gameid = req.params.gameid;
    let count= req.params.count;
    try {
        let data = await user.updateOne(
            { id: gameid },
            {
                $inc: { earngamespin: count }
            }
        );
        res.status(200).send({ status: true, result: 'success' });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(200).send({ status: false, result: 'failed' });

    }


})


module.exports = router;
