import z from "zod";

export namespace AuthV {
    export function validSignIn(): z.ZodObject<any> {

        const rules = z.object({

            login: z.string({
                required_error: "login - обязательное поле",
                invalid_type_error: "login - значение некорректно",
              }).min(5).max(50),

            password: z.string({
                required_error: "password - обязательное поле",
                invalid_type_error: "password - значение некорректно",
              }).min(5).max(100)

        });

        return rules;
    }

    export function validSignUp(): z.ZodObject<any> {

        const rules = z.object({

            login: z.string({
                required_error: "login - обязательное поле",
                invalid_type_error: "login - значение некорректно",
              }).min(5).max(50),

            password: z.string({
                required_error: "password - обязательное поле",
                invalid_type_error: "password - значение некорректно",
              }).min(5).max(100)

        });

        return rules;
    }
}