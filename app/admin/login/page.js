import { redirect } from 'next/navigation';

/**
 * Single Unified Login Architecture:
 * The separate admin login page is discontinued. All users and administrators
 * authenticate through the single /login portal.
 */
export default function AdminLoginPage() {
  redirect('/login');
}
