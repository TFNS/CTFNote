import { InjectionKey, Ref } from 'vue';
import { Me, Profile, Settings } from '.';

type StrictKey<T> = InjectionKey<Readonly<Ref<T>>>;

export const MeKey: StrictKey<Me> = Symbol('me');
export const SettingsKey: StrictKey<Settings> = Symbol('settings');
export const TeamKey: StrictKey<Profile[]> = Symbol('team');
