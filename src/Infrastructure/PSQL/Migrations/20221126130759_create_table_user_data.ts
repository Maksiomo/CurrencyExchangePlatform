import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    const sTableName = 'user_data';

    console.log(`Создание таблицы ${sTableName}`);

    await knex.schema.dropTableIfExists(sTableName);

    await knex.schema.createTable(sTableName, (table) => {
        table.increments('id')
            .index('id');

        table
            .string('login_secure', 100)
            .notNullable()
            .unique()
            .comment('Зашифрованный логин пользователя');

        table
            .string('password_secure', 100)
            .notNullable()
            .unique()
            .comment('Зашифрованный пароль пользователя');

        table.comment('Простая имплементация таблицы с зашифрованными пользовательскими данными');
    });

    return knex.schema;
}


export async function down(knex: Knex): Promise<void> {
}

