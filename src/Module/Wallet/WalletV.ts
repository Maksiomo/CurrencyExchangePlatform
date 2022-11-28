import z from "zod";
import { SupportedCurrenciesT } from "../../Infrastructure/PSQL/Entity/WalletE";

export namespace WalletV {
    export function validAddWallet(): z.ZodObject<any> {

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
            currency: z.nativeEnum(SupportedCurrenciesT, {
                required_error: "currency - обязательное поле",
                invalid_type_error: "currency - значение некорректно",
            })
        });

        return rules;
    }

    export function validListWallets(): z.ZodObject<any> {

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
        });

        return rules;
    }

    export function validRefilWallet(): z.ZodObject<any> {

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
            id_wallet: z.number({
                required_error: "id_wallet - обязательное поле",
                invalid_type_error: "id_wallet - значение некорректно",
            }).min(1),
            amount: z.number({
                required_error: "amount - обязательное поле",
                invalid_type_error: "amount - значение некорректно, минимальная сумма пополнения - 1 у.е.",
            }).min(1),
        });

        return rules;
    }
}