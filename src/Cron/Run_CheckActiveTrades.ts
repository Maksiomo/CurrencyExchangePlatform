import axios from 'axios';
import _, { Dictionary } from 'lodash';
import cron from 'node-cron';
import { SupportedCurrenciesT } from '../Infrastructure/PSQL/Entity/WalletE';
import { TradePSQL } from '../Infrastructure/PSQL/Repository/TradeSQL';
import { RabbisSys, TradeProcessWorkerI } from '../System/RabbitSys';
import path from 'path';

const iCronSchedule = '5'; // время в минутах, через которое крон будет запускаться заново.

export interface MarketStateI {
    sPair: string,
    iCurrentPrice: number,
}

/** Получить состояние котировок для всех поддерживаемых валют */
async function listMarketState(): Promise<Dictionary<MarketStateI[]>> {

    // получаем все поддерживаемые пары списком
    const asSupportedCurrencies = Object.values(SupportedCurrenciesT);

    const asCurrencyPairs: string[] = [];

    // собираем список всех возможных монетных пар
    for (const currency of asSupportedCurrencies) {
        for (const subcurrency of asSupportedCurrencies) {
            if (currency === subcurrency) continue;
            asCurrencyPairs.push(`${currency}-${subcurrency}`);
        }
    }

    const avMarketState: MarketStateI[] = [];

    const sApiKey = process.env.EXCHANGERATE_API_KEY;

    for (const pair of asCurrencyPairs) {
        const aCurrencies = pair.split('-');

        // всего 1500 запросов в месяц, хватит на то чтобы работало +/- 3 дня
        const url = `https://v6.exchangerate-api.com/v6/${sApiKey}/pair/${aCurrencies[0]}/${aCurrencies[1]}`;
        
        try {
            // пробуем получить ответ от AlphaVantage
            const axiosResponse = await axios.get(url);
            // Если все хорошо - парсим полученные данные

            avMarketState.push({
               sPair: pair,
               iCurrentPrice: axiosResponse.data.conversion_rate
            });

        } catch (e) {
            console.log('Error: ', e);
        }
        
    }

    return _.groupBy(avMarketState, 'sPair');
}

/** функция ставящая работу крона, проверяющего заказы на автозапуск раз в 5 минут */
async function runTradeCron() {

    // Инициализируем .env
    require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
    const tradePSQL = new TradePSQL();
    const rabbitSys = new RabbisSys();

    console.log('Запущен крон проверки актуальных запросов.');

    cron.schedule(`0 */${iCronSchedule} * * * *`, async function() {

        console.log('Крон проводит запланированный прогон');

        /** Получаем актуальную информацию от бирж и баз данных */
        const [avMarketState, avActiveTrade, avOutdatedTrade] = await Promise.all([
            listMarketState(),
            tradePSQL.listActiveTrade(),
            tradePSQL.listOutdatedActiveTrade(),
        ]);

        /** Обрабатываем активные запросы, которые можно выполнить */
        for(let i = 0; i < avActiveTrade.length; i++) {
            const trade = avActiveTrade[i];
            const tradePair = `${trade.currency_out}-${trade.currency_in}`;
            const vPairState = avMarketState[tradePair][0];

            if (vPairState.iCurrentPrice <= trade.money_out / trade.money_in) {
                const message: TradeProcessWorkerI = { 
                    trade_id: trade.id,
                    action: 'resolve',
                    trade_price: vPairState.iCurrentPrice
                }
                rabbitSys.sendTradeToQueue(message);
            }
        }

        /** Обрабатываем запросы, срок исполнения которых подошел к концу */
        for(let i = 0; i < avOutdatedTrade.length; i++) {
            const message: TradeProcessWorkerI = { 
                trade_id: avOutdatedTrade[i].id,
                action: 'reject',
                trade_price: -1
            }
            rabbitSys.sendTradeToQueue(message);
        }
    })
}

void runTradeCron().catch((error) => {
    console.log(error);
    process.exit(1);
});