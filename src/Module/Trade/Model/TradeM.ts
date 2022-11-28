import { Context } from "../../../System/Context";
import { WalletI } from "../../../Infrastructure/PSQL/Entity/WalletE";
import { TradePSQL } from "../../../Infrastructure/PSQL/Repository/TradeSQL";
import { WalletPSQL } from "../../../Infrastructure/PSQL/Repository/WalletPSQL";
import { TradeR as R } from "../TradeR";
import { TradeI } from "../../../Infrastructure/PSQL/Entity/TradeE";
/** модель запросов на обмен */
export class TradeM {

    private walletPSQL: WalletPSQL;
    private tradePSQL: TradePSQL;

    /** конструктор */
    constructor() {
        this.walletPSQL = new WalletPSQL();
        this.tradePSQL = new TradePSQL();
    }

    /** Получить все запросы пользователя с учетом пагинации*/
    public async listTrades(data: R.listTrades.RequestI): Promise<R.listTrades.ResponseI> {        
        //TODO: придумай валидацию
        const validData = data;

        let error_cause = '';

        let avActiveTrade: TradeI[] = []; 

        if (!validData.user_context.is_auth || validData.user_context.id_user < 0) {
            error_cause = 'Пользователь не авторизован';
        } else { 
            avActiveTrade = await this.tradePSQL.listTradeByUser({ 
                idUser: validData.user_context.id_user, 
                offset: validData.offset, 
                limit: validData.limit
            });
        }

        const out: R.listTrades.ResponseI = {
            list_trades: avActiveTrade,
            error_cause: error_cause,
        };

        return out;
    }

    /** Добавить новый запрос */
    public async addTrade(data: R.addTrade.RequestI): Promise<R.addTrade.ResponseI> {        
        //TODO: придумай валидацию
        const validData = data;

        let error_cause = '';

        let idTrade = -1; 

        if (!validData.user_context.is_auth || validData.user_context.id_user < 0) {
            error_cause = 'Пользователь не авторизован';
        } else { 
            // проверяем, есть ли у пользователя счета с переданными валютами
            const vWalletIn = await this.walletPSQL.oneWalletsByFilter({ 
                idUser: validData.user_context.id_user, 
                idWallet: validData.id_wallet_in,
            });
            const vWalletOut = await this.walletPSQL.oneWalletsByFilter({ 
                idUser: validData.user_context.id_user, 
                idWallet: validData.id_wallet_out,
            });
            if (!vWalletIn || !vWalletOut) {
                error_cause = 'У пользователя нет счетов для осуществления требуемой операции';
            } else {
                idTrade = await this.tradePSQL.addTrade({ 
                    user_id: validData.user_context.id_user,
                    money_in: validData.money_in,
                    currency_in: vWalletIn.currency,
                    money_out: validData.money_out,
                    currency_out: vWalletOut.currency,
                    target_date: validData.target_date,
                });
            }
        }

        const out: R.addTrade.ResponseI = {
            id_trade: idTrade,
            error_cause: error_cause,
        };

        return out;
    }

    /** Пополнить счет */
    public async revokeTrade(data: R.revokeTrade.RequestI): Promise<R.revokeTrade.ResponseI> {        
        //TODO: придумай валидацию
        const validData = data;

        let error_cause = '';

        if (!validData.user_context.is_auth || validData.user_context.id_user < 0) {
            error_cause = 'Пользователь не авторизован';
        } else { 
            // проверяем, есть ли у пользователя счет с этой валютой
            const vTrade = await this.tradePSQL.oneWalletsByFilter({ 
                idUser: validData.user_context.id_user, 
                idTrade: validData.id_trade,
            });
            if (!vTrade) {
                error_cause = 'У пользователя нет такого запроса на обмен';
            }
            vTrade.is_deleted = 1;
            await this.tradePSQL.updateTrade(vTrade);
        }

        const out: R.revokeTrade.ResponseI = {
            error_cause: error_cause,
        };

        return out;
    }

}