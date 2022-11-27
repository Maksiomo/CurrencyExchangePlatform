import { Context } from "../../../System/Context";
import { WalletI } from "../../../Infrastructure/PSQL/Entity/WalletE";
import { WalletPSQL } from "../../../Infrastructure/PSQL/Repository/WalletPSQL";
import { WalletR as R } from "../WalletR";
/** модель пользовательских счетов */
export class WalletM {
    private walletPSQL: WalletPSQL;

    /** конструктор */
    constructor() {
        this.walletPSQL = new WalletPSQL();
    }

    /** Получить все счета пользователя */
    public async listWallets(data: R.listWallets.RequestI): Promise<R.listWallets.ResponseI> {        
        //TODO: придумай валидацию
        const validData = data;

        let error_cause = '';

        let avWallets: WalletI[] = []; 

        if (!validData.user_context.is_auth || validData.user_context.id_user < 0) {
            error_cause = 'Пользователь не авторизован';
        } else { 
            avWallets = await this.walletPSQL.listWalletsByUser({ idUser: validData.user_context.id_user });
        }

        const out: R.listWallets.ResponseI = {
            list_wallets: avWallets,
            error_cause: error_cause,
        };

        return out;
    }

    /** Добавить новый счет */
    public async addWallet(data: R.addWallet.RequestI): Promise<R.addWallet.ResponseI> {        
        //TODO: придумай валидацию
        const validData = data;

        let error_cause = '';

        let idWallet = -1; 

        if (!validData.user_context.is_auth || validData.user_context.id_user < 0) {
            error_cause = 'Пользователь не авторизован';
        } else { 
            // проверяем, есть ли у пользователя счет с этой валютой
            const wallet_exists = await this.walletPSQL.oneWalletsByFilter({ 
                idUser: validData.user_context.id_user, 
                currency: validData.currency,
            });
            if (wallet_exists) {
                error_cause = 'У пользователя уже есть счет в этой валюте';
            } else {
                idWallet = await this.walletPSQL.addWallet({ 
                    user_id: validData.user_context.id_user, 
                    currency: validData.currency, 
                    money: 0 
                });

                if (idWallet < 0) {
                    error_cause = 'Ошибка при создании кошелька'
                }
            }
        }

        const out: R.addWallet.ResponseI = {
            id_wallet: idWallet,
            error_cause: error_cause,
        };

        return out;
    }

    /** Пополнить счет */
    public async refillWallet(data: R.refillWallet.RequestI): Promise<R.refillWallet.ResponseI> {        
        //TODO: придумай валидацию
        const validData = data;

        let error_cause = '';

        let iWalletMoney = -1; 

        if (!validData.user_context.is_auth || validData.user_context.id_user < 0) {
            error_cause = 'Пользователь не авторизован';
        } else { 
            // проверяем, есть ли у пользователя счет с этой валютой
            const vWallet = await this.walletPSQL.oneWalletsByFilter({ 
                idUser: validData.user_context.id_user, 
                idWallet: validData.id_wallet,
            });
            if (!vWallet) {
                error_cause = 'У пользователя нет счета в этой валюте';
            }
            vWallet.money = Number(vWallet.money) + validData.amount; 
            console.log(vWallet);
            await this.walletPSQL.updateWallet(vWallet);
            iWalletMoney = vWallet.money;
        }

        const out: R.refillWallet.ResponseI = {
            wallet_money: iWalletMoney,
            error_cause: error_cause,
        };

        return out;
    }

}