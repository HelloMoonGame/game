import React from 'react'
import client, { Session } from 'next-auth/client'
import { render } from '../testUtils'
import { Home } from '../../pages/index'

jest.mock('next-auth/client')

describe('Home page', () => {
  it('matches snapshot', () => {
    const mockSession: Session = {
      expires: '1',
      user: { email: 'a', name: 'Delta', image: 'c' },
    }

    ;(client.useSession as jest.Mock).mockReturnValueOnce([mockSession, false])

    const { asFragment } = render(<Home />, {})
    expect(asFragment()).toMatchSnapshot()
  })
})
