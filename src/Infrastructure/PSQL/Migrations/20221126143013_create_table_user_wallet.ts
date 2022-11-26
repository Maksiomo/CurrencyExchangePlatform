import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    const sTableName = 'user_wallet';

    console.log(`Создание таблицы ${sTableName}`);

    await knex.schema.dropTableIfExists(sTableName);

    await knex.schema.createTable(sTableName, (table) => {
        table.increments('id')
            .index('id')
            .comment('id кошелька');
        
        table.bigInteger('user_id')
            .notNullable()
            .comment('id владельца кошелька')

        table.bigInteger('money')
            .defaultTo(0)
            .comment('Баланс кошелька')

        table
            .enu('currency', [
                'EUR',
                'USD',
                'RUB',
                'KZT',
                'GEL'
            ])
            .comment('Валюта кошелька')
            .notNullable();

        table.comment('Простая имплементация таблицы с зашифрованными пользовательскими данными');
    });

    return knex.schema;
}

export async function down(knex: Knex): Promise<void> {
}

