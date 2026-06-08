import { useEffect, useState } from 'react'
import { venueService } from '@/services/venues'
import { useToast } from '@/components/ui/toast'
import type { Venue } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { Plus, Pencil, Trash2, X, Check, MapPin, Star } from 'lucide-react'

export function VenueManagementPage() {
  const { addToast } = useToast()
  const [venues, setVenues] = useState<Venue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    type: 'futsal' as 'futsal' | 'mini-soccer',
    price: 0,
    rating: 4.5,
    description: '',
    images: [''],
    facilities: [''],
  })

  const fetchVenues = async () => {
    try {
      const data = await venueService.getVenues()
      setVenues(data)
    } catch (error) {
      console.error('Failed to fetch venues:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVenues()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const venueData = {
        ...formData,
        images: formData.images.filter((img) => img.trim() !== ''),
        facilities: formData.facilities.filter((f) => f.trim() !== ''),
      }
      if (editingId) {
        await venueService.updateVenue(editingId, venueData)
        addToast('Venue berhasil diupdate', 'success')
      } else {
        await venueService.createVenue(venueData)
        addToast('Venue berhasil ditambahkan', 'success')
      }
      setShowForm(false)
      setEditingId(null)
      resetForm()
      fetchVenues()
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Gagal menyimpan', 'error')
    }
  }

  const handleEdit = (venue: Venue) => {
    setFormData({
      name: venue.name,
      city: venue.city,
      address: venue.address,
      type: venue.type,
      price: venue.price,
      rating: venue.rating,
      description: venue.description,
      images: venue.images.length > 0 ? venue.images : [''],
      facilities: venue.facilities.length > 0 ? venue.facilities : [''],
    })
    setEditingId(venue.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus venue ini?')) return
    try {
      await venueService.deleteVenue(id)
      addToast('Venue berhasil dihapus', 'success')
      fetchVenues()
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Gagal menghapus', 'error')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      city: '',
      address: '',
      type: 'futsal',
      price: 0,
      rating: 4.5,
      description: '',
      images: [''],
      facilities: [''],
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Kelola Venue</h1>
          <p className="text-gray-600 mt-1">Tambah, edit, atau hapus venue</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setEditingId(null)
            setShowForm(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Venue
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Venue' : 'Tambah Venue Baru'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Venue</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Masukkan nama venue"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Kota</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Masukkan kota"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Masukkan alamat"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipe</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'futsal' | 'mini-soccer' })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="futsal">Futsal</option>
                    <option value="mini-soccer">Mini Soccer</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Harga per Jam (Rp)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="Masukkan harga"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Masukkan deskripsi venue"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>URL Gambar</Label>
                {formData.images.map((img, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={img}
                      onChange={(e) => {
                        const newImages = [...formData.images]
                        newImages[index] = e.target.value
                        setFormData({ ...formData, images: newImages })
                      }}
                      placeholder="URL gambar"
                    />
                    {formData.images.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            images: formData.images.filter((_, i) => i !== index),
                          })
                        }}
                      >
                        <X size={14} />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                >
                  <Plus size={14} className="mr-2" />
                  Tambah Gambar
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Fasilitas</Label>
                {formData.facilities.map((facility, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={facility}
                      onChange={(e) => {
                        const newFacilities = [...formData.facilities]
                        newFacilities[index] = e.target.value
                        setFormData({ ...formData, facilities: newFacilities })
                      }}
                      placeholder="Nama fasilitas"
                    />
                    {formData.facilities.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            facilities: formData.facilities.filter((_, i) => i !== index),
                          })
                        }}
                      >
                        <X size={14} />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ ...formData, facilities: [...formData.facilities, ''] })}
                >
                  <Plus size={14} className="mr-2" />
                  Tambah Fasilitas
                </Button>
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  <Check className="mr-2 h-4 w-4" />
                  {editingId ? 'Update' : 'Simpan'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                    resetForm()
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {venues.map((venue) => (
          <Card key={venue.id}>
            <div className="relative h-40 overflow-hidden rounded-t-lg">
              <img
                src={venue.images[0] || 'https://via.placeholder.com/400x200'}
                alt={venue.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-2 left-2 capitalize">
                {venue.type.replace('-', ' ')}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{venue.name}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin size={14} />
                <span>{venue.city}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{venue.rating}</span>
              </div>
              <p className="text-lg font-bold mb-4">{formatCurrency(venue.price)}/jam</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(venue)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(venue.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
