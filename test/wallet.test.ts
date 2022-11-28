import { v4 as uuidv4 } from 'uuid'
import { SupportedCurrenciesT } from '../src/Infrastructure/PSQL/Entity/WalletE';
import {AuthM} from "../src/Module/Auth/Model/AuthM"
import {WalletM} from "../src/Module/Wallet/Model/WalletM"

const autM = new AuthM();
const walletM = new WalletM();

describe('Тестирование модуля валютных счетов', () => {
    it('Пробуем добавить пользователю новый валютный счет', async () => {

        // генерируем нового пользователя без счетов в принципе
        const testLogin = uuidv4();
        const vNewUser = await autM.signIn({
            login: testLogin,
            password: '123qweasd'
        });

        const data = await (walletM.addWallet({
            user_context: vNewUser.user_context,
            currency: SupportedCurrenciesT.USD
        }));
        
        expect(data.id_wallet).toBeGreaterThan(0);
    }, 2000);
    
    it('Пробуем пополнить счет пользователя', async () => {
        const vUser = await autM.signUp({
            login: 'dasfs',
            password: '123qweasd'
        });

        const data = await walletM.refillWallet({
            user_context: vUser.user_context,
            id_wallet: 3,
            amount: 100
        })
        expect(data.wallet_money).toBeGreaterThanOrEqual(100);
    }, 2000);

    it('Пробуем получить все счета пользователя', async () => {

        const data = await walletM.listWallets({
            user_context: {
                id_user: 1,
                is_auth: true
            }
        })
        expect(data.error_cause).toBe('');
    }, 2000);
});