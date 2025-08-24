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
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { validateClient, validateClientEdit, ValidationErrors } from '@/lib/validation'

interface Client {
  id: string
  publicId: string
  name: string
  email: string
  isActive: boolean
  contact: string
  address: {
    street: string
    neighborhood: string
    number: string
    state: string
  }
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export default function ClientsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    contact: '',
    isActive: true,
    address: {
      street: '',
      neighborhood: '',
      number: '',
      state: ''
    }
  })
  const [errors, setErrors] = useState<ValidationErrors>({})

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  const { data: clients, isLoading: loadingClients } = useQuery<Client[]>({
    queryKey: ['clients', user?.tenantId],
    queryFn: async () => {
      const response = await api.get('/clients')
      return response.data
    },
    enabled: !!user?.tenantId,
  })

  const deleteMutation = useMutation({
    mutationFn: async (clientId: string) => {
      await api.delete(`/clients/${clientId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', user?.tenantId] })
      toast.success('Cliente removido com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover cliente')
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Client> }) => {
      const validationErrors = validateClientEdit({
        name: data.name || '',
        email: data.email || '',
        contact: data.contact || '',
        address: data.address || { street: '', neighborhood: '', number: '', state: '' }
      })
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        throw new Error('Validação falhou')
      }
      setErrors({})
      await api.patch(`/clients/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', user?.tenantId] })
      toast.success('Cliente atualizado com sucesso!')
      setEditingClient(null)
      setErrors({})
    },
    onError: (error) => {
      if (error.message !== 'Validação falhou') {
        toast.error('Erro ao atualizar cliente')
      }
    },
  })

  const createMutation = useMutation({
    mutationFn: async (clientData: typeof newClient) => {
      const validationErrors = validateClient(clientData)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        throw new Error('Validação falhou')
      }
      setErrors({})
      await api.post('/clients', clientData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', user?.tenantId] })
      toast.success('Cliente criado com sucesso!')
      setShowCreateModal(false)
      setNewClient({
        name: '',
        email: '',
        contact: '',
        isActive: true,
        address: { street: '', neighborhood: '', number: '', state: '' }
      })
      setErrors({})
    },
    onError: (error) => {
      if (error.message !== 'Validação falhou') {
        toast.error('Erro ao criar cliente')
      }
    },
  })

  const filteredClients = clients?.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
              {(user.role === 'ADMIN' || user.role === 'USER') && (
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              )}
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </div>

            {loadingClients ? (
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
                {filteredClients.map((client) => (
                  <Card key={client.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{client.name}</CardTitle>
                          <CardDescription>{client.email}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {(user.role === 'ADMIN' || user.role === 'USER') && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingClient(client)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteMutation.mutate(client.id)}
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
                        <p><strong>ID:</strong> {client.publicId}</p>
                        <p><strong>Status:</strong> 
                          <span className={`ml-1 px-2 py-1 rounded text-xs ${
                            client.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {client.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </p>
                        {client.contact && (
                          <p><strong>Contato:</strong> {client.contact}</p>
                        )}
                        <p><strong>Endereço:</strong> {client.address.street}, {client.address.number}</p>
                        <p><strong>Bairro:</strong> {client.address.neighborhood}</p>
                        <p><strong>Estado:</strong> {client.address.state}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredClients.length === 0 && !loadingClients && (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum cliente encontrado.</p>
              </div>
            )}

            {/* Modal de Criação */}
            {showCreateModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">Criar Novo Cliente</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome
                      </label>
                                             <Input
                         value={newClient.name}
                         onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
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
                         value={newClient.email}
                         onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                         placeholder="Digite o email"
                         className={errors.email ? 'border-red-500' : ''}
                       />
                       {errors.email && (
                         <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                       )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contato
                      </label>
                                             <Input
                         value={newClient.contact}
                         onChange={(e) => setNewClient({ ...newClient, contact: e.target.value })}
                         placeholder="Digite o contato"
                         className={errors.contact ? 'border-red-500' : ''}
                       />
                       {errors.contact && (
                         <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
                       )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rua
                      </label>
                                             <Input
                         value={newClient.address.street}
                         onChange={(e) => setNewClient({ 
                           ...newClient, 
                           address: { ...newClient.address, street: e.target.value }
                         })}
                         placeholder="Digite a rua"
                         className={errors.street ? 'border-red-500' : ''}
                       />
                       {errors.street && (
                         <p className="text-red-500 text-xs mt-1">{errors.street}</p>
                       )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número
                      </label>
                                             <Input
                         value={newClient.address.number}
                         onChange={(e) => setNewClient({ 
                           ...newClient, 
                           address: { ...newClient.address, number: e.target.value }
                         })}
                         placeholder="Digite o número"
                         className={errors.number ? 'border-red-500' : ''}
                       />
                       {errors.number && (
                         <p className="text-red-500 text-xs mt-1">{errors.number}</p>
                       )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bairro
                      </label>
                                             <Input
                         value={newClient.address.neighborhood}
                         onChange={(e) => setNewClient({ 
                           ...newClient, 
                           address: { ...newClient.address, neighborhood: e.target.value }
                         })}
                         placeholder="Digite o bairro"
                         className={errors.neighborhood ? 'border-red-500' : ''}
                       />
                       {errors.neighborhood && (
                         <p className="text-red-500 text-xs mt-1">{errors.neighborhood}</p>
                       )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                      </label>
                                             <select
                         value={newClient.address.state}
                         onChange={(e) => setNewClient({ 
                           ...newClient, 
                           address: { ...newClient.address, state: e.target.value }
                         })}
                         className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                           errors.state ? 'border-red-500' : 'border-gray-300'
                         }`}
                       >
                         <option value="">Selecione o estado</option>
                         <option value="AC">Acre</option>
                         <option value="AL">Alagoas</option>
                         <option value="AP">Amapá</option>
                         <option value="AM">Amazonas</option>
                         <option value="BA">Bahia</option>
                         <option value="CE">Ceará</option>
                         <option value="DF">Distrito Federal</option>
                         <option value="ES">Espírito Santo</option>
                         <option value="GO">Goiás</option>
                         <option value="MA">Maranhão</option>
                         <option value="MT">Mato Grosso</option>
                         <option value="MS">Mato Grosso do Sul</option>
                         <option value="MG">Minas Gerais</option>
                         <option value="PA">Pará</option>
                         <option value="PB">Paraíba</option>
                         <option value="PR">Paraná</option>
                         <option value="PE">Pernambuco</option>
                         <option value="PI">Piauí</option>
                         <option value="RJ">Rio de Janeiro</option>
                         <option value="RN">Rio Grande do Norte</option>
                         <option value="RS">Rio Grande do Sul</option>
                         <option value="RO">Rondônia</option>
                         <option value="RR">Roraima</option>
                         <option value="SC">Santa Catarina</option>
                         <option value="SP">São Paulo</option>
                         <option value="SE">Sergipe</option>
                         <option value="TO">Tocantins</option>
                       </select>
                       {errors.state && (
                         <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                       )}
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newClient.isActive}
                          onChange={(e) => setNewClient({ ...newClient, isActive: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Ativo</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                                         <Button
                       onClick={() => createMutation.mutate(newClient)}
                       disabled={createMutation.isPending}
                     >
                      {createMutation.isPending ? 'Criando...' : 'Criar Cliente'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateModal(false)
                        setNewClient({
                          name: '',
                          email: '',
                          contact: '',
                          isActive: true,
                          address: { street: '', neighborhood: '', number: '', state: '' }
                        })
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
            {editingClient && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">Editar Cliente</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome
                      </label>
                                             <Input
                         value={editingClient.name}
                         onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
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
                         value={editingClient.email}
                         onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                         className={errors.email ? 'border-red-500' : ''}
                       />
                       {errors.email && (
                         <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                       )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contato
                      </label>
                                             <Input
                         value={editingClient.contact}
                         onChange={(e) => setEditingClient({ ...editingClient, contact: e.target.value })}
                         className={errors.contact ? 'border-red-500' : ''}
                       />
                       {errors.contact && (
                         <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
                       )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rua
                      </label>
                                             <Input
                         value={editingClient.address.street}
                         onChange={(e) => setEditingClient({ 
                           ...editingClient, 
                           address: { ...editingClient.address, street: e.target.value }
                         })}
                         className={errors.street ? 'border-red-500' : ''}
                       />
                       {errors.street && (
                         <p className="text-red-500 text-xs mt-1">{errors.street}</p>
                       )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número
                      </label>
                                             <Input
                         value={editingClient.address.number}
                         onChange={(e) => setEditingClient({ 
                           ...editingClient, 
                           address: { ...editingClient.address, number: e.target.value }
                         })}
                         className={errors.number ? 'border-red-500' : ''}
                       />
                       {errors.number && (
                         <p className="text-red-500 text-xs mt-1">{errors.number}</p>
                       )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bairro
                      </label>
                                             <Input
                         value={editingClient.address.neighborhood}
                         onChange={(e) => setEditingClient({ 
                           ...editingClient, 
                           address: { ...editingClient.address, neighborhood: e.target.value }
                         })}
                         className={errors.neighborhood ? 'border-red-500' : ''}
                       />
                       {errors.neighborhood && (
                         <p className="text-red-500 text-xs mt-1">{errors.neighborhood}</p>
                       )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                      </label>
                                             <select
                         value={editingClient.address.state}
                         onChange={(e) => setEditingClient({ 
                           ...editingClient, 
                           address: { ...editingClient.address, state: e.target.value }
                         })}
                         className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                           errors.state ? 'border-red-500' : 'border-gray-300'
                         }`}
                       >
                         <option value="">Selecione o estado</option>
                         <option value="AC">Acre</option>
                         <option value="AL">Alagoas</option>
                         <option value="AP">Amapá</option>
                         <option value="AM">Amazonas</option>
                         <option value="BA">Bahia</option>
                         <option value="CE">Ceará</option>
                         <option value="DF">Distrito Federal</option>
                         <option value="ES">Espírito Santo</option>
                         <option value="GO">Goiás</option>
                         <option value="MA">Maranhão</option>
                         <option value="MT">Mato Grosso</option>
                         <option value="MS">Mato Grosso do Sul</option>
                         <option value="MG">Minas Gerais</option>
                         <option value="PA">Pará</option>
                         <option value="PB">Paraíba</option>
                         <option value="PR">Paraná</option>
                         <option value="PE">Pernambuco</option>
                         <option value="PI">Piauí</option>
                         <option value="RJ">Rio de Janeiro</option>
                         <option value="RN">Rio Grande do Norte</option>
                         <option value="RS">Rio Grande do Sul</option>
                         <option value="RO">Rondônia</option>
                         <option value="RR">Roraima</option>
                         <option value="SC">Santa Catarina</option>
                         <option value="SP">São Paulo</option>
                         <option value="SE">Sergipe</option>
                         <option value="TO">Tocantins</option>
                       </select>
                       {errors.state && (
                         <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                       )}
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingClient.isActive}
                          onChange={(e) => setEditingClient({ ...editingClient, isActive: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Ativo</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <Button
                      onClick={() => updateMutation.mutate({ 
                        id: editingClient.id, 
                        data: { 
                          name: editingClient.name, 
                          email: editingClient.email,
                          contact: editingClient.contact,
                          address: editingClient.address,
                          isActive: editingClient.isActive
                        } 
                      })}
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingClient(null)}
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
  )
}
