import { Ctf, Task } from 'src/ctfnote/models';
import slugify from 'slugify';
import ColorHash from 'color-hash';
import { InjectionKey, inject } from 'vue';

const ch = new ColorHash({ saturation: [0.5, 0.75, 1], lightness: 0.3 });

export function colorHash(str: string): string {
  return ch.hex(str + 'TFNS');
}

export function getDate(date_: string | Date): string {
  const date: Date =
    date_.constructor.name == 'Date' ? (date_ as Date) : new Date(date_);
  const y = date.getFullYear();
  const m = `00${date.getMonth() + 1}`.slice(-2);
  const d = `00${date.getDate()}`.slice(-2);
  return `${y}/${m}/${d}`;
}

export function getTime(date_: string | Date): string {
  const date: Date =
    date_.constructor.name == 'Date' ? (date_ as Date) : new Date(date_);
  const h = `00${date.getHours()}`.slice(-2);
  const m = `00${date.getMinutes()}`.slice(-2);
  return `${h}:${m}`;
}

export function getDateTime(date: string | Date) {
  return `${getDate(date)} ${getTime(date)}`;
}

export function ctfLink(ctf: Ctf, name = 'ctf-info') {
  return {
    name,
    params: {
      ctfId: ctf.id,
      ctfSlug: slugify(ctf.title),
    },
  };
}

export function taskLink(ctf: Ctf, task: Task) {
  return {
    name: 'task',
    params: {
      ctfId: ctf.id,
      ctfSlug: slugify(ctf.title),
      taskId: task.id,
      taskSlug: slugify(task.title),
    },
  };
}

export function parseJsonStrict<T extends unknown>(s: string) {
  return JSON.parse(s) as T;
}

export function parseJson<T extends unknown>(s: string): T | null {
  try {
    return parseJsonStrict<T | null>(s);
  } catch (e) {
    return null;
  }
}

export function injectStrict<T>(key: InjectionKey<T>, fallback?: T) {
  const resolved = inject(key, fallback);
  if (!resolved) {
    throw new Error(`Could not resolve ${key.toString()}`);
  }

  return resolved;
}
