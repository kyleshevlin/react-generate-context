# `react-generate-context`

**React Context with less boilerplate.**

Creating a new React Context involves a few steps. `react-generate-context` removes a couple of those steps.

The `react-generate-context` package is a single function, `generateContext`, that generates a React Context (in closure) and returns to you the Provider and custom hook to access it in one step. All you need to do is give it a function that creates and updates the `value` prop for your Context. Let's go through an example:

```javascript
import generateContext from 'react-generate-context'

/**
 * `generateContext` receives a custom hook function that manages the `value`
 * passed to the Provider under the hood. The function takes any `props` passed
 * to the Provider
 */
const useGetCounterValue = ({ startingCount }) => {
  const [state, setState] = React.useState(startingCount)
  const handlers = React.useMemo(
    () => ({
      inc: () => {
        setState(s => s + 1)
      },
      dec: () => {
        setState(s => s - 1)
      },
    }),
    []
  )

  return [state, handlers]
}

/**
 * generateContext returns a tuple of a Provider and a custom
 * hook to consume the context. Array destructuring allows you
 * to name the Provider and hook whatever you need to easily
 */
const [CounterProvider, useCounter] = generateContext(useGetCounterValue)

/**
 * We can consume that context in a component with the hook
 */
function Counter() {
  const [count, { inc, dec }] = useCounter()

  return (
    <div>
      {count}
      <div>
        <button onClick={inc}>+</button>
        <button onClick={dec}>-</button>
      </div>
    </div>
  )
}

/**
 * And use the generated Provider
 */
function App() {
  return (
    <CounterProvider startingCount={100}>
      <Counter />
    </CounterProvider>
  )
}
```

## Installation

```
npm install react-generate-context
```

or

```
yarn add react-generate-context
```

## API

```javascript
const [MyProvider, useMyContext] = generateContext(useGetContextValue, options)
```

`generateContext` receives two arguments: `useGetContextValue` and any `options` for your context.

#### `useGetContextValue`

```typescript
type UseGetContextValue<Props, Context> = (props: Props) => Context
```

The `useGetContextValue` is a custom hook function that derives the `value` of your context. It is given any `props` passed to the Provider.

Example:

```typescript
type Props = {
  startingCount: number
}

type Context = [
  number,
  {
    inc: () => void
    dec: () => void
  }
]

const useGetCounterValue = ({ startingCount }: Props): Context => {
  const [state, setState] = React.useState(startingCount)
  const handlers = React.useMemo(
    () => ({
      inc: () => {
        setState(s => s + 1)
      },
      dec: () => {
        setState(s => s - 1)
      },
    }),
    []
  )

  return [state, handlers]
}
```

#### `options`

`options` is an object for configuring settings for your context. The options are:

- `defaultContext` - A `value` passed to `React.createContext`

- `requireProvider` - Set to `false` if its ok to use the returned hook without the Provider as a parent

- `missingProviderMessage` - A custom message to use as the error message for using the hook outside of the Provider

The defaults are:

```javascript
const DEFAULT_OPTIONS = {
  defaultContext: undefined,
  requireProvider: true,
  missingProviderMessage:
    'The hook for this context cannot be used outside of its Provider',
}
```

## Why?

Reducing boilerplate aside, there's one other good reason to use a helper like `generateContext` when creating Contexts (or at least follow the pattern of its `Provider`).

The Provider returned to you does not allow you to put _any_ components or elements in the same scope where the state change for the context is occurring. This prevents you from making a mistake that causes unnecessary rerendering. For example:

```javascript
import React from 'react'
import SomeOtherFeature from './SomeOtherFeature'
import useManageValue from './useManageValue'

const MyContext = React.createContext()
const useMyContext = () => React.useContext(MyContext)

const MyProvider = ({ children }) => {
  const value = useManageValue()

  return (
    <MyContext.Provider value={value}>
      {children}
      <SomeOtherFeature />
    </MyContext.Provider>
  )
}
```

In this instance, because we have composed `SomeOtherFeature` in the same scope as where our state change for `value` occurs, no matter what you do to `SomeOtherFeature`, _even if it doesn't consume `useMyContext`_, it will be rerendered _every_ time `value` changes.

The Provider returned to you by `generateContext` _only_ allows you to use it with composition via `children`. It ensures that no mistake like the one above can be made now or in the future. Your `Provider` will work as well as it can. The onus is still on you to write a good custom hook to manage the `value`.
