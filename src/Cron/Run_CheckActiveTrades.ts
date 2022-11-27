import axios from 'axios';
import _, { Dictionary } from 'lodash';
import cron from 'node-cron';
import { env } from 'process';
import { SupportedCurrenciesT } from '../Infrastructure/PSQL/Entity/WalletE';
import { TradePSQL } from '../Infrastructure/PSQL/Repository/TradeSQL';
import { RabbisSys, TradeProcessWorkerI } from '../System/RabbitSys';

const iCronSchedule = '5'; // время в минутах, через которое крон будет запускаться заново.

interface MarketStateI {
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

    const EXCHANGERATE_API_KEY = process.env;

    for (const pair of asCurrencyPairs) {
        const aCurrencies = pair.split('-');

        // всего 1500 запросов в месяц, хватит на то чтобы работало +/- 3 дня
        const url = `https://v6.exchangerate-api.com/v6/${EXCHANGERATE_API_KEY}/pair/${aCurrencies[0]}/${aCurrencies[1]}`;
        
        try {
            // пробуем получить ответ от AlphaVantage
            const axiosResponse = await axios.get(url);
            // Если все хорошо - парсим полученные данные
            const vParsedData = JSON.parse(axiosResponse.data);

            avMarketState.push({
               sPair: pair,
               iCurrentPrice: vParsedData.conversion_rate
            });

        } catch (e) {
            console.log('Error: ', e);
        }

    }

    return _.groupBy(avMarketState, 'sPair');
}

/** функция ставящая работу крона, проверяющего заказы на автозапуск раз в 5 минут */
export async function runTradeCron() {

    // Инициализируем .env
    require('dotenv').config();
    const tradePSQL = new TradePSQL();
    const rabbitSys = new RabbisSys();

    cron.schedule(`0 */${iCronSchedule} * * * *`, async function() {

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
                }
                rabbitSys.sendTradeToQueue(message);
            }
        }

        /** Обрабатываем запросы, срок исполнения которых подошел к концу */
        for(let i = 0; i < avOutdatedTrade.length; i++) {
            const message: TradeProcessWorkerI = { 
                trade_id: avOutdatedTrade[i].id,
                action: 'reject',
            }
            rabbitSys.sendTradeToQueue(message);
        }
    })
}