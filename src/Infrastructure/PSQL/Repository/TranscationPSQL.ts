import { BasePSQL } from "../BasePSQL";
import { TransactionE, TransactionI } from "../Entity/TranscationE";

/** SQL запросы к таблице транзакций */
export class TransactionPSQL extends BasePSQL {

    /** Получить транзакции пользователя списком */
    public async listTransactionByUser(filter: {
        idUser: number,
        offset: number,
        limit: number,
    }): Promise<TransactionI[]> {
        let out: TransactionI[] = [];

        try {
            out = await this.db<TransactionI>(TransactionE.NAME)
                .where('id_user', filter.idUser)
                .andWhere('is_deleted', false)
                .offset(filter.offset)
                .limit(filter.limit)
                .select();
        } catch (e) {
            console.log(e);
        }
        return out;
    }

    /** Создать новую транзакцию */
    public async addTransaction(data: TransactionI): Promise<number> {
        //TODO: придумай валидацию
        const validData = data;
        let out = -1;
        try {
            out = (await this.db(TransactionE.NAME)
                .insert(validData)
                .onConflict('id')
                .merge())[0];
        } catch (e) {
            console.log(e);
        }
        return out;
    }

    /** Обновить транзакцию */
    public async updateTransaction(idTransaction: number, data: TransactionI): Promise<number>  {
        //TODO: придумай валидацию
        const validData = data;
        let out = -1;
        try {
            out = (await this.db(TransactionE.NAME)
                .where('id', idTransaction)
                .upsert(validData))[0];
        } catch (e) {
            console.log(e);
        }
        return out;
    }
}