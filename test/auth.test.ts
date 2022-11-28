import { v4 as uuidv4 } from 'uuid'
import {AuthM} from "../src/Module/Auth/Model/AuthM"

const autM = new AuthM();

describe('Тестирование модуля аутентификации', () => {
    it('Пробуем зарегистрировать нового пользователя', async () => {
        const testLogin = uuidv4();
        const data = await autM.signIn({
            login: testLogin,
            password: '123qweasd'
        });
        
        expect(data.user_context.is_auth).toBe(true);
    }, 2000);
    
    it('Пробуем войти под существуюшим пользователем', async () => {
        const data = await autM.signUp({
            login: 'dasfs',
            password: '123qweasd'
        });
        expect(data.user_context.id_user).toBe(5);
    }, 2000);
});