/**
 * Описание пользователя
 */
export interface UserDataI {
    id?: number; // id пользователя
    login: string; // логин пользователя
    password_secure: string; // зашифрованный пароль
}

/** Описание сущности пользователя */
export class UserDataE {
    /** Имя таблицы */
    public static NAME = 'user_data';
    
}