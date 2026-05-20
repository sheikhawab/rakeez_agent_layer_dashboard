import { CompanyForm } from '@/components/companies/company-form'
import { PageHeader } from '@/components/shared/page-header'

export function CompaniesNewPage() {
  return (
    <div className="space-y-4 p-4 sm:p-6">
      <PageHeader
        title="New Company"
        description="Add a new tenant to the platform"
      />
      <CompanyForm />
    </div>
  )
}
