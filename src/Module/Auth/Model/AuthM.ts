import md5 from "md5";
import { Context } from "../../../System/Context";
import { UserDataPSQL } from "../../../Infrastructure/PSQL/Repository/UserDataPSQL";
import { UserDataI } from "../../../Infrastructure/PSQL/Entity/UserDataE";
import { AuthR as R } from "../AuthR";
import { AuthV as V} from "../AuthV";
/** модель пользовательских данных */
export class AuthM {

    private userDataPSQL: UserDataPSQL;

    /** конструктор */
    constructor() {
        this.userDataPSQL = new UserDataPSQL();
    }

    /** зарегистрировать нового пользователя */
    public async signIn(data: R.signIn.RequestI): Promise<R.signIn.ResponseI> {
        let validData; 
        let error_cause = '';
        // Валидация
        try {
            validData = V.validSignIn().parse(data);
        } catch (e) {
            const errorList = JSON.parse(String(e));
            error_cause =  `Ошибка валидации:   `;
            for (const error of errorList) {
                error_cause += `Ошибка с ${error.path[0]}: ${error.message};    `
            }
            return { 
                user_context: null,
                error_cause: error_cause
            };
        }

        const isLoginTaken = await this.userDataPSQL.oneUserDataByFilter(validData.login);

        if (isLoginTaken) {
            error_cause = 'Пользователь с таким логином уже существует, попробуйте войти, или зарегистрируйте нового пользователя';
        
            return {
                user_context: null,
                error_cause: error_cause
            }
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
            user_context: out,
            error_cause: ''
        };
    }

    /** Войти зарегистрированному пользователю */
    public async signUp(data: R.signUp.RequestI): Promise<R.signUp.ResponseI> {

        let validData; 
        let error_cause = '';
        // Валидация
        try {
            validData = V.validSignUp().parse(data);
        } catch (e) {
            const errorList = JSON.parse(String(e));
            error_cause =  `Ошибка валидации:   `;
            for (const error of errorList) {
                error_cause += `Ошибка с ${error.path[0]}: ${error.message};    `
            }
            return { 
                user_context: null,
                error_cause: error_cause
            };
        }

        const sPaswordSecure = md5(validData.password);

        /** Пробуем получить пользователя по логину и паролю */
        let vUser: UserDataI = await this.userDataPSQL.oneUserDataByFilter(validData.login, sPaswordSecure);

        if (!vUser) {
            vUser = {
               id: -1,
               login: '',
               password_secure: '' 
            }
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