import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { venueService } from '@/services/venues'
import type { Venue } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { formatCurrency } from '@/lib/utils'
import { Search, MapPin, Star, SlidersHorizontal, X } from 'lucide-react'

export function HomePage() {
  const [allVenues, setAllVenues] = useState<Venue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filterCity, setFilterCity] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterPriceRange, setFilterPriceRange] = useState<[number, number]>([0, 500000])

  const cities = useMemo(() => [...new Set(allVenues.map((v) => v.city))].sort(), [allVenues])

  const priceBounds = useMemo(() => {
    if (allVenues.length === 0) return { min: 0, max: 500000 }
    const prices = allVenues.map((v) => v.price)
    return { min: 0, max: Math.ceil(Math.max(...prices) / 50000) * 50000 }
  }, [allVenues])

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await venueService.getVenues()
        setAllVenues(data)
        if (data.length > 0) {
          const prices = data.map((v) => v.price)
          const max = Math.ceil(Math.max(...prices) / 50000) * 50000
          setFilterPriceRange([0, max])
        }
      } catch (error) {
        console.error('Failed to fetch venues:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAll()
  }, [])

  const filteredVenues = useMemo(() => {
    return allVenues.filter((venue) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchSearch =
          venue.name.toLowerCase().includes(q) ||
          venue.city.toLowerCase().includes(q) ||
          venue.address.toLowerCase().includes(q)
        if (!matchSearch) return false
      }
      if (filterCity && venue.city !== filterCity) return false
      if (filterType && venue.type !== filterType) return false
      if (venue.price < filterPriceRange[0] || venue.price > filterPriceRange[1]) return false
      return true
    })
  }, [allVenues, searchQuery, filterCity, filterType, filterPriceRange])

  const hasActiveFilters = filterCity || filterType || filterPriceRange[0] > priceBounds.min || filterPriceRange[1] < priceBounds.max

  const activeFilterCount = [
    filterCity,
    filterType,
    filterPriceRange[0] > priceBounds.min,
    filterPriceRange[1] < priceBounds.max,
  ].filter(Boolean).length

  const clearFilters = () => {
    setSearchQuery('')
    setFilterCity('')
    setFilterType('')
    setFilterPriceRange([priceBounds.min, priceBounds.max])
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="text-center py-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Temukan & Booking Lapangan
          <span className="text-primary"> Futsal</span> &
          <span className="text-primary"> Mini Soccer</span>
        </h1>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          Cari lapangan terbaik di kota Anda. Mudah, cepat, dan tanpa ribet.
        </p>
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Cari nama venue, kota, atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg rounded-full shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
        >
          <SlidersHorizontal size={16} />
          Filter
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500">
            <X size={14} className="mr-1" />
            Reset semua
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <section className="bg-white rounded-xl border p-5 shadow-sm space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Kota */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Kota</label>
              <Select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                <option value="">Semua Kota</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </Select>
            </div>

            {/* Tipe */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tipe Lapangan</label>
              <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="">Semua Tipe</option>
                <option value="futsal">Futsal</option>
                <option value="mini-soccer">Mini Soccer</option>
              </Select>
            </div>

            {/* Spacer */}
            <div />
          </div>

          {/* Price Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Rentang Harga</label>
              <span className="text-sm font-medium text-primary">
                {formatCurrency(filterPriceRange[0])} — {formatCurrency(filterPriceRange[1])}
              </span>
            </div>
            <div className="px-2">
              <Slider
                min={priceBounds.min}
                max={priceBounds.max}
                step={25000}
                value={filterPriceRange}
                onValueChange={(val) => setFilterPriceRange(val as [number, number])}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{formatCurrency(priceBounds.min)}</span>
              <span>{formatCurrency(priceBounds.max)}</span>
            </div>
          </div>

          {/* Active Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-3 border-t">
              {filterCity && (
                <Badge variant="secondary" className="gap-1">
                  {filterCity}
                  <button onClick={() => setFilterCity('')} className="hover:text-destructive ml-1">
                    <X size={12} />
                  </button>
                </Badge>
              )}
              {filterType && (
                <Badge variant="secondary" className="gap-1 capitalize">
                  {filterType.replace('-', ' ')}
                  <button onClick={() => setFilterType('')} className="hover:text-destructive ml-1">
                    <X size={12} />
                  </button>
                </Badge>
              )}
              {(filterPriceRange[0] > priceBounds.min || filterPriceRange[1] < priceBounds.max) && (
                <Badge variant="secondary" className="gap-1">
                  {formatCurrency(filterPriceRange[0])} — {formatCurrency(filterPriceRange[1])}
                  <button onClick={() => setFilterPriceRange([priceBounds.min, priceBounds.max])} className="hover:text-destructive ml-1">
                    <X size={12} />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </section>
      )}

      {/* Results */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Venue Tersedia</h2>
          <span className="text-sm text-gray-500">
            {filteredVenues.length} dari {allVenues.length} venue
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredVenues.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">Tidak ada venue yang cocok</p>
              <p className="text-gray-400 text-sm mb-4">Coba ubah filter atau kata kunci pencarian</p>
              <Button variant="outline" onClick={clearFilters}>Reset Filter</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue) => (
              <Link key={venue.id} to={`/venues/${venue.id}`}>
                <Card className="hover:shadow-lg transition-all cursor-pointer h-full group">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={venue.images[0] || 'https://via.placeholder.com/400x300'}
                      alt={venue.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 capitalize">
                      {venue.type.replace('-', ' ')}
                    </Badge>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{venue.rating}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {venue.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                      <MapPin size={14} />
                      <span className="line-clamp-1">{venue.address}, {venue.city}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <p className="text-xl font-bold text-primary">
                        {formatCurrency(venue.price)}
                        <span className="text-xs font-normal text-gray-500">/jam</span>
                      </p>
                      <Button size="sm">Booking</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
