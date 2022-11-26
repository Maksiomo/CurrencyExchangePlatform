import { BasePSQL } from "../BasePSQL";
import { UserDataE, UserDataI } from "../Entity/UserDataE";

export class UserDataPSQL extends BasePSQL {
    
    /** Получить данные  зашифрованные данные пользователя по его логину */
    public async oneUserData(sLoginSecure: string): Promise<UserDataI> {
        let out: UserDataI = null;
        try {
            out = await this.db<UserDataI>(UserDataE.NAME)
                .where('login_secure', sLoginSecure)
                .first();
        } catch (e) {
            console.log(e);
        }
        return out;
    }

    /** Создать новую транзакцию */
    public async addUserData(data: UserDataI): Promise<number> {
        //TODO: придумай валидацию
        const validData = data;
        let out = -1;
        try {
            out = (await this.db(UserDataE.NAME)
                .insert(validData)
                .onConflict('id')
                .merge())[0];
        } catch (e) {
            console.log(e);
        }
        return out;
    }

    /** Обновить транзакцию */
    public async updateUserData(idUser: number, data: UserDataI): Promise<number>  {
        //TODO: придумай валидацию
        const validData = data;
        let out = -1;
        try {
            out = (await this.db(UserDataE.NAME)
                .where('id', idUser)
                .upsert(validData))[0];
        } catch (e) {
            console.log(e);
        }
        return out;
    }
}