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
import { Plus, Edit, Trash2, Shield } from 'lucide-react'
import { validateUser, ValidationErrors } from '@/lib/validation'

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
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER' as 'ADMIN' | 'USER' | 'GUEST'
  })
  const [errors, setErrors] = useState<ValidationErrors>({})

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router]);

  const { data: users, isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ['users', user?.tenantId],
    queryFn: async () => {
      const response = await api.get('/users')
      return response.data
    },
    enabled: !!user?.tenantId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/users/${userId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', user?.tenantId] })
      toast.success('Usuário removido com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover usuário')
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      const validationErrors = validateUser({
        name: data.name || '',
        email: data.email || '',
        password: '',
        role: data.role || 'USER'
      }, true)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        throw new Error('Validação falhou')
      }
      setErrors({})
      await api.patch(`/users/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', user?.tenantId] })
      toast.success('Usuário atualizado com sucesso!')
      setEditingUser(null)
      setErrors({})
    },
    onError: (error) => {
      if (error.message !== 'Validação falhou') {
        toast.error('Erro ao atualizar usuário')
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: async (userData: typeof newUser) => {
      const validationErrors = validateUser(userData)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        throw new Error('Validação falhou')
      }
      setErrors({})
      await api.post('/users', userData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', user?.tenantId] })
      toast.success('Usuário criado com sucesso!')
      setShowCreateModal(false)
      setNewUser({ name: '', email: '', password: '', role: 'USER' })
      setErrors({})
    },
    onError: (error) => {
      if (error.message !== 'Validação falhou') {
        toast.error('Erro ao criar usuário')
      }
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
                <Button onClick={() => setShowCreateModal(true)}>
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

                          {user.role === 'ADMIN' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingUser(userItem)}
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

            {/* Modal de Criação */}
            {showCreateModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">Criar Novo Usuário</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome
                      </label>
                                             <Input
                         value={newUser.name}
                         onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                         placeholder="Digite o nome"
                         className={errors.name ? 'border-red-500' : ''}
                       />
                       {errors.name && (
                         <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                       )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                                             <Input
                         type="email"
                         value={newUser.email}
                         onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                         placeholder="Digite o email"
                         className={errors.email ? 'border-red-500' : ''}
                       />
                       {errors.email && (
                         <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                       )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Senha
                      </label>
                                             <Input
                         type="password"
                         value={newUser.password}
                         onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                         placeholder="Digite a senha"
                         className={errors.password ? 'border-red-500' : ''}
                       />
                       {errors.password && (
                         <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                       )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                                             <select
                         value={newUser.role}
                         onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                         className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                           errors.role ? 'border-red-500' : 'border-gray-300'
                         }`}
                       >
                         <option value="ADMIN">ADMIN</option>
                         <option value="USER">USER</option>
                         <option value="GUEST">GUEST</option>
                       </select>
                       {errors.role && (
                         <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                       )}
                       {errors.role && (
                         <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                       )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                                         <Button
                       onClick={() => createMutation.mutate(newUser)}
                       disabled={createMutation.isPending}
                     >
                      {createMutation.isPending ? 'Criando...' : 'Criar Usuário'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateModal(false)
                        setNewUser({ name: '', email: '', password: '', role: 'USER' })
                      }}
                      disabled={createMutation.isPending}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal de Edição */}
            {editingUser && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">Editar Usuário</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome
                      </label>
                                             <Input
                         value={editingUser.name}
                         onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                         className={errors.name ? 'border-red-500' : ''}
                       />
                       {errors.name && (
                         <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                       )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                                             <Input
                         value={editingUser.email}
                         onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                         className={errors.email ? 'border-red-500' : ''}
                       />
                       {errors.email && (
                         <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                       )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                                             <select
                         value={editingUser.role}
                         onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                         className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                           errors.role ? 'border-red-500' : 'border-gray-300'
                         }`}
                       >
                        <option value="ADMIN">ADMIN</option>
                        <option value="USER">USER</option>
                        <option value="GUEST">GUEST</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <Button
                      onClick={() => updateMutation.mutate({ 
                        id: editingUser.id, 
                        data: { 
                          name: editingUser.name, 
                          email: editingUser.email, 
                          role: editingUser.role 
                        } 
                      })}
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingUser(null)}
                      disabled={updateMutation.isPending}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
