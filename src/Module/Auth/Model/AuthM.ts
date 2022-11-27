import md5 from "md5";
import { Context } from "../../../System/Context";
import { UserDataPSQL } from "../../../Infrastructure/PSQL/Repository/UserDataPSQL";
import { AuthR as R } from "../AuthR";
/** модель пользовательских данных */
export class AuthM {

    private userDataPSQL: UserDataPSQL;

    /** конструктор */
    constructor() {
        this.userDataPSQL = new UserDataPSQL();
    }

    /** зарегистрировать нового пользователя */
    public async signIn(data: R.signIn.RequestI): Promise<R.signIn.ResponseI> {        
        //TODO: придумай валидацию
        const validData = data;

        const isLoginTaken = await this.userDataPSQL.oneUserData(validData.login);

        if (isLoginTaken) {
            throw new Error('Пользователь с таким логином уже существует, попробуйте войти, или зарегистрируйте нового пользователя')
        }

        const sPaswordSecure = md5(validData.password);

        const idUser = await this.userDataPSQL.addUserData({
            login: validData.login,
            password_secure: sPaswordSecure
        })

        const out: Context = {
            id_user: idUser,
            is_auth: true,
        };

        return { 
            user_context: out
        };
    }

    /** Войти зарегистрированному пользователю */
    public async signUp(data: R.signUp.RequestI): Promise<R.signUp.ResponseI> {        
        //TODO: придумай валидацию
        const validData = data;

        let error_cause = '';

        /** проверяем зарегистрирован ли пользователь с таким логином */
        const isLoginTaken = await this.userDataPSQL.oneUserData(validData.login);

        if (!isLoginTaken) {
            error_cause = 'Пользователь с таким логином не существует, зарегистрируйте новый аккаунт';
        }

        const sPaswordSecure = md5(validData.password);

        /** Пробуем получить пользователя по логину и паролю */
        const vUser = await this.userDataPSQL.oneUserData(validData.login, sPaswordSecure);

        if (!vUser) {
            vUser.id = -1;
            error_cause = 'Пароль или логин не соответствуют друг другу';
        }

        const out: Context = {
            id_user: vUser.id,
            is_auth: vUser.id > 0,
        };

        return { 
            user_context: out,
            error_cause: error_cause
        };
    }

}