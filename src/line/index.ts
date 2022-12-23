import * as qs from "qs";
import axios from "axios";
import dotenv from "dotenv";
import logger from "../logger";
dotenv.config();

export const linePost = async (message: string, lineToken: string) => {
  try {
    const res = await axios({
      method: "post",
      url: "https://notify-api.line.me/api/notify",
      headers: {
        Authorization: `Bearer ${lineToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify({
        message: message,
      }),
    });
  } catch (e: any) {
    const { status, statusText } = e.response;

    logger.error(`Error! HTTP Status: ${status} ${statusText}`);
  }
};
