import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'

import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { router } from '@/routes'
import '@/i18n'
import api from '@/lib/api'
import { useEffect } from 'react'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="mithasii-theme"
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={150}>
          <RouterProvider router={router} />
          <Toaster richColors closeButton />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
    // App function ke andar
// useEffect(() => {
//   api.get('/db-test').then(res => console.log(res.data))
// }, [])

  )
}

export default App




