import {
  PageObjectResponse,
  PartialPageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import axios from "axios";
import dotenv from "dotenv";
import logger from "../logger";
dotenv.config();

export const getAllUsers = async (notionToken: string) => {
  try {
    const res = await axios({
      method: "get",
      url: "https://api.notion.com/v1/users",
      headers: {
        Authorization: `Bearer ${notionToken}`,
        "Notion-Version": "2022-06-28",
      },
    });

    return res.data;
  } catch (e: any) {
    const { status, statusText } = e.response;
    logger.error(`Error! HTTP Status: ${status} ${statusText}`);
  }
};

export const getMyUserId = (myName: string, users: any): string => {
  return users.results.filter((user: any) => user.name === myName)[0].id;
};

export const getMyScheduleTitle = (
  todayMySchedule: QueryDatabaseResponse
): string[] => {
  const myScheduleTitle: (string | undefined)[] = todayMySchedule.results.map(
    (result) => {
      if (!("properties" in result)) return;
      if (!("title" in result.properties.Name)) return;

      return result.properties.Name.title[0].plain_text;
    }
  );

  return myScheduleTitle.filter((title): title is string => !!title);
};

export const getMyScheduleTime = (
  todayMySchedule: QueryDatabaseResponse
): string[] => {
  const myScheduleDate: (string | undefined)[] = todayMySchedule.results.map(
    (result) => {
      if (!("properties" in result)) return;
      if (!("date" in result.properties["日付"])) return;
      return ReturnScheduleTime(result.properties["日付"].date);
    }
  );

  return myScheduleDate.filter((date): date is string => !!date);
};

//公式が型定義をエクスポートしてくれるまでany
function ReturnScheduleTime(date: any): string {
  if (check_date(date.start)) {
    if (date.end == null) return "終日"; // YYYY-MM-DD
    return `${date.start}~${date.end}`; //  YYYY-MM-DD ~ YYYY-MM-DD
  }

  if (date.end === null) {
    const start = date.start.split("T")[1].substr(0, 5);
    return `${start}`;
  } //YYYY-MM-DDT
  const start = date.start.split("T")[1].substr(0, 5);
  const end = date.end.split("T")[1].substr(0, 5);

  return `${start}~${end}`; //YYYY-MM-DDT ~ YYYY-MM-DDT
}

const check_date = (s: string) => {
  if (typeof s == "string") {
    var a = s.match(/^(\d+)\-(\d+)\-(\d+)$/);
    if (a) {
      var y = parseInt(a[1]);
      var m = parseInt(a[2]) - 1;
      var d = parseInt(a[3]);
      var x = new Date(y, m, d);
      return y == x.getFullYear() && m == x.getMonth() && d == x.getDate();
    }
  }
  return false;
};

export const getMyScheduleLink = (
  todayMySchedule: QueryDatabaseResponse
): string[] => {
  const myScheduleLink: (string | undefined)[] = todayMySchedule.results.map(
    (result) => {
      if (!("url" in result)) return;
      return result.url;
    }
  );

  return myScheduleLink.filter((link): link is string => !!link);
};
