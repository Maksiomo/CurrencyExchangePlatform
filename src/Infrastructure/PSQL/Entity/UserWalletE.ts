/*
 * Описание кошелька
 */
export interface WalletI {
    id: number; // id кошелька
    user_id: number; // id владельца счёта
    money: number; // Сколько валюты находится на счёте
    currency: SupportedCurrenciesT; // Тип валюты счёта
}

/**
 * Поддерживаемые валюты
 */
export enum SupportedCurrenciesT {
    USD = 'USD',
    EUR = 'EUR',
    RUB = 'RUB',
    KZT = 'KZT',
    GEL = 'GEL',
}

/** Описание сущности кошелька */
export class TransactionE {
    /** Имя таблицы */
    public static NAME = 'user_wallet';
    
}