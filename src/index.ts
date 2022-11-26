/** Общие импорты для запуска локального сервера */
import * as express from "express";
import cors from "cors";

const app = express();

app.use(cors());