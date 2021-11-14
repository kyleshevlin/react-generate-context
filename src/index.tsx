import * as React from 'react'

type Children = { children: React.ReactNode }

type UseGetContextValue<Props, Context> = (props: Props) => Context

type Options<Context> = {
  defaultContext?: Context
  requireProvider?: boolean
  missingProviderMessage?: string
}

type Provider<Props> = (props: Props & Children) => JSX.Element

type Hook<Context> = () => Context | undefined

const defaultMissingProviderMessage =
  'The hook for this context cannot be used outside of its Provider'

/**
 * A function for generating a Provider and Hook for a React Context
 *
 * @arg useGetContextValue - A custom hook function used to get the `value` prop passed to the generated Provider
 * @arg options - Additional options for generating the Context
 */
export default function generateContext<Props, Context>(
  useGetContextValue: UseGetContextValue<Props, Context>,
  options: Options<Context> = {}
): [Provider<Props>, Hook<Context>] {
  const {
    defaultContext,
    requireProvider = true,
    missingProviderMessage = defaultMissingProviderMessage,
  } = options

  /**
   * Creates a Context in closure
   */
  const Ctx = React.createContext(defaultContext)

  /**
   * The Provider with which to use this Context
   */
  const Provider = (props: Props & Children) => {
    const value = useGetContextValue(props)

    return <Ctx.Provider value={value}>{props.children}</Ctx.Provider>
  }

  /**
   * The hook for consuming the generated Context
   */
  const useThisContext = () => {
    const context = React.useContext(Ctx)

    if (requireProvider && context === undefined) {
      throw new Error(missingProviderMessage)
    }

    return context
  }

  return [Provider, useThisContext]
}
