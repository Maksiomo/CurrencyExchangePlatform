import { Context } from "../../System/Context";
import { SupportedCurrenciesT, WalletI } from "../../Infrastructure/PSQL/Entity/WalletE";

/** Модуль счетов пользователей */
export namespace WalletR {

    /** Получить все счета пользователя */
    export namespace listWallets {

        /** APIURL */
        export const route = '/wallet/list-wallets';

        /** Параметры api запроса */
        export interface RequestI {
            user_context: Context; // данные о текущем пользователе
        }

        /** Параметры api ответа */
        export interface ResponseI {
            list_wallets: WalletI[]; // все счета текущего пользователя
            error_cause?: string; // причина неудачи
        }

    }

    /** Создать новый валютный счет */
    export namespace addWallet {
        
        /** APIURL */
        export const route = '/wallet/add-wallet';

        /** Параметры api запроса */
        export interface RequestI {
            user_context: Context; // данные о текущем пользователе
            currency: SupportedCurrenciesT;
        }

        /** Параметры api ответа */
        export interface ResponseI {
            id_wallet: number; // id созданного счета
            error_cause?: string; // причина неудачи
        }
    }

    /** Пополнить свой счёт */
    export namespace refillWallet {

        /** APIURL */
        export const route = '/wallet/refill-wallet';

        /** Параметры api запроса */
        export interface RequestI {
            user_context: Context; // данные о текущем пользователе
            idWallet: number; // id счёта
            amount: number; // сумма пополнения
        }

        /** Параметры api ответа */
        export interface ResponseI {
            wallet_money: number; // текущая сумма на счету
            error_cause?: string; // причина неудачи
        }
    }

}