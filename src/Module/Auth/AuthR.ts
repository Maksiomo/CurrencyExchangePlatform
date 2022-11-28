import { Context } from "../../System/Context";

/** Модуль аутентификации пользователей */
export namespace AuthR {

    /** регистрация нового пользователя */
    export namespace signIn {

        /** APIURL */
        export const route = '/auth/sign-in';

        /** Параметры api запроса */
        export interface RequestI {
            login: string;
            password: string;
        }

        /** Параметры api ответа */
        export interface ResponseI {
            user_context: Context; // данные о текущем пользователе
            error_cause?: string; // причина неудачи
        }

    }

    /** вход под существующим пользователем */
    export namespace signUp {
        
        /** APIURL */
        export const route = '/auth/sign-up';

        /** Параметры api запроса */
        export interface RequestI {
            login: string;
            password: string;
        }

        /** Параметры api ответа */
        export interface ResponseI {
            user_context: Context; // данные о текущем пользователе
            error_cause?: string; // причина неудачи
        }
    }

}