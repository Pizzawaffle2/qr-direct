import * as React from "react"

declare global {
  namespace React {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      'border-border'?: string
    }
  }
}

export {}