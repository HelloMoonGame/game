import React from 'react'
import client, { Session } from 'next-auth/client'
import { render } from '../testUtils'
import { Home } from '../../pages/index'

jest.mock('next-auth/client')

describe('Home page', () => {
  it('matches snapshot', () => {
    const mockSession: Session = {
      expires: '1',
      user: { email: null, name: 'alice@hellomoon.nl', image: null },
    }

    client.useSession.mockReturnValue([mockSession, false])

    const { asFragment } = render(<Home />, {})
    expect(asFragment()).toMatchSnapshot()
  })
})
