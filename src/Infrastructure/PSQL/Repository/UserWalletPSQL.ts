import { BasePSQL } from "../BasePSQL";
import { UserWalletE, UserWalletI } from "../Entity/UserWalletE";

export class UserWalletPSQL extends BasePSQL {
    /** Получить транзакции пользователя списком */
    public async listWalletsByUser(filter: {
        idUser: number
    }): Promise<UserWalletI[]> {
        let out: UserWalletI[] = [];

        try {
            out = await this.db<UserWalletI>(UserWalletE.NAME)
                .where('id_user', filter.idUser)
                .select();
        } catch (e) {
            console.log(e);
        }
        return out;
    }

    /** Создать новый кошелёк */
    public async addWallet(data: UserWalletI): Promise<number> {
        //TODO: придумай валидацию
        const validData = data;
        let out = -1;
        try {
            out = (await this.db(UserWalletE.NAME)
                .insert(validData)
                .onConflict('id')
                .merge())[0];
        } catch (e) {
            console.log(e);
        }
        return out;
    }
}