/** Общие импорты для запуска локального сервера */
import express from "express";
import cors from "cors";
import { AuthCtrl } from "./Module/Auth/AuthCtrl";
import { WalletCtrl } from "./Module/Wallet/WalletCtrl";
import { TradeCtrl } from "./Module/Trade/TradeCtrl";
import path from 'path';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = 3000;

// Инициализируем .env
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

// объявляем контроллеры модулей:
const authCtrl = new AuthCtrl();
const walletCtrl = new WalletCtrl();
const tradeCtrl = new TradeCtrl();

app.use(authCtrl.router);
app.use(walletCtrl.router);
app.use(tradeCtrl.router);

require('./Worker/RUN_TradeProcessWorker');
require('./Cron/Run_CheckActiveTrades');

app.listen(port, () => {
    console.log('API платформы обмена валют запущено на порте: ', port);
});