import { createGlobalStyle, ThemeProvider } from 'styled-components'
import './styles/styles.scss'



const theme = {
  colors: {
    primary: 'red',
  },
}

export default function App({ Component, pageProps }) {
  return (
    <>

      <ThemeProvider theme={theme}>
        <Component {...pageProps} />

      </ThemeProvider>
    </>
  )
}
