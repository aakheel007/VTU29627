import { useEffect, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline, Box, CircularProgress } from "@mui/material";
import { Log } from "./services/logger";
import { initializeAuthToken } from "./services/auth";
import { NotificationsPage } from "./pages/NotificationsPage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

function App() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await initializeAuthToken();
        await Log("frontend", "info", "page", "Application started");
      } finally {
        setAuthReady(true);
      }
    })();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {authReady ? (
        <NotificationsPage />
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}
    </ThemeProvider>
  );
}

export default App;
