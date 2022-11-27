import express from "express";
import handler from "../handler";
import { AuthM } from "./Model/AuthM";
import { AuthR as R } from "./AuthR";

export class AuthCtrl {
  public router = express.Router({ mergeParams: true });
  public authM = new AuthM();

  constructor() {

    this.router.post(
      R.signIn.route,
      handler((req) => {
        const data = req.body;
        return this.authM.signIn(data);
      })
    );

    this.router.post(
      R.signUp.route,
      handler((req) => {
        const data = req.body;
        return this.authM.signUp(data);
      })
    );
    
  }
}