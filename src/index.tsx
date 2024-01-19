import * as React from 'react'

export default function generateContext<Context, Props>(
  useGetContextValue: (props: Props) => Context,
  defaultContext?: Context
) {
  const Ctx = React.createContext<Context | undefined>(defaultContext)

  const Provider = (props: Props & { children: React.ReactNode }) => {
    const value = useGetContextValue(props)

    return <Ctx.Provider value={value}>{props.children}</Ctx.Provider>
  }

  const useThisContext = () => {
    const ctx = React.useContext(Ctx)

    if (ctx === undefined) {
      throw new Error('This hook must be used a child of its Provider')
    }

    return ctx
  }

  return [Provider, useThisContext] as const
}
