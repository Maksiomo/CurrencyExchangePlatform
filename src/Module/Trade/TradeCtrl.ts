import express from "express";
import handler from "../handler";
import { TradeM } from "./Model/TradeM";
import { TradeR as R } from "./TradeR";


export class TradeCtrl {
  router = express.Router({ mergeParams: true });

  constructor(private readonly tradeM: TradeM) {

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