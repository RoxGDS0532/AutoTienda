// Importar dependencias
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

// Configuración de la aplicación
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración de la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',  
    user: 'root',
    password: 'root',
    database: 'tienda_db' 
});

// Conectar a MySQL
db.connect((err) => {
    if (err) {
        console.log('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta para obtener todos los productos
app.get('/api/productos', (req, res) => {
    const sql = 'SELECT * FROM productos';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Ruta para agregar un nuevo producto
app.post('/api/productos', (req, res) => {
    const nuevoProducto = req.body;
    const sql = 'INSERT INTO productos SET ?';
    db.query(sql, nuevoProducto, (err, result) => {
        if (err) throw err;
        res.json({ message: 'Producto agregado', id: result.insertId });
    });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
