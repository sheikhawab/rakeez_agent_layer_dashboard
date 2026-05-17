import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SelectedCompanyId = string | 'all'

type SelectedCompanyState = {
  selectedCompanyId: SelectedCompanyId
  setSelectedCompany: (id: SelectedCompanyId) => void
}

export const useSelectedCompany = create<SelectedCompanyState>()(
  persist(
    (set) => ({
      selectedCompanyId: 'all',
      setSelectedCompany: (id) => set({ selectedCompanyId: id }),
    }),
    { name: 'mithasii-selected-company' },
  ),
)
