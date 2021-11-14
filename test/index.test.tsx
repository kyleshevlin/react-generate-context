import * as React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import generateContext from '../src'

type Props = {
  initialState?: number
}

type Context = [
  number,
  {
    inc: () => void
    dec: () => void
  }
]

const useCounterValueGetter = ({ initialState = 0 }: Props): Context => {
  const [state, setState] = React.useState(initialState)
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

const noop = () => {}

const defaultValue: Context = [
  100,
  {
    inc: noop,
    dec: noop,
  },
]

describe('generateContext', () => {
  test('Standard usage', () => {
    const [CounterProvider, useCounter] = generateContext<Props, Context>(
      useCounterValueGetter,
      defaultValue
    )

    const Counter = () => {
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

    render(
      <CounterProvider initialState={0}>
        <Counter />
      </CounterProvider>
    )

    expect(screen.getByText('0')).toBeDefined()

    fireEvent.click(screen.getByText('+'))
    expect(screen.getByText('1')).toBeDefined()

    fireEvent.click(screen.getByText('-'))
    expect(screen.getByText('0')).toBeDefined()
  })

  test('Outside of Provider', () => {
    const [, useCounter] = generateContext<Props, Context>(
      useCounterValueGetter,
      defaultValue
    )

    const Counter = () => {
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

    render(<Counter />)

    // Should match the string of the defaultValue count value
    expect(screen.getByText('100')).toBeDefined()

    // Clicking should do nothing, since they are noops
    fireEvent.click(screen.getByText('+'))
    expect(screen.getByText('100')).toBeDefined()

    fireEvent.click(screen.getByText('-'))
    expect(screen.getByText('100')).toBeDefined()
  })
})
