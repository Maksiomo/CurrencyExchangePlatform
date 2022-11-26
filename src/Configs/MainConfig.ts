require('dotenv').config();

// ==============================================================
// Подключения баз данных
// ==============================================================


const { CLIENT, DATABASE, PG_USER, PASSWORD, HOST, PG_PORT } = process.env

/** Подключение к основной базе данных - ЧТЕНИЕ */
export const dbCore = {
    client: CLIENT,
    connection: {
        host : HOST,
        port : Number(PG_PORT),    
        user: PG_USER,
        password: PASSWORD,
        database: DATABASE
    },
    pool: { min: 0, max: 100 },
    migrations: {
        tableName: 'knex_migrations',
        directory: './src/Infrastructure/PSQL/Migrations', 
    }
};