import * as React from 'react'

type Children = { children: React.ReactNode }

type UseGetContextValue<Props, Context> = (props: Props) => Context

type Provider<Props> = (props: Props & Children) => JSX.Element

type Hook<Context> = () => Context

/**
 * A function for generating a Provider and Hook for a React Context
 *
 * @arg useGetContextValue - A custom hook function used to get the `value` prop passed to the generated Provider
 * @arg defaultValue - The default Context value when a Consumer has no parent Provider
 */
export default function generateContext<Props, Context>(
  useGetContextValue: UseGetContextValue<Props, Context>,
  defaultValue: Context
): [Provider<Props>, Hook<Context>] {
  /**
   * The generated Context
   */
  const Ctx = React.createContext(defaultValue)

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
  const useThisContext = () => React.useContext(Ctx)

  return [Provider, useThisContext]
}
