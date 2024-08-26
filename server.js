const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2'); // Assuming you're using mysql2 package
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Create a MySQL connection pool
const db = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'project1234', // Replace with your MySQL password
  database: 'home_service_quickfix' // Replace with your database name
});

// Route for the homepage (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for the signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Route for the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Signup API route
app.post('/api/signup', (req, res) => {
  const { name, email, phone, password } = req.body;

  // Basic validation
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Check if the email or username already exists
  const checkQuery = 'SELECT * FROM users WHERE email = ? OR name = ?';
  db.query(checkQuery, [email, name], (err, results) => {
    if (err) {
      console.error('Error checking for existing user:', err);
      return res.status(500).json({ error: 'Error checking for existing user.' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'User with this email or username already exists. Kindly LOGIN.' });
    }

    // Prepare the SQL query
    const query = 'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)';
    const values = [name, email, phone, password];

    // Execute the query
    db.query(query, values, (err, results) => {
      if (err) {
        console.error('Error during signup:', err);
        return res.status(500).json({ error: 'Error during signup.', details: err });
      }
      res.status(201).json({ message: 'Signup successful!' });
    });
  });
});

// Login API route
app.post('/api/login', (req, res) => {
  const { name, password } = req.body;

  // Basic validation
  if (!name || !password) {
    return res.status(400).json({ error: 'Name and password are required.' });
  }

  // Prepare the SQL query
  const query = 'SELECT * FROM users WHERE name = ? AND password = ?';
  const values = [name, password];

  // Execute the query
  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ error: 'Error during login.', details: err });
    }

    // Check if user exists
    if (results.length > 0) {
      res.status(200).json({ message: 'Login successful!' });
    } else {
      res.status(401).json({ error: 'Invalid name or password.' });
    }
  });
});

// Route to handle location submission
app.post('/submit-location', (req, res) => {
  const { address, city, postalCode } = req.body;

  // Basic validation
  if (!address || !city || !postalCode) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Prepare the SQL query
  const query = 'INSERT INTO locations (address, city, postal_code) VALUES (?, ?, ?)';
  const values = [address, city, postalCode];

  // Execute the query
  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error saving location:', err);
      return res.status(500).json({ error: 'Error saving location.', details: err });
    }
    res.json({ success: true, message: 'Location saved successfully!' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
