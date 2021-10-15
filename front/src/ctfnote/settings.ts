import {
  AdminSettingsInfoFragment,
  Role,
  SettingPatch,
  SettingsInfoFragment,
  useGetAdminSettingsQuery,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from 'src/generated/graphql';
import {
  AdminSettings,
  defaultColorsNames,
  Settings,
  SettingsColorMap,
} from '.';
import { wrapQuery } from './utils';

function parseStyle(s: string): SettingsColorMap {
  const json = Object.assign({}, defaultColors);
  try {
    const r = JSON.parse(s) as SettingsColorMap;
    if (typeof r !== 'object') throw 'Invalid';
    for (const name of defaultColorsNames) {
      json[name] = r[name];
    }
  } catch {}
  return json;
}

/* Builders  */

export function buildSettings(
  fragment: Partial<SettingsInfoFragment>
): Settings {
  return {
    registrationAllowed: fragment.registrationAllowed ?? false,
    registrationPasswordAllowed: fragment.registrationPasswordAllowed ?? false,
    style: parseStyle(fragment.style ?? '{}'),
  };
}

export function buildAdminSettings(
  fragment: Partial<AdminSettingsInfoFragment>
): AdminSettings {
  return {
    ...buildSettings(fragment),
    registrationPassword: fragment.registrationPassword ?? '',
    registrationDefaultRole: fragment.registrationDefaultRole ?? Role.UserGuest,
    style: parseStyle(fragment.style ?? '{}'),
  };
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

/* Mutations */

export function updateSettings(patch: SettingPatch) {
  const { mutate: doUpdateSettings } = useUpdateSettingsMutation({});
  return doUpdateSettings({ nodeId: settingsNodeId, patch });
}
