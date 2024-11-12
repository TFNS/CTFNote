import { Ref, watch } from 'vue';

declare type StoredSettingsExtension = {
  makePersistant: <T>(name: string, ref: Ref<T>) => Ref<T>;
};

const PREFIX = 'settings-';

function getKeyName(name: string) {
  return `${PREFIX}${name}`;
}

function load<T>(name: string, def: T): T {
  const val = (localStorage.getItem(getKeyName(name)) as string) ?? null;
  if (typeof val !== 'string') {
    return def;
  }
  try {
    return JSON.parse(val) as T;
  } catch {
    return def;
  }
}

function save<T>(name: string, val: T) {
  localStorage.setItem(getKeyName(name), JSON.stringify(val));
}

export const useStoredSettings = (): StoredSettingsExtension => {
  const makePersistant = <T>(name: string, r: Ref<T>) => {
    const val = load(name, r.value);
    if (val !== null) {
      r.value = val;
    }
    watch(
      () => r.value,
      (v) => save(name, v),
    );
    return r;
  };

  return {
    makePersistant,
  };
};
