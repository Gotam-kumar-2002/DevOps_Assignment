const express = require('express');
const mysql = require('mysql2');  // Use mysql2 instead of mysql
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',           // Make sure this matches your MySQL root username
    password: 'Gotam@Samadha0304',  // Your MySQL password
    database: 'signup'      // Make sure this database exists
});

// Test MySQL connection
db.connect((err) => {
    if (err) {
        console.log('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL!');
});

// POST route to insert user data into MySQL
app.post('/signup', (req, res) => {
    const uuid = uuidv4();  // Generate a unique ID
    const sql = "INSERT INTO login (uuid, Fullname, email, age, gender, address) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
        uuid,
        req.body.Fullname,
        req.body.email,
        req.body.age,
        req.body.gender,
        req.body.address,
    ];

    db.query(sql, values, (err, data) => {
        if (err) {
            return res.json(err);
        }
            // return res.json({
            //     message: 'User registered successfully',
            //     uuid: uuid,
            //     data: data
            // });
        const imageName = 'signup-backend';
        const containerName = `user-container-${uuid}`;

        exec(`docker run -d --name ${containerName} ${imageName}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error creating Docker container: ${error.message}`);
                return res.status(500).json({ error: 'Failed to create Docker container' });
            }
            console.log(`Docker container created: ${containerName}`);
            res.json({
                message: 'User registered successfully',
                uuid: uuid,
                container: containerName,
            });
        });
        
    });
});

app.listen(8081, () => {
    console.log("Server listening on port 8081...");
});

