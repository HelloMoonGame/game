import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head />
        <body>
          <style jsx global>{`
            html,
            body {
              height: 100%;
            }
            #__next {
              display: flex;
              height: 100%;
            }
          `}</style>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
