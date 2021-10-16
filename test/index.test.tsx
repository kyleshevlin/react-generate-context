import * as React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import generateContext from '../src'

type Props = {
  initialState: number
}

type Context = [
  number,
  {
    inc: () => void
    dec: () => void
  }
]

const useCounterValueGetter = ({ initialState }: Props): Context => {
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

describe('generateContext', () => {
  test('Standard usage', () => {
    const [CounterProvider, useCounter] = generateContext<Props, Context>(
      useCounterValueGetter
    )

    const Counter = () => {
      const counter = useCounter()

      if (!counter) return null

      const [count, { inc, dec }] = counter

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

  describe('Errors', () => {
    /**
     * These tests throw nasty console.errors, so we make console.error a noop
     * for this suite and reset it afterwards.
     */
    // Store the current console.error function
    const errorLogger = console.error

    beforeAll(() => {
      // Noop it before the tests
      console.error = () => {}
    })

    afterAll(() => {
      // Reset it after the tests
      console.error = errorLogger
    })

    it('should error if using the hook outside of the provider by default', () => {
      const [, useCounter] = generateContext<Props, Context>(
        useCounterValueGetter
      )

      const Counter = () => {
        const counter = useCounter()

        if (!counter) return null

        const [count, { inc, dec }] = counter

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

      expect(() => render(<Counter />)).toThrow()
    })

    it('should disable error throwing with requireProvider: false', () => {
      const [, useCounter] = generateContext<Props, Context>(
        useCounterValueGetter,
        {
          requireProvider: false,
        }
      )

      const Counter = () => {
        const counter = useCounter()

        if (!counter) return null

        const [count, { inc, dec }] = counter

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

      expect(() => render(<Counter />)).not.toThrow()
    })

    it('should use custom error message if missingProviderMessage is set', () => {
      const customMessage = 'My special message'
      const [, useCounter] = generateContext<Props, Context>(
        useCounterValueGetter,
        {
          missingProviderMessage: customMessage,
        }
      )

      const Counter = () => {
        const counter = useCounter()

        if (!counter) return null

        const [count, { inc, dec }] = counter

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

      expect(() => render(<Counter />)).toThrow(customMessage)
    })
  })
})
