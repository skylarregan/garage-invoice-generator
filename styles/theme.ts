import { createTheme, responsiveFontSizes } from "@mui/material/styles";

var theme = createTheme({
  palette: {
    background: { default: "#f97315" },
    primary: {
      main: "#f97315",
    },
  },
  typography: {
    fontFamily: [
      "Poppins",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    htmlFontSize: 16,
  },
});
theme = responsiveFontSizes(theme);

export default theme;
