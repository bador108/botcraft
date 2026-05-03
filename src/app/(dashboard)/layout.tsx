import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/sidebar'
import { createServiceClient } from '@/lib/supabase'
import { OWNER_EMAIL } from '@/lib/plans'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  // Auto-create Supabase user on first login
  const db = createServiceClient()
  const { data: existing } = await db.from('users').select('id, email, plan').eq('id', userId).single()
  if (!existing) {
    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses[0]?.emailAddress ?? ''
    await db.from('users').insert({
      id: userId,
      email,
      full_name: `${clerkUser?.firstName ?? ''} ${clerkUser?.lastName ?? ''}`.trim(),
      plan: email === OWNER_EMAIL ? 'enterprise' : 'hobby',
    })
  } else if (existing.email === OWNER_EMAIL && existing.plan !== 'enterprise') {
    // Oprava plánu vlastníka při každém načtení dokud není v DB správně
    await db.from('users').update({ plan: 'enterprise' }).eq('id', userId)
  }

  return (
    <div className="flex min-h-screen bg-bone">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0">
        <div className="max-w-5xl mx-auto px-5 py-8 md:px-8 md:py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
