import request from "request";
import jwt from "jsonwebtoken";
import { redis } from "../configs/redisConnection";

const getOtpRedisPattern = (phone: string) => {
  return `otp:${phone}`;
};
const getOtpDetails = async (phone: string) => {
  const otp = await redis.get(getOtpRedisPattern(phone));

  if (!otp) {
    return {
      expired: true,
      remainingTime: 0,
    };
  }
  const remainingTime = await redis.ttl(getOtpRedisPattern(phone));
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return {
    expired: false,
    remainingTime: formattedTime,
  };
};
const generateOtpCode = async (phone: string, expiredTime: number) => {
  let otp: number = Math.floor(Math.random() * 999999);

  otp = 123456;
  await redis.set(getOtpRedisPattern(phone), otp, "EX", expiredTime * 60);

  return otp;
};
const cachOtpFromRedis = async (phone: string) => {
  const otp = await redis.get(getOtpRedisPattern(phone));

  if (!otp) {
    return false;
  } else {
    return otp;
  }
};
const sendSMS = (phone: string, otp: number) => {
  request.post(
    {
      url: "http://ippanel.com/api/select",
      body: {
        op: "pattern",
        user: process.env.FARAZSMSUSER!,
        pass: process.env.FARAZSMSPASSWORD!,
        fromNum: +process.env.FARAZSMSNUMBER!,
        toNum: phone,
        patternCode: process.env.FARAZSMSPATTERNCODE!,
        inputData: [{ "login-code": otp }],
      },
      json: true,
    },
    function (error, response, body) {
      if (!error && response.statusCode === 200) {
        if (
          typeof response.body !== "number" &&
          Number(response.body[0]) !== 0
        ) {
          throw new Error(response.body[1]);
        }
        return true;
      }
    }
  );
};

const generateToken = (userId: string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY!, {
    expiresIn: "365d",
  });

  return token;
};

const createPaginationData = (
  page: number,
  limit: number,
  totalCount: number,
  collectionName: string
) => ({
  page,
  limit,
  totalPage: Math.ceil(totalCount / limit),
  ["total" + collectionName]: totalCount,
});

export {
  getOtpRedisPattern,
  getOtpDetails,
  cachOtpFromRedis,
  generateOtpCode,
  sendSMS,
  generateToken,
  createPaginationData,
};
