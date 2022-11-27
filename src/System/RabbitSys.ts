import client, {Channel, Connection} from 'amqplib';
import { TradeI } from '../Infrastructure/PSQL/Entity/TradeE';

export class RabbisSys {

    constructor() {
    };

    public async sendTradeToQueue(message: string){
        const rabbitConnection: Connection = await client.connect(
            'amqp://username:password@localhost:5672'
        );

        const channel: Channel = await rabbitConnection.createChannel();

        await channel.assertQueue('active_trade');

        channel.sendToQueue('active_trade', Buffer.from(message));
    }



}
