import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const sTableName = 'transaction';

    console.log(`Создание таблицы ${sTableName}`);

    await knex.schema.dropTableIfExists(sTableName);

    await knex.schema.createTable(sTableName, (table) => {
        table.increments('id')
            .index('id')
            .comment('id транзакции');

        table.bigInteger('user_id')
            .notNullable()
            .comment('id пользователя сделавшего транзакцию')
        
        table.decimal('money_out', 5)
            .notNullable()
            .defaultTo(0)
            .comment('Количество исходящей валюты');
             
        table.enu('currency_out', 
            [
                'EUR',
                'USD'
            ])
            .comment('Исходящая валюта транзакции')
            .notNullable();

        table.decimal('money_in', 5)
            .notNullable()
            .defaultTo(0)
            .comment('Количество входящей валюты');

        table.enu('currency_in', 
            [
                'EUR',
                'USD'
            ])
            .comment('Входящая валюта транзакции')
            .notNullable();

        table.dateTime('target_date')
            .index('target_date')
            .notNullable()
            .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
            .comment('Желаемая дата, к которой транзакция должна быть произведена');
        
        table.tinyint('is_resolved', 1)
            .unsigned()
            .notNullable()
            .defaultTo(0)
            .index('is_resolved')
            .comment('Была ли проведена транзакция');
        
        table.tinyint('is_deleted', 1)
            .unsigned()
            .notNullable()
            .defaultTo(0)
            .index('is_deleted')
            .comment('Была ли отменена транзакция');

    })
}


export async function down(knex: Knex): Promise<void> {
}

