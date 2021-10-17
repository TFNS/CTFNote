import { InjectionKey, Ref } from 'vue';
import { Me, Settings } from '.';

type StrictKey<T> = InjectionKey<Readonly<Ref<T>>>;

export const MeKey: StrictKey<Me> = Symbol('me');
export const SettingsKey: StrictKey<Settings> = Symbol('settings');
