import dayjs from "dayjs";
import { BasePSQL } from "../BasePSQL";
import { TradeE, TradeI } from "../Entity/TradeE";

/** SQL запросы к таблице транзакций */
export class TradePSQL extends BasePSQL {

    /** получаем активные запросы на обмен */
    public async listActiveTrade(): Promise<TradeI[]> {
        let out: TradeI[] = [];

        try {
            out = await this.db<TradeI>(TradeE.NAME)
                .where('is_resolved', false)
                .andWhere('is_deleted', false)
                .andWhere('target_date', '>=', dayjs())
                .select();
        } catch (e) {
            console.log(e);
        }
        return out;
    }

    /** получаем просроченные запросы на обмен */
    public async listOutdatedActiveTrade(): Promise<TradeI[]> {
        let out: TradeI[] = [];

        try {
            out = await this.db<TradeI>(TradeE.NAME)
            .where('is_resolved', false)
            .andWhere('is_deleted', false)
            .andWhere('target_date', '<', dayjs())
                .select();
        } catch (e) {
            console.log(e);
        }
        return out;
    }
 
    /** Получить транзакции пользователя списком */
    public async listTradeByUser(filter: {
        idUser: number,
        offset: number,
        limit: number,
    }): Promise<TradeI[]> {
        let out: TradeI[] = [];

        try {
            out = await this.db<TradeI>(TradeE.NAME)
                .where('id_user', filter.idUser)
                .andWhere('is_deleted', false)
                .offset(filter.offset)
                .limit(filter.limit)
                .orderBy('is_resolved', 'asc')
                .select();
        } catch (e) {
            console.log(e);
        }
        return out;
    }

    
    /** Получить запрос на обмен пользователя по фильтрам */
    public async oneWalletsByFilter(filter: {
        idUser?: number
        idTrade?: number;
    }): Promise<TradeI> {
        let out: TradeI = null;

        try {
            out = await this.db<TradeI>(TradeE.NAME)
                .where(qb => {
                    if (filter.idUser) {
                        void qb.where('id_user', filter.idUser);
                    }
                    if (filter.idTrade) {
                        void qb.where('id', filter.idTrade);
                    }
                })
                .first();
        } catch (e) {
            console.log(e);
        }
        return out;
    }

    /** Создать новую транзакцию */
    public async addTrade(data: TradeI): Promise<number> {
        //TODO: придумай валидацию
        const validData = data;
        let out = -1;
        try {
            out = (await this.db(TradeE.NAME)
                .insert(validData)
                .onConflict('id')
                .merge())[0];
        } catch (e) {
            console.log(e);
        }
        return out;
    }

    /** Обновить транзакцию */
    public async updateTrade(data: TradeI): Promise<number>  {
        //TODO: придумай валидацию
        const validData = data;
        let out = -1;
        try {
            out = (await this.db(TradeE.NAME)
                .where('id', validData.id)
                .upsert(validData))[0];
        } catch (e) {
            console.log(e);
        }
        return out;
    }
}