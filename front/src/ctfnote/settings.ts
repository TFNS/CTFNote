import { useApolloClient } from '@vue/apollo-composable';
import {
  AdminSettingsInfoFragment,
  GetSettingsDocument,
  OAuth2SettingsFragment,
  Role,
  SettingPatch,
  SettingsInfoFragment,
  useGetAdminSettingsQuery,
  useGetIcalPasswordQuery,
  useGetOAuth2SettingsQuery,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from 'src/generated/graphql';
import { inject, InjectionKey, provide, Ref } from 'vue';
import {
  AdminSettings,
  defaultColorsNames,
  OAuth2Settings,
  Settings,
  SettingsColorMap,
} from './models';
import { wrapQuery } from './utils';

function parseStyle(s: string): SettingsColorMap {
  const json = Object.assign({}, defaultColors);
  try {
    const r = JSON.parse(s) as SettingsColorMap;
    if (typeof r !== 'object') throw new Error('Invalid');
    for (const name of defaultColorsNames) {
      json[name] = r[name];
    }
  } catch {}
  return json;
}

/* Builders  */

export function buildSettings(
  fragment: Partial<SettingsInfoFragment>,
): Settings {
  return {
    registrationAllowed: fragment.registrationAllowed ?? false,
    registrationPasswordAllowed: fragment.registrationPasswordAllowed ?? false,
    style: parseStyle(fragment.style ?? '{}'),
    discordIntegrationEnabled: fragment.discordIntegrationEnabled ?? false,
    oauth2Enabled: fragment.oauth2Enabled ?? false,
  };
}

export function buildAdminSettings(
  fragment: Partial<AdminSettingsInfoFragment>,
): AdminSettings {
  return {
    ...buildSettings(fragment),
    registrationPassword: fragment.registrationPassword ?? '',
    registrationDefaultRole: fragment.registrationDefaultRole ?? Role.UserGuest,
    style: parseStyle(fragment.style ?? '{}'),
    icalPassword: fragment.icalPassword ?? '',
  };
}

export function buildOAuth2Settings(
  fragment: Partial<OAuth2SettingsFragment>,
): OAuth2Settings {
  return {
    clientId: fragment.clientId ?? '',
    scope: fragment.scope ?? '',
    issuer: fragment.issuer ?? '',
    authorizationEndpoint: fragment.authorizationEndpoint ?? '',
  };
}

/* Prefetch */

export function prefetchSettings() {
  const { client } = useApolloClient();
  return client.query({
    query: GetSettingsDocument,
    fetchPolicy: 'network-only',
  });
}

/* Queries */

export const defaultColors: SettingsColorMap = {
  primary: '#085292',
  secondary: '#26a69a',
  accent: '#9c27b0',
  dark: '#1d1d1d',
  positive: '#2b992f',
  negative: '#c10015',
  info: '#31ccec',
  warning: '#ee7700',
};

let settingsNodeId = '';

export function getSettings() {
  const r = useGetSettingsQuery();

  return wrapQuery(r, buildSettings({}), (data) => {
    settingsNodeId = data.settings.nodes[0].nodeId;
    return buildSettings(data.settings.nodes[0]);
  });
}

export function getAdminSettings() {
  const r = useGetAdminSettingsQuery();

  return wrapQuery(r, buildAdminSettings({}), (data) => {
    settingsNodeId = data.settings.nodes[0].nodeId;
    return buildAdminSettings(data.settings.nodes[0]);
  });
}

export function getIcalPassword() {
  const r = useGetIcalPasswordQuery();
  return wrapQuery(r, 'no pass', (data) => {
    return data.settings.nodes[0].icalPassword;
  });
}

export function getOAuth2Settings() {
  const r = useGetOAuth2SettingsQuery();
  return wrapQuery(r, buildOAuth2Settings({}), (data) => {
    return buildOAuth2Settings(data.oauth2Settings);
  });
}

/* Mutations */

export function useUpdateSettings() {
  const { mutate: doUpdateSettings } = useUpdateSettingsMutation({});
  return async (patch: SettingPatch) =>
    doUpdateSettings({ nodeId: settingsNodeId, patch });
}

/* Global provider  */

const SettingsSymbol: InjectionKey<Ref<Settings>> = Symbol('settings');

export function provideSettings() {
  const { result: settings } = getSettings();
  provide(SettingsSymbol, settings);
  return settings;
}

export function injectSettings() {
  const settings = inject(SettingsSymbol);
  if (!settings) {
    throw new Error('injectSettings ERROR');
  }

  return settings;
}
