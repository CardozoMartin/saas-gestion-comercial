"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.disconnectDatabase = exports.connectDatabase = void 0;
const client_1 = require("@prisma/client");
const env_1 = require("./env");
const prisma = new client_1.PrismaClient({
    log: env_1.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
exports.prisma = prisma;
const connectDatabase = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully');
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async () => {
    await prisma.$disconnect();
};
exports.disconnectDatabase = disconnectDatabase;
