'use client';
import { login, registerUser } from '@/actions';
import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type FormInputs = {
  name: string;
  email: string;
  password: string;
};

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const { name, email, password } = data;
    setErrorMessage('');
    setLoading(true);

    const resp = await registerUser(name, email, password);
    console.log(resp);

    if (!resp.ok) {
      setErrorMessage(resp.message);
      return;
    }

    await login(email.toLowerCase(), password);

    setLoading(false);
    window.location.replace('/');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
      <label htmlFor='email'>Nombre completo</label>
      <input
        className={clsx('px-5 py-2 rounded mb-2 border-2 border-blue-100', {
          'border-red-500': errors.name,
        })}
        type='text'
        {...register('name', { required: 'El nombre es requerido' })}
      />
      <span className='text-xs text-red-500 mb-2'>{errors.name?.message}</span>

      <label htmlFor='email'>Correo electrónico</label>
      <input
        className={clsx('px-5 py-2 rounded mb-2 border-2 border-blue-100', {
          'border-red-500': errors.email,
        })}
        type='email'
        {...register('email', {
          required: 'El correo es requerido',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Correo invalido',
          },
        })}
      />
      <span className='text-xs text-red-500 mb-2'>{errors.email?.message}</span>

      <label htmlFor='email'>Contraseña</label>
      <input
        className={clsx('px-5 py-2 rounded mb-2 border-2 border-blue-100', {
          'border-red-500': errors.password,
        })}
        type='password'
        {...register('password', { required: 'La contraseña es requerida' })}
      />
      <span className='text-xs text-red-500 mb-2'>
        {errors.password?.message}
      </span>

      <button className='btn-primary'>Crear cuenta</button>
      <span className='text-xs text-red-500 my-2'>{errorMessage}</span>

      {/* divisor l ine */}
      <div className='flex items-center my-5'>
        <div className='flex-1 border-t border-gray-500'></div>
        <div className='px-2 text-gray-800'>O</div>
        <div className='flex-1 border-t border-gray-500'></div>
      </div>

      <Link
        href='/auth/login'
        className={clsx('btn-secondary text-center', {
          'bg-gray-500': loading,
        })}
      >
        {loading ? 'Cargando' : 'Ingresar'}
      </Link>
    </form>
  );
};
