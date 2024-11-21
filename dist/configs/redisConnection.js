"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = require("ioredis");
const redis = new ioredis_1.Redis(process.env.REDIS_URI);
exports.redis = redis;
