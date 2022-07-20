module.exports = {
    type: process.env.DB_TYPE,
    host: process.env.IPV4_DB,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // synchronize: true,
    entities: [
        "./src/modules/**/entities/*.ts"
    ],
    migrations: [
        "./src/shared/infra/typeorm/migrations/*.ts"
    ],
    cli: {
        "migrationsDir": "./src/shared/infra/typeorm/migrations"
    },
    logging: [
        'query',
        'error'
    ],
}
