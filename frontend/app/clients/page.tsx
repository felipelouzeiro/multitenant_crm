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
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react'

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

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  const { data: clients, isLoading: loadingClients } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await api.get('/clients')
      return response.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (clientId: string) => {
      await api.delete(`/clients/${clientId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Cliente removido com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover cliente')
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingClient(client)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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
          </div>
        </main>
      </div>
    </div>
  )
}
