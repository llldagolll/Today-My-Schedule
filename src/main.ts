import dotenv from "dotenv";
import {
  getAllUsers,
  getMyScheduleLink,
  getMyScheduleTime,
  getMyScheduleTitle,
  getMyUserId,
} from "./notion";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import { Client } from "@notionhq/client";
import { DateTime } from "luxon";
import { linePost } from "./line";
import { zip } from "lodash";
import logger from "./logger";

dotenv.config();

const isEnv = (ENV: (string | undefined)[]): string[] => {
  const env = ENV.map((v) => {
    if (!v) {
      throw new Error("環境変数が設定されていません");
    }

    return v;
  });

  return env;
};

const main = async () => {
  const [notionToken, databaseId, myName, lineToken] = isEnv([
    process.env.NOTION_TOKEN,
    process.env.DATABASE_ID,
    process.env.NOTION_NAME,
    process.env.LINE_TOKEN,
  ]);

  const notion = new Client({
    auth: notionToken,
  });

  const today = DateTime.now().setZone("Asia/Tokyo").toFormat("yyyy-LL-dd");

  const myUserId = await getAllUsers(notionToken).then((users) =>
    getMyUserId(myName, users)
  );

  const notionDatabaseQuery: QueryDatabaseParameters = {
    database_id: databaseId,
    filter: {
      and: [
        {
          property: "誰",
          people: {
            contains: myUserId,
          },
        },
        {
          property: "日付",
          date: {
            equals: today,
          },
        },
      ],
    },
  };

  type ScheduleTime = string;
  type ScheduleTitle = string;
  type ScheduleLink = string;

  const schedule = (await notion.databases
    .query(notionDatabaseQuery)
    .then((s) => {
      return zip<string>(
        getMyScheduleTime(s),
        getMyScheduleTitle(s),
        getMyScheduleLink(s)
      );
    })) as [ScheduleTime, ScheduleTitle, ScheduleLink][];

  schedule.sort((a, b) => {
    if (a[0] > b[0]) {
      return 1;
    } else {
      return -1;
    }
  });

  let message: string;
  if (schedule.length === 0) {
    message = `
    今日の予定です
    ---------------------------
    なし
  `;
  } else {
    message = `
    今日の予定です
    ---------------------------
    ${schedule.map((s): string => {
      return `${s[0]} ${s[1]} (${s[2]})\n`;
    })}
  `;
  }

  //line
  await linePost(message, lineToken);
};

main()
  .then(() => {
    logger.info("success");
  })
  .catch((err) => {
    logger.error(err);
  });
