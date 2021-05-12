import React from 'react'
import { act, render } from '../testUtils'
import { Home } from '../../pages/index'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from '../../state/ducks/character'

jest.mock(
  '../../services/AuthService',
  () => {
    return {
      getInstance: jest.fn(() => {
        return {
          getUserOrLogin: jest.fn(() =>
            Promise.resolve({
              access_token: '123',
              profile: {
                aud: '',
                exp: 0,
                iat: 0,
                iss: '',
                sub: '1234-56789-0123-4567',
                name: 'alice@hellomoon.nl',
              },
              id_token: '',
              session_state: '',
              refresh_token: '',
              scope: '',
              expires_at: 0,
              state: '',
              token_type: '',
            })
          ),
        }
      }),
    }
  },
  { virtual: true }
)

describe('Home page', () => {
  it('matches snapshot', async () => {
    let asFragment
    const store = createStore(reducer, null)
    await act(() => {
      asFragment = render(
        <Provider store={store}>
          <Home />
        </Provider>,
        {}
      ).asFragment
    })
    expect(asFragment()).toMatchSnapshot()
  })
})
