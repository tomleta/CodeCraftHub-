// src/app.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ma-db-test';
console.log('Connecting with URI:', uri);

mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes.js');
app.use('/api/users', userRoutes);

module.exports = app;

