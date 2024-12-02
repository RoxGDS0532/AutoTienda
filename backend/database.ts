import mysql, { Pool, PoolConnection } from 'promise-mysql';
import keys from './keys';

const pool: Pool = mysql.createPool(keys.database);

pool.getConnection()
    .then((connection: PoolConnection) => {
        pool.releaseConnection(connection);
        console.log('Conexión a la base de datos exitosa');
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
    });

// Función para obtener una conexión y manejar transacciones
export const getConnection = async (): Promise<PoolConnection> => {
    return await pool.getConnection();
};



export default pool;
