import client, { Channel, Connection, ConsumeMessage } from "amqplib";
import { TradePSQL } from "../Infrastructure/PSQL/Repository/TradeSQL";
import { WalletPSQL } from "../Infrastructure/PSQL/Repository/WalletPSQL";
import { TradeProcessWorkerI } from "../System/RabbitSys";


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
            const avWallet = await walletPSQL.listWalletsByUser({ idUser: vTrade.id_user });

            const vWalletOut = avWallet.find((wallet) => {
                return wallet.currency === vTrade.currency_out;
            });

            const vWalletIn = avWallet.find((wallet) => {
                return wallet.currency === vTrade.currency_in;
            });

            if (!vWalletIn || !vWalletOut) {
                console.log('Счета, необходимые для осуществления обмена не существуют у запроса: ', data);
            } else if (vWalletOut.money < vTrade.money_out) {
                console.log('Недостаточно денег на счёте для осуществления операции по запросу: ', data);
            } else {
                // Списываем деньги со входящего счета
                vWalletOut.money -= vTrade.money_out;
                // Пополняем входящий счет на сумму сделки
                vWalletIn.money += vTrade.money_out / data.trade_price;
                // Ставим отметку, что сделка прошла успешно
                vTrade.is_resolved = true;
                // Обновляем записи в БД
                await Promise.all([
                    walletPSQL.updateWallet(vWalletIn),
                    walletPSQL.updateWallet(vWalletOut),
                    tradePSQL.updateTrade(vTrade)
                ]);
            }
        } else if (data.action === "reject") {
            // Если пришло сообщение с такой командой, ставим ему флаг что он удален
            const vTrade = await tradePSQL.oneWalletsByFilter({ idTrade: data.trade_id });
            vTrade.is_deleted = true;
            await tradePSQL.updateTrade(vTrade);
        } else {
            console.log('Некорректная команда для запроса: ', data);
        }
    } catch (e) {
        console.log('Ошибка при выполнении команды для запроса: ', data);
    }
}

/** запускатор + подключение к считыванию из Rabbit очереди */
async function run() {
    const rabbitConnection: Connection = await client.connect(
        'amqp://username:password@localhost:5672'
    );

    const tradeChannel: Channel = await rabbitConnection.createChannel();

    await tradeChannel.assertQueue('active_trade');

    const consumer = (channel: Channel) => async (msg: ConsumeMessage): Promise<void> => {
        if (msg) {
            await workProcess(msg.content);
            // Отмечаем что запрос обработан
            channel.ack(msg)
        }
    }

    await tradeChannel.consume(queryName, consumer(tradeChannel));

}

void run().catch((error) => {
    console.log(error);
    process.exit(1);
});
