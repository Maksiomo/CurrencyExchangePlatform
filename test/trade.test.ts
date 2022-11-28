import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid'
import { SupportedCurrenciesT } from '../src/Infrastructure/PSQL/Entity/WalletE';
import { AuthM } from "../src/Module/Auth/Model/AuthM"
import { TradeM } from "../src/Module/Trade/Model/TradeM"
import {WalletM} from "../src/Module/Wallet/Model/WalletM"

const autM = new AuthM();
const tradeM = new TradeM();
const walletM = new WalletM();

describe('Тестирование модуля обмена валют', () => {
    it('Пробуем добавить новый запрос на обмен валют', async () => {

        // пополняем исходящий счет чтобы точно хватило денег
        await walletM.refillWallet({
            user_context: {
                id_user: 1,
                is_auth: true
            },
            id_wallet: 1,
            amount: 2
        })

        const date = dayjs().add(7, 'day').toISOString();

        const data = await (tradeM.addTrade({
            user_context: {
                id_user: 1,
                is_auth: true
            },
            target_date: date,
            id_wallet_in: 2,
            id_wallet_out: 1,
            money_in: 1,
            money_out: 1.2            
        }));
        
        expect(data.id_trade).toBeGreaterThan(0);
    }, 2000);
    
    it('Пробуем отменить еще не исполненный запрос', async () => {
        
        const date = dayjs().add(7, 'day').toISOString();

        // создаем новый запрос
        const vTrade = await (tradeM.addTrade({
            user_context: {
                id_user: 1,
                is_auth: true
            },
            target_date: date,
            id_wallet_in: 2,
            id_wallet_out: 1,
            money_in: 1,
            money_out: 1.2            
        })); 

        const data = await tradeM.revokeTrade({
            user_context: {
                id_user: 1,
                is_auth: true
            },
            id_trade: vTrade.id_trade
        })
        expect(data.error_cause).toBe('');
    }, 2000);

    it('Пробуем получить все не удаленные запросы пользователя на обмен', async () => {

        const data = await tradeM.listTrades({
            user_context: {
                id_user: 1,
                is_auth: true
            },
            offset: 0,
            limit: 50
        })
        expect(data.error_cause).toBe('');
    }, 2000);
});