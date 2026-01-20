"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.preprocess((val) => Number(val), zod_1.z.number().default(3000)),
    DATABASE_URL: zod_1.z.string(),
    JWT_SECRET: zod_1.z.string().min(10),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    ALLOWED_ORIGINS: zod_1.z.string().transform(str => str.split(',')),
});
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.error('❌ Error en variables de entorno:');
    console.error(parsedEnv.error.format());
    process.exit(1);
}
exports.env = parsedEnv.data;
