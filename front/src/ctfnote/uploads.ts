import { useUploadLogoMutation } from 'src/generated/graphql';

export function useUploadLogo() {
  const { mutate } = useUploadLogoMutation({});

  return async (logo: File) => {
    const r = await mutate({ logo });
    return r?.data?.uploadCtfLogo;
  };
}
