import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { EditorView } from '@codemirror/view'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

type PromptEditorProps = {
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
  className?: string
  /** Min editor height in px */
  minHeight?: number
}

export function PromptEditor({
  value,
  onChange,
  readOnly,
  className,
  minHeight = 400,
}: PromptEditorProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // CodeMirror's themes hydrate post-mount; avoid SSR-mismatch flicker
  useEffect(() => setMounted(true), [])

  return (
    <div
      className={cn(
        'border-input bg-background overflow-hidden rounded-md border text-sm',
        className,
      )}
    >
      {mounted && (
        <CodeMirror
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
          extensions={[markdown(), EditorView.lineWrapping]}
          minHeight={`${minHeight}px`}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            foldGutter: false,
          }}
        />
      )}
    </div>
  )
}
