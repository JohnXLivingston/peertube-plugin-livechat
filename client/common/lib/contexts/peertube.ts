import type { RegisterClientOptions } from '@peertube/peertube-types/client/types'
import { createContext } from '@lit/context'

export const registerClientOptionsContext = createContext<RegisterClientOptions | undefined>(Symbol('register-client-options'))
