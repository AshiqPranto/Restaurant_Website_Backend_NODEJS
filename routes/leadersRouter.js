const express = require('express');
const bodyParser = require('body-parser');

const mongoose  = require('mongoose');
const leaders = require('../models/leaders');
const verifyUser = require('../middlewears/verifyUser');
const verifyAdmin = require('../middlewears/verifyAdmin');

const leadersRouter = express.Router();
leadersRouter.use(bodyParser.json());

leadersRouter.route('/')
.get((req, res, next) => {
    leaders.find({})
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    },(err) => next(err))
    .catch((err)=> next(err));
})
.post(verifyUser, verifyAdmin, (req, res, next) => {
    leaders.create(req.body)
    .then((leader) => {
        console.log('leader Created ', leader);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(verifyUser, verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete(verifyUser, verifyAdmin, (req, res, next) => {
    leaders.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

leadersRouter.route('/:leaderId')
.get((req, res, next) => {
    leaders.findById(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(verifyUser, verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leader/' + req.params.leaderId);
})
.put(verifyUser, verifyAdmin, (req, res, next) => {
    leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, { new: true })
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(verifyUser, verifyAdmin, (req, res, next) => {
    leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = leadersRouter;
