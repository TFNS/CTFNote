import { UseQueryReturn, useResult } from '@vue/apollo-composable';
import { DeepNonNullable, DeepRequired } from 'ts-essentials';
import { Ref } from 'vue';
import { notify, notifyError } from './dialog';

export function wrapQuery<D, T, U>(
  query: UseQueryReturn<T, U>,
  def: D,
  wrapper: (data: DeepRequired<DeepNonNullable<T>>) => D
) {
  const result = useResult<T, D, D>(query.result as Ref<T>, def, wrapper);

  const onResult = function (cb: (arg: D) => void) {
    query.onResult((data) => {
      const r = data.data as DeepRequired<DeepNonNullable<T>>;
      return cb(wrapper(r));
    });
  };

  return { ...query, result, onResult };
}

export function wrapNotify<T>(p: Promise<T>, success = ''): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    p.then((r) => {
      notify(success);
      resolve(r);
    }).catch((err: Error) => {
      notifyError(err);
      console.error(err)
      reject(err);
    });
  });
}
