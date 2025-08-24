'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { BarChart3, Users, UserCheck, Settings } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Usuários', href: '/users', icon: UserCheck, adminOrUser: true },
]

export function Sidebar() {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const filteredNavigation = navigation.filter(item => {
    if (item.adminOrUser) {
      return user?.role === 'ADMIN' || user?.role === 'USER'
    }
    return true
  })

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-screen">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`${
                  isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
              >
                <item.icon
                  className={`${
                    isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                  } mr-3 flex-shrink-0 h-6 w-6`}
                />
                {item.name}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
