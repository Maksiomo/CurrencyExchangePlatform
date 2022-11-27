import express from "express";
import handler from "../handler";
import { AuthM } from "./Model/AuthM";
import { AuthR as R } from "./AuthR";

export class AuthCtrl {
  router = express.Router({ mergeParams: true });

  constructor(private readonly authM: AuthM) {

    this.router.get(
      R.signIn.route,
      handler((req) => {
        const data = req.body;
        return this.authM.signIn(data);
      })
    );

    this.router.get(
      R.signUp.route,
      handler((req) => {
        const data = req.body;
        return this.authM.signUp(data);
      })
    );
    
  }
}