/**
 * Описание пользователя
 */
export interface TransactionI {
    id: number; // id пользователя
    login_secure: string; // зашифрованный логин пользователя
    password_secure: string; // зашифрованный пароль
}

/** Описание сущности пользователя */
export class TransactionE {
    /** Имя таблицы */
    public static NAME = 'user_data';
    
}