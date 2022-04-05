import { ICalCalendar } from "ical-generator";
import { Request, Response, Handler } from "express";
import { Pool } from "pg";
import slugify from "slugify";

type CtfRow = {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  ctf_url: string;
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
      "SELECT id, title, start_time, end_time, ctf_url, description FROM ctfnote.ctf"
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
      
      const proto = req.headers["x-forwarded-proto"] || req.protocol;
      const host = req.headers["x-forwarded-host"] || req.headers.host;
      const ctf_url = `${proto}://${host}/#/ctf/${ctf.id}-${slugify(ctf.title)}/info`;

      console.log(ctf_url);
      cal.createEvent({
        start: ctf.start_time,
        end: ctf.end_time,
        description: ctf.description,
        summary: ctf.title,
        url: ctf_url,
      });
    }

    cal.serve(res);
  };
}
