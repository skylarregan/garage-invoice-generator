import { createTheme, responsiveFontSizes } from "@mui/material/styles";

var theme = createTheme({
  palette: {
    primary: {
      main: "#f97315",
      // light: "#3c4e6b",
    },
    // secondary: {
    //   main: "#446A79",
    // },
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
