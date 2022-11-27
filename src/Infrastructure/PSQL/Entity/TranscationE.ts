import { SupportedCurrenciesT } from "./WalletE";

/**
 * Описание транзакции
 */
export interface TransactionI {
    id: number; // id транзакции
    id_user; // id создателя транзакции
    money_out: number; // Сколько валюты хотим отдать на обмен
    currency_out: SupportedCurrenciesT; // Тип отдаваемой валюты
    money_in: number; // Сколько валюты хотим получить после обмена
    currency_in: SupportedCurrenciesT; // Тип получаемой валюты
    target_date: string; // Желаемая дата, к которой транзакция должна быть произведена
    is_resolved: boolean; // Была ли транзакция выполнена
    id_deleted: boolean; // Была ли отменена транзакция
}

/** Описание сущности транзакции */
export class TransactionE {
    /** Имя таблицы */
    public static NAME = 'transaction';
    
}