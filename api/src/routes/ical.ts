import { ICalCalendar } from "ical-generator";
import { Request, Response, Handler } from "express";
import { Pool } from "pg";
import config from "../config";

type CtfRow = {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  ctf_url: string;
  ctftime_url: string;
  description: string;
};

type IcalPasswordRow = {
  ical_password: string;
};

export function icalRoute(pool: Pool): Handler {
  async function checkIcalPassword(
    userPass: string | undefined
  ): Promise<boolean> {
    const r = await pool.query<IcalPasswordRow>(
      "SELECT ical_password FROM ctfnote.settings"
    );
    const db_password = r.rows[0].ical_password;
    // If the password is null or empty allow any user
    if (!db_password) return true;
    return db_password === userPass;
  }

  async function getCtfs(): Promise<CtfRow[]> {
    const r = await pool.query<CtfRow>(
      "SELECT id, title, start_time, end_time, ctf_url, ctftime_url, description FROM ctfnote.ctf"
    );

    return r.rows;
  }

  return async function (req: Request, res: Response): Promise<void> {
    const { key } = req.query;

    if (
      !(typeof key == "string" || key == undefined) ||
      !(await checkIcalPassword(key))
    ) {
      res.status(403);
      res.send("Forbidden\n");
      return;
    }

    const cal = new ICalCalendar();
    const ctfs = await getCtfs();

    for (const ctf of ctfs) {
      const ctftime_id = ctf.ctftime_url?.replace(/\/$/, "").split("/").at(-1);
      cal.createEvent({
        id: `${ctf.id}:${ctftime_id || "no-ctftime"}@${config.pad.domain || "ctfnote"}`,
        start: ctf.start_time,
        end: ctf.end_time,
        description: ctf.description,
        summary: ctf.title,
        url: ctf.ctf_url,
        attachments: ctf.ctftime_url ? [ctf.ctftime_url] : [],
      });
    }

    res.write(cal.toString());
    res.end();
  };
}
