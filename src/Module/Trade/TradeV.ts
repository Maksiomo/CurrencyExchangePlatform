import z from "zod";

export namespace TradeV {
    export function validListTrades(): z.ZodObject<any> {

        const rules = z.object({
            user_context: z.object({
                id_user: z.number({
                    required_error: "id_user - обязательное поле",
                    invalid_type_error: "id_user - значение некорректно",
                }).min(1),
                is_auth: z.boolean({
                    required_error: "is_auth - обязательное поле",
                    invalid_type_error: "is_auth - значение некорректно",
                })
            }),
            offset: z.number({
                required_error: "offset - обязательное поле",
                invalid_type_error: "offset - значение некорректно",
            }).min(0),
            limit: z.number({
                required_error: "limit - обязательное поле",
                invalid_type_error: "limit - значение некорректно",
            }).min(30).max(50)
        });

        return rules;
    }

    export function validAddTrade(): z.ZodObject<any> {

        const rules = z.object({
            user_context: z.object({
                id_user: z.number({
                    required_error: "id_user - обязательное поле",
                    invalid_type_error: "id_user - значение некорректно",
                }).min(1),
                is_auth: z.boolean({
                    required_error: "is_auth - обязательное поле",
                    invalid_type_error: "is_auth - значение некорректно",
                })
            }),
            target_date: z.preprocess((arg) => {
                if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
              }, z.date()),
            id_wallet_in: z.number({
                required_error: "id_wallet_in - обязательное поле",
                invalid_type_error: "id_wallet_in - значение некорректно",
            }).min(1),
            id_wallet_out: z.number({
                required_error: "id_wallet_out - обязательное поле",
                invalid_type_error: "id_wallet_out - значение некорректно",
            }).min(1),
            money_in: z.number({
                required_error: "money_in - обязательное поле",
                invalid_type_error: "money_in - значение некорректно, минимальная сумма покупки - 1 у.е.",
            }).min(1),
            money_out: z.number({
                required_error: "money_out - обязательное поле",
                invalid_type_error: "money_out - значение некорректно, минимальная сумма продажи - 1 у.е.",
            }).min(1),
        });
        return rules;
    }

    export function validRevokeTrade(): z.ZodObject<any> {

        const rules = z.object({
            user_context: z.object({
                id_user: z.number({
                    required_error: "id_user - обязательное поле",
                    invalid_type_error: "id_user - значение некорректно",
                }).min(1),
                is_auth: z.boolean({
                    required_error: "is_auth - обязательное поле",
                    invalid_type_error: "is_auth - значение некорректно",
                })
            }),
            id_trade: z.number({
                required_error: "id_trade - обязательное поле",
                invalid_type_error: "id_trade - значение некорректно",
            }).min(1),
        });

        return rules;
    }
}