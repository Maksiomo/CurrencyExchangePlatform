import client, {Channel, Connection, ConsumeMessage} from 'amqplib';

export interface TradeProcessWorkerI {
    trade_id: number; // id запроса
    action: string; // что необходимо с ним сделать
    trade_price: number; // конечная стоимость обмена
}

export class RabbisSys {

    constructor() {
    };

    public async sendTradeToQueue(message: TradeProcessWorkerI){
        const rabbitConnection: Connection = await client.connect(
            'amqp://localhost:5672'
        );

        const channel: Channel = await rabbitConnection.createChannel();

        await channel.assertQueue('active_trade');

        channel.sendToQueue('active_trade', Buffer.from(JSON.stringify(message)));
    }

}
