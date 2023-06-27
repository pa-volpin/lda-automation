import { PhotoEditor } from './pages/PhotoEditor'
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      // Blue
      main: '#0347AC',
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#11cb5f',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            background: "#ccc",
            color: "#dadadaccc"
          }
        }
      }
    }
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
