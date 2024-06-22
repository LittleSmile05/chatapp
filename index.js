const express = require('express');
const app = express();
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);
const { Pool } = require('pg');

require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const port = 5000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + './new-folder/index.html');
});

io.on('connection', async (socket) => {
  // Retrieve and send past messages to the new client
  try {
    const client = await pool.connect();
    const messagesResult = await client.query('SELECT * FROM messages ORDER BY timestamp ASC');
    const pastMessages = messagesResult.rows;
    client.release();

    
    socket.emit('past messages', pastMessages);
  } catch (error) {
    console.error(error);
  }

  // socket.on('send name', async (username) => {
  //   // Insert the username into the "usersx" table
  //   try {
  //     const client = await pool.connect();
  //     const result = await client.query('INSERT INTO usersx (username) VALUES ($1) RETURNING id', [username]);
  //     const userId = result.rows[0].id;
  //     client.release();

  //     io.emit('send name', { username, userId });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });

  socket.on('send message', async (data) => {
    console.log('Received message data:', data);

    const { username, message } = data;

    try {
      const client = await pool.connect();
      await client.query('INSERT INTO messages (username, message) VALUES ($1, $2)', [username, message]);
      client.release();
    } catch (error) {
      console.error(error);
    }

    io.emit('send message', data);
  });
});

server.listen(port, () => {
  console.log(`Server is listening at the port: ${port}`);
});
