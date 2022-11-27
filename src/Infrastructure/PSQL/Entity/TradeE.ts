import { SupportedCurrenciesT } from "./WalletE";

/**
 * Описание транзакции
 */
export interface TradeI {
    id?: number; // id транзакции
    id_user: number; // id создателя транзакции
    money_out: number; // Сколько валюты хотим отдать на обмен
    currency_out: SupportedCurrenciesT; // Тип отдаваемой валюты
    money_in: number; // Сколько валюты хотим получить после обмена
    currency_in: SupportedCurrenciesT; // Тип получаемой валюты
    target_date: string; // Желаемая дата, к которой транзакция должна быть произведена
    is_resolved?: number; // Была ли транзакция выполнена
    is_deleted?: number; // Была ли отменена транзакция
}

/** Описание сущности транзакции */
export class TradeE {
    /** Имя таблицы */
    public static NAME = 'transaction';
    
}