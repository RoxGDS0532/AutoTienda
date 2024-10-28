import mysql from 'promise-mysql';
import keys from './keys';

const pool = mysql.createPool(keys.database);
pool.getConnection().then(connection =>{
    pool.releaseConnection(connection);
    console.log('DB is connected');
});

pool.getConnection()
    .then(() => {
        console.log('Conexión a la base de datos exitosa');
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
});

export default pool;
