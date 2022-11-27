
import knex from 'knex';
import { dbCore } from '../../Configs/MainConfig';

/** класс SQL по умолчанию */
export class BasePSQL {
    /** клиент кнекса для поиска по базе данных */
    readonly db = knex(dbCore);
    
    /** число записей получаемых списком по умолчанию */
    readonly baseLimit = 50;
}