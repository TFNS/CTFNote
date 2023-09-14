import { OperationVariables } from '@apollo/client';
import { UseQueryReturn, useResult } from '@vue/apollo-composable';
import ColorHash from 'color-hash';
import { DeepNonNullable, DeepRequired } from 'ts-essentials';
import { inject, InjectionKey, Ref } from 'vue';

export function wrapQuery<D, T, U extends OperationVariables>(
  query: UseQueryReturn<T, U>,
  def: D,
  wrapper: (data: DeepRequired<DeepNonNullable<T>>) => D
) {
  const result = useResult<T, D, D>(query.result as Ref<T>, def, wrapper);

  const onResult = function (cb: (arg: D) => void) {
    query.onResult((data) => {
      if (!data.data) return;
      const r = data.data as DeepRequired<DeepNonNullable<T>>;
      return cb(wrapper(r));
    });
  };

  return { ...query, result, onResult };
}

const ch = new ColorHash({ saturation: [0.5, 0.75, 1], lightness: 0.3 });

export function colorHash(str: string): string {
  return ch.hex(str + 'TFNS');
}

export function injectStrict<T>(key: InjectionKey<T>, fallback?: T) {
  const resolved = inject(key, fallback);
  if (!resolved) {
    throw new Error(`Could not resolve ${key.toString()}`);
  }

  return resolved;
}

export function parseJsonStrict<T>(s: string) {
  return JSON.parse(s) as T;
}

export function parseJson<T>(s: string): T | null {
  try {
    return parseJsonStrict<T | null>(s);
  } catch (e) {
    return null;
  }
}
