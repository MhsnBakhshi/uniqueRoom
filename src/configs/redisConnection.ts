import { Redis } from "ioredis";

const redis: Redis = new Redis(process.env.REDIS_URI!);

export { redis };
