import { Context } from "../../System/Context";
import { TradeI } from "../../Infrastructure/PSQL/Entity/TradeE";
import { SupportedCurrenciesT, WalletI } from "../../Infrastructure/PSQL/Entity/WalletE";

/** Модуль обмена валют */
export namespace TradeR {

    /** Получить все запросы на обмен пользователя списком*/
    export namespace listTrades {

        /** APIURL */
        export const route = '/trade/list-trades';

        /** Параметры api запроса */
        export interface RequestI {
            user_context: Context; // данные о текущем пользователе
            offset: number;
            limit: number;
        }

        /** Параметры api ответа */
        export interface ResponseI {
            list_trades: TradeI[]; // все активные запросы на обмен пользователя
            error_cause?: string; // причина неудачи
        }

    }

    /** Создать новый валютный счет */
    export namespace addTrade {
        
        /** APIURL */
        export const route = '/trade/add-trade';

        /** Параметры api запроса */
        export interface RequestI {
            user_context: Context; // данные о текущем пользователе
            target_date: string; // дата к которой нужно совершить обмен
            id_wallet_in: number; // счет на который поступят деньги после обмена
            id_wallet_out: number; // счет с которого будет производиться покупка
            money_in: number; // Сколько денег хочет получить пользователь
            money_out: number; // Сколько денег хочет отдать пользователь
        }

        /** Параметры api ответа */
        export interface ResponseI {
            id_trade: number; // id созданного запроса
            error_cause?: string; // причина неудачи
        }
    }

    /** Отменить активный запрос */
    export namespace revokeTrade {

        /** APIURL */
        export const route = '/trade/revoke-trade';

        /** Параметры api запроса */
        export interface RequestI {
            user_context: Context; // данные о текущем пользователе
            id_trade: number; // id запроса
        }

        /** Параметры api ответа */
        export interface ResponseI {
            error_cause?: string; // причина неудачи
        }
    }

}