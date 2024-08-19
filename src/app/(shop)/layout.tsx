import { Footer, Sidebar, TopMenu } from '@/components';
import { Toaster } from 'react-hot-toast';

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='min-h-screen'>
      <Toaster />
      <TopMenu />
      <Sidebar />
      <div className='px-0 sm:px-10'>{children}</div>
      <Footer />
    </main>
  );
}
