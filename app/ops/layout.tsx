import { redirect } from 'next/navigation'
import { getServerUser } from '@/lib/supabase-server'
import OpsShell from './components/OpsShell'

export const metadata = {
  title: 'SEG Response Tool',
}

export default async function OpsLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser()
  if (!user) {
    redirect('/ops-login')
  }
  return (
    <OpsShell userEmail={user.email ?? ''}>
      {children}
    </OpsShell>
  )
}
