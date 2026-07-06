import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin-dashboard';
import { isAdminSession } from '@/lib/auth';
import { getProducts } from '@/lib/products';

export default async function AdminPage() {
  if (!isAdminSession()) {
    redirect('/admin/login');
  }

  const products = await getProducts();

  return <AdminDashboard initialProducts={products} />;
}
