import './App.css'
import { PhotoEditor } from './pages/PhotoEditor'
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: '#0347AC',
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#11cb5f',
    },
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <PhotoEditor />
    </ThemeProvider>
  )
}

export default App
