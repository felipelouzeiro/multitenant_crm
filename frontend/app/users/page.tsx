'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2, Eye, Shield } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'USER' | 'GUEST'
  tenantId: string
  createdAt: string
  updatedAt: string
}

export default function UsersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router]);

  const { data: users, isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users')
      return response.data
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/users/${userId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Usuário removido com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover usuário')
    },
  });

  const filteredUsers = users?.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800'
      case 'USER':
        return 'bg-blue-100 text-blue-800'
      case 'GUEST':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
              {user.role === 'ADMIN' && (
                <Button onClick={() => toast('Funcionalidade de criação em desenvolvimento')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              )}
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </div>

            {loadingUsers ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((userItem) => (
                  <Card key={userItem.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{userItem.name}</CardTitle>
                          <CardDescription>{userItem.email}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toast('Funcionalidade de visualização em desenvolvimento')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {user.role === 'ADMIN' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toast('Funcionalidade de edição em desenvolvimento')}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteMutation.mutate(userItem.id)}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p><strong>ID:</strong> {userItem.id}</p>
                        <p><strong>Role:</strong> 
                          <span className={`ml-1 px-2 py-1 rounded text-xs ${getRoleColor(userItem.role)}`}>
                            {userItem.role}
                          </span>
                        </p>
                        <p><strong>Tenant ID:</strong> {userItem.tenantId}</p>
                        <p><strong>Criado em:</strong> {new Date(userItem.createdAt).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Atualizado em:</strong> {new Date(userItem.updatedAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredUsers.length === 0 && !loadingUsers && (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum usuário encontrado.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
