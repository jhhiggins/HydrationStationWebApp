// const express = require('express');
// const logger = require('morgan');
// const path = require('path');
// const database = require('./database')
import { database } from './database.js';
import express from 'express';
import logger from 'morgan';
import path from 'path';

const app = express();
const port = 3000;

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use('/', express.static('client'));

//endpoint for creating a user
app.post('/createUser', async (req, res) => {
  const { username, password, totalRefills, bottleSize, waterCount, bottleSaved } = req.body;
  try {
    await database.createUser(username, password, totalRefills, bottleSize, waterCount, bottleSaved);
    res.status(200).json({status: 'success'});
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/loginUser', async (req, res) => {
  const { username, password } = req.query;
  try {
    const user = await database.getUser(username, password);
    if (user) {
      res.status(200).json({ status: 'success', user });
    } else {
      res.status(404).json({ status: 'failure', message: 'User not found' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/usernameCheck', async (req, res) => {
  const { username, password } = req.query;
  try {
    const user = await database.getUser(username, password);
    if (!user) {
      res.status(200).json({ status: 'success', user });
    } else {
      res.status(404).json({ status: 'failure', message: 'Username Taken' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//endpoint for updating a users values on refill
app.post('/userUpdate', async (req, res) => {
  const { username, password, totalRefills, bottleSize, waterCount, bottleSaved } = req.body;
  try {
    await database.updateUser(username, password, totalRefills, bottleSize, waterCount, bottleSaved);
    res.status(200).json({status: 'success'});
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete('/deleteUser', async (req, res) => {
  const { username, password } = req.body;
  try {
    await database.deleteUser(username, password);
    res.status(200).json({status: 'success'});
  } catch (err) {
    res.status(500).send(err);
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});