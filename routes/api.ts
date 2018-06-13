const express = require('express');
export const router = express.Router();

const db = require("../db");

//create
router.post('/players', function(req, res) {
    res.sendStatus(405);
});

//read
router.get('/players', function(req, res) {
    db.any(`select * from player`)
        .then(result =>
        {
            res.send(result);
        });
});

//update
router.put('/players', function(req, res) {
    res.sendStatus(405);
});

//delete
router.delete('/players', function(req, res) {
    res.sendStatus(405);
});

//player id
router.post('/players/:id', function(req, res) {
    res.sendStatus(405);
});

router.get('players/:id', function(req, res)
{
    const id = Number(req.params.id);
    if (isFinite(id) && id  > 0 )
    {
        //look up user
        //if user exists
        res.sendStatus(200);
        //else
        //res.sendStatus(404);
    }
    else
    {
        res.status(400).send({ message: 'invalid number supplied' });
    }
});

router.put('/players/:id', function(req, res) {
    const player = Number(req.params.player);
    const id = Number(req.params.id);
    if (isFinite(id) && id  > 0 )
    {
        db.none(`
update player set 
    name=$<name>, 
    address=$<address>, 
    email=$<email>, 
    telephone=$<telephone>, 
    username=$<username>,
    password=$<password>
where id=$<id>`,
            Object.assign(player, {id}))
            .then(result =>
            {
                res.sendStatus(200);
            })
    }
});

router.delete('/players/:id', function(req, res) {
    const id = Number(req.params.id);
    if (isFinite(id) && id  > 0 )
    {
        db.query(`update player set active = false where id = $1`, id).then(result => {
            if(result.rowCount > 0)
            {
                res.sendStatus(200);
            }
            else
            {
                res.sendStatus(404);
            }
        });
    }
    else
    {
        res.status(400).send({ message: 'invalid number supplied' });
    }
});