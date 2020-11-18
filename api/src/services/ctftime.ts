import axios from "axios";
import Globals from "../config/globals";
import logger from "../config/logger";

interface ICTFTimeEvent {
  organizers: any[];
  onsite: boolean;
  start: string;
  finish: string;
  description: string;
  weight: number;
  title: string;
  url: string;
  is_votable_now: boolean;
  restrictions: string;
  format: string;
  participants: number;
  ctftime_url: string;
  location: string;
  live_feed: string;
  public_votable: false;
  duraction: any;
  logo: string;
  format_id: number;
  id: number;
  ctf_id: number;
}

export default class CTFTimeService {
  static async getEvent(eventId: number): Promise<ICTFTimeEvent | null> {
    const url = `https://ctftime.org/api/v1/events/${eventId}/`; // The leading slash is important

    let response = null;
    try {
      response = await axios.get(url, {
        headers: { "User-Agent": Globals.userAgent }, // The default axios user-agent is blacklisted by ctftime :/
      });
    } catch (e) {
      logger.fatal(e);
    }

    if (!response) return null;

    return response.data;
  }
}
