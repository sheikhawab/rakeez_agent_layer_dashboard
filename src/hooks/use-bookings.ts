import { useQuery } from '@tanstack/react-query'

import type { BookingFilters } from '@/data/client'
import { dataClient } from '@/data/client'
import { useSelectedCompany } from '@/store/selected-company'

export function useBookings(filters: Omit<BookingFilters, 'companyId'> = {}) {
  const { selectedCompanyId } = useSelectedCompany()
  return useQuery({
    queryKey: ['bookings', selectedCompanyId, filters],
    queryFn: () =>
      dataClient.getBookings({ ...filters, companyId: selectedCompanyId }),
  })
}

export function useBooking(id: string | undefined) {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => (id ? dataClient.getBooking(id) : undefined),
    enabled: Boolean(id),
  })
}
// ihder se sari api calls hoon ge yehi seprate hooks hain 