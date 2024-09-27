
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3333;


app.use(bodyParser.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1111', 
    database: 'product_user_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL');
});


app.post('/products', (req, res) => {
    const { ProductName, Price, UserId } = req.body;
    const sql = 'INSERT INTO Products (ProductName, Price, UserId) VALUES (?, ?, ?)';
    db.query(sql, [ProductName, Price, UserId], (err, result) => {
        if (err) throw err;
        res.status(201).json({ id: result.insertId, ProductName, Price, UserId });
    });
});


app.get('/users/:userId/products', (req, res) => {
    const { userId } = req.params;
    const sql = 'SELECT * FROM Products WHERE UserId = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 