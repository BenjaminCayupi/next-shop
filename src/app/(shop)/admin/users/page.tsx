export const dynamic = 'force-dynamic';

import { getPaginatedOrders, getPaginatedUsers } from '@/actions';
import { Pagination, Title } from '@/components';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { IoCardOutline } from 'react-icons/io5';
import { UsersTable } from './ui/UsersTable';

interface Props {
  searchParams: { page: string };
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { ok, users = [], totalPages } = await getPaginatedUsers({ page });

  if (!ok) {
    redirect('/auth/login');
  }

  return (
    <>
      <Title title='Mantenedor usuarios' />
      <UsersTable users={users} totalPages={totalPages} />
    </>
  );
}
