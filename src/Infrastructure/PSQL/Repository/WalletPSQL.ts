import { BasePSQL } from "../BasePSQL";
import { SupportedCurrenciesT, WalletE, WalletI } from "../Entity/WalletE";

export class WalletPSQL extends BasePSQL {
    /** Получить счета пользователя списком */
    public async listWalletsByUser(filter: {
        idUser: number
    }): Promise<WalletI[]> {
        let out: WalletI[] = [];

        try {
            out = await this.db<WalletI>(WalletE.NAME)
                .where('user_id', filter.idUser)
                .select();
        } catch (e) {
            console.log(e);
        }
        return out;
    }

    /** Получить счет пользователя по id и валюте */
    public async oneWalletsByFilter(filter: {
        idUser?: number
        currency?: SupportedCurrenciesT;
        idWallet?: number;
    }): Promise<WalletI> {
        let out: WalletI = null;

        try {
            out = await this.db<WalletI>(WalletE.NAME)
                .where(qb => {
                    if (filter.idUser) {
                        void qb.where('user_id', filter.idUser);
                    }
                    if (filter.currency) {
                        void qb.where('currency', filter.currency);
                    }
                    if (filter.idWallet) {
                        void qb.where('id', filter.idWallet);
                    }
                })
                .first();
        } catch (e) {
            console.log(e);
        }
        return out;
    }

    /** Создать новый кошелёк */
    public async addWallet(data: WalletI): Promise<number> {
        //TODO: придумай валидацию
        const validData = data;
        let out = -1;
        try {
            out = (await this.db(WalletE.NAME)
                .insert(validData)
                .onConflict('id')
                .merge())[0];
        } catch (e) {
            console.log(e);
        }
        return out;
    }

    /** обновить кошелек */
    public async updateWallet(data: WalletI): Promise<number> {
        //TODO: придумай валидацию
        const validData = data;
        let out = -1;
        try {
            out = (await this.db(WalletE.NAME)
                .where('id', data.id)
                .update(validData));
        } catch (e) {
            console.log(e);
        }
        return out;
    }
}