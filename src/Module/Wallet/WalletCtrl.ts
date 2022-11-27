import express from "express";
import handler from "../handler";
import { WalletM } from "./Model/WalletM";
import { WalletR as R } from "./WalletR";

export class WalletCtrl {
  router = express.Router({ mergeParams: true });
  public walletM = new WalletM();

  constructor() {

    this.router.get(
      R.listWallets.route,
      handler((req) => {
        const data = req.body;
        return this.walletM.listWallets(data);
      })
    );

    this.router.get(
      R.addWallet.route,
      handler((req) => {
        const data = req.body;
        return this.walletM.addWallet(data);
      })
    );

    this.router.get(
        R.refillWallet.route,
        handler((req) => {
          const data = req.body;
          return this.walletM.refillWallet(data);
        })
      );
    
  }
}