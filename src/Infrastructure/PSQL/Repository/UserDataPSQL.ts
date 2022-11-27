import { BasePSQL } from "../BasePSQL";
import { UserDataE, UserDataI } from "../Entity/UserDataE";

export class UserDataPSQL extends BasePSQL {
    
    /** Получить данные пользователя по его логину и (при необходимости) паролю */
    public async oneUserData(sLogin: string, sPaswordSecure?: string): Promise<UserDataI> {
        let out: UserDataI = null;
        try {
            out = await this.db<UserDataI>(UserDataE.NAME)
                .where('login', sLogin)
                .where(qb => {
                    if (sLogin) {
                        void qb.where('login', sLogin);
                    }
                    if (sPaswordSecure) {
                        void qb.where('password_secure', sPaswordSecure);
                    }
                })
                .first();
        } catch (e) {
            console.log(e);
        }
        return out;
    }

    /** Получить данные пользователя по его id */
    public async one(idUser: number): Promise<UserDataI> {
        let out: UserDataI = null;
        try {
            out = await this.db<UserDataI>(UserDataE.NAME)
                .where('id', idUser)
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
                .update(validData));
        } catch (e) {
            console.log(e);
        }
        return out;
    }
}