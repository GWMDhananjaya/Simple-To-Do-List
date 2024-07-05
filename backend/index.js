const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite in-memory database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT)');
});

// Get all todos
app.get('/todos', (req, res) => {
  db.all('SELECT * FROM todos', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// Add a new todo
app.post('/todos', (req, res) => {
  const { task } = req.body;
  db.run('INSERT INTO todos (task) VALUES (?)', [task], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM todos WHERE id = ?', id, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ deleted: this.changes });
  });
});

// Update a todo
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  db.run('UPDATE todos SET task = ? WHERE id = ?', [task, id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ updated: this.changes });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
