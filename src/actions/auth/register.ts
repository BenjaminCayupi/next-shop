'use server';

import prisma from '@/lib/prisma';
import bcryptjs from 'bcryptjs';

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const userExist = await prisma.user.findUnique({ where: { email } });

    if (userExist)
      return {
        ok: false,
        message: 'Ya existe un usuario con ese correo.',
      };

    const createdUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: bcryptjs.hashSync(password),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return {
      ok: true,
      message: 'Usuario creado.',
      user: createdUser,
    };
  } catch (error) {
    console.log('error :', error);
    return {
      ok: false,
      message: 'Ocurrio un error al registrar el usuario.',
    };
  }
};
