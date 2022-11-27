import client, { Channel, Connection, ConsumeMessage } from "amqplib";
import { TradePSQL } from "../Infrastructure/PSQL/Repository/TradeSQL";
import { WalletPSQL } from "../Infrastructure/PSQL/Repository/WalletPSQL";
import { TradeProcessWorkerI } from "../System/RabbitSys";
import path from 'path';

/* имя очереди */
const queryName = 'active_trade';

async function workProcess(msg: Buffer) {
    const data: TradeProcessWorkerI = JSON.parse(msg.toString()) as TradeProcessWorkerI;

    const tradePSQL = new TradePSQL();
    const walletPSQL = new WalletPSQL();

    try {
        if (data.action === "resolve") {
            // Получаем запрос
            const vTrade = await tradePSQL.oneWalletsByFilter({ idTrade: data.trade_id });

            // Получаем счета пользователя 
            const avWallet = await walletPSQL.listWalletsByUser({ idUser: vTrade.user_id });

            const vWalletOut = avWallet.find((wallet) => {
                return wallet.currency === vTrade.currency_out;
            });

            const vWalletIn = avWallet.find((wallet) => {
                return wallet.currency === vTrade.currency_in;
            });

            if (!vWalletIn || !vWalletOut) {
                console.log('Счета, необходимые для осуществления обмена не существуют у запроса: ', data);
            } else if (vWalletOut.money < Number(vTrade.money_out)) {
                console.log('Недостаточно денег на счёте для осуществления операции по запросу: ', data);
            } else {
                // Списываем деньги со входящего счета
                vWalletOut.money =  Number(vWalletOut.money) - Number(vTrade.money_out);
                // Пополняем входящий счет на сумму сделки
                vWalletIn.money = Number(vWalletIn.money) + Number(vTrade.money_out) / data.trade_price;
                // Ставим отметку, что сделка прошла успешно
                vTrade.is_resolved = 1;
                // Обновляем записи в БД
                await Promise.all([
                    walletPSQL.updateWallet(vWalletIn),
                    walletPSQL.updateWallet(vWalletOut),
                    tradePSQL.updateTrade(vTrade)
                ]);
                console.log('Сделка проведена успешно, детали: ', data);
            }
        } else if (data.action === "reject") {
            // Если пришло сообщение с такой командой, ставим ему флаг что он удален
            const vTrade = await tradePSQL.oneWalletsByFilter({ idTrade: data.trade_id });
            vTrade.is_deleted = 1;
            await tradePSQL.updateTrade(vTrade);
            console.log('Сделка успешно отменена, детали: ', data);
        } else {
            console.log('Некорректная команда для запроса: ', data);
        }
    } catch (e) {
        console.log('Ошибка при выполнении команды для запроса: ', data);
    }
}

/** запускатор + подключение к считыванию из Rabbit очереди */
async function run() {

    // Инициализируем .env
    require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

    const connection: Connection = await client.connect(
        'amqp://localhost:5672'
    );

    const tradeChannel: Channel = await connection.createChannel();

    await tradeChannel.assertQueue('active_trade');

    const consumer = (channel: Channel) => async (msg: ConsumeMessage): Promise<void> => {
        if (msg) {
            await workProcess(msg.content);
            // Отмечаем что запрос обработан
            channel.ack(msg)
        }
    }

    await tradeChannel.consume(queryName, consumer(tradeChannel));

    console.log('Worker обработки запросов на обмен запущен');

}

void run().catch((error) => {
    console.log(error);
    process.exit(1);
});
