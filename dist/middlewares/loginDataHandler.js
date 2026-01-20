"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginDataHandler = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginDataHandler = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.loginDataHandler = loginDataHandler;
