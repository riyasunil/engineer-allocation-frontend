// components/ToastProvider.tsx
'use client'

import { Toaster } from 'sonner'

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'bg-white dark:bg-zinc-900 border shadow-lg rounded-xl',
          title: 'text-lg font-semibold',
          description: 'text-sm text-muted-foreground',
          actionButton: 'bg-primary text-white rounded-md px-3 py-1 hover:bg-primary/90',
          cancelButton: 'text-muted-foreground hover:text-foreground',
        },
      }}
    />
  )
}

export default ToastProvider
