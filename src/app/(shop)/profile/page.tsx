import { auth } from '@/auth';
import { Title } from '@/components';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect('/');
  }

  return (
    <div className='h-screen'>
      <Title title='Perfil' />
      <div className='flex w-full justify-center mb-5'>
        <Image
          src={`/imgs/user-default.jpg`}
          width={100}
          height={100}
          alt={user.name}
          className='mr-5 rounded-full'
        />
      </div>
      <div className='flex flex-row'>
        <div className='font-bold'>
          <h2>Nombre</h2>
          <h2>Correo</h2>
          <h2>Correo verificado</h2>
          {user.role === 'admin' && <h2>Rol</h2>}
        </div>
        <div className='ml-6'>
          <h2>{user.name}</h2>
          <h2>{user.email}</h2>
          <h2>{user.emailVerified ? 'Si' : 'No'}</h2>
          <h2>{user.role === 'admin' && user.role}</h2>
        </div>
      </div>
    </div>
  );
}
