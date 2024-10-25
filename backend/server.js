import express from 'express';
import path from 'path';
import validator from 'validator';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';

dotenv.config();

const app = express();

app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
});
app.use('/api/', apiLimiter);

app.use(xss());

app.use(express.json());

app.use(cors({
  origin: `http://localhost:${process.env.FRONTEND_PORT || '8080'}`,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  optionsSuccessStatus: 200,
}));


const dbPath = process.env.DB_PATH;
console.log('Database path:', dbPath); 
const connection = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
    return;
  }
  console.log('Connected to SQLite database');
});

app.get('/api/user/:id', (req, res) => {
  const query = `SELECT * FROM users WHERE id = ?`;
  connection.all(query, [req.params.id], (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.post('/api/user/:id/change-email', (req, res) => {
  const newEmail = req.body.email;

  if (!validator.isEmail(newEmail)) {
    return res.status(400).send('Invalid email format');
  }
  if (newEmail.length > 320) {
    return res.status(400).send('Email exceeds maximum length of 320 characters.');
  }

  const query = `UPDATE users SET email = ? WHERE id = ?`;
  connection.run(query, [newEmail, req.params.id], function (err) {
    if (err) throw err;
    if (this.changes === 0) res.status(404).send('User not found');
    else res.status(200).send('Email updated successfully');
  });
});

app.get('/api/file', (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  let fileName = path.basename(req.query.name);
  if (!/^[\w,\s-]+\.[A-Za-z]{3,4}$/.test(fileName)) {
    return res.status(400).send('Invalid file name.');
  }

  const filePath = path.join(__dirname, 'files', fileName);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
