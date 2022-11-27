import express from "express";
import handler from "../handler";
import { TradeM } from "./Model/TradeM";
import { TradeR as R } from "./TradeR";


export class TradeCtrl {
  public router = express.Router({ mergeParams: true });
  public tradeM = new TradeM();

  constructor() {

    this.router.get(
      R.listTrades.route,
      handler((req) => {
        const data = req.body;
        return this.tradeM.listTrades(data);
      })
    );

    this.router.get(
      R.addTrade.route,
      handler((req) => {
        const data = req.body;
        return this.tradeM.addTrade(data);
      })
    );

    this.router.get(
        R.revokeTrade.route,
        handler((req) => {
          const data = req.body;
          return this.tradeM.revokeTrade(data);
        })
      );
    
  }
}