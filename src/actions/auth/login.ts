'use server';

import { signIn } from '@/auth';

// ...

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false,
    });

    return 'success';
  } catch (error) {
    return 'CredentialsSignin';
  }
}

export const login = async (email: string, password: string) => {
  try {
    await signIn('credentials', {
      email,
      password,
    });

    return {
      ok: true,
      message: 'Usuario logueado.',
    };
  } catch (error) {
    console.log('error :', error);
    return {
      ok: false,
      message: 'Hubo un error al hacer login.',
    };
  }
};
