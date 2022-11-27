import client, {Channel, Connection} from 'amqplib';

export interface TradeProcessWorkerI {
    trade_id: number; // id запроса
    action: string; // что необходимо с ним сделать
}

export class RabbisSys {

    constructor() {
    };

    public async sendTradeToQueue(message: TradeProcessWorkerI){
        const rabbitConnection: Connection = await client.connect(
            'amqp://username:password@localhost:5672'
        );``

        const channel: Channel = await rabbitConnection.createChannel();

        await channel.assertQueue('active_trade');

        channel.sendToQueue('active_trade', Buffer.from(JSON.stringify(message)));
    }



}
