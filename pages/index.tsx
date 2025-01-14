import {
  Alert,
  Box,
  Button,
  Grid2,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Image from "next/image";
import axios from "axios";
import { jsPDF } from "jspdf";
import moment from "moment";
import numeral from "numeral";

export default function Home() {
  const [listingUrl, setListingUrl] = useState<string>("");
  const [error, setError] = useState<string | undefined>();

  const handleDownloadPDF = (
    listingTitle: string,
    sellingPrice: number,
    itemBrand?: string,
    itemYear?: number,
    itemMileage?: number
  ) => {
    const vehiclePriceFormatted = numeral(sellingPrice).format("$0,0.00");
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Invoice", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Date: ${moment().format("MM/DD/YYYY")}`, 10, 40);
    if (itemBrand) {
      doc.text(`Item Brand: ${itemBrand}`, 10, 47);
    }
    if (itemYear) {
      doc.text(`Year: ${itemYear}`, 10, 53);
    }
    if (itemMileage) {
      doc.text(`Mileage: ${itemMileage.toLocaleString()}`, 10, 60);
    }

    doc.setLineWidth(0.5);
    doc.line(10, 70, 200, 70);
    doc.setFontSize(12);
    doc.text("Item", 10, 75);
    doc.text("Price", 160, 75);
    doc.line(10, 78, 200, 78);
    doc.text(listingTitle, 10, 85);
    doc.text(vehiclePriceFormatted, 160, 85);

    doc.setFontSize(14);
    doc.text(`Total: ${vehiclePriceFormatted}`, 160, 115);

    doc.save("invoice.pdf");
  };

  const handleClick = () => {
    if (listingUrl) {
      const splitUrl = listingUrl.split("listing/");
      // Ensure Garage Listing URL was given
      if (
        splitUrl.length == 2 &&
        splitUrl[0] === "https://www.withgarage.com/"
      ) {
        axios
          .post("https://garage-backend.onrender.com/getListing", {
            id: splitUrl[1].slice(-36), // UUID will be last 36 characters of valid URL
          })
          .then((response) => {
            if (
              response.data &&
              response.data.result &&
              response.data.result.listing
            ) {
              const listingInfo = response.data.result.listing;
              handleDownloadPDF(
                listingInfo.listingTitle,
                listingInfo.sellingPrice,
                listingInfo.itemBrand,
                listingInfo.itemAge,
                listingInfo.mileage
              );
              setError(undefined);
            } else {
              setError("Listing not found. Please contact Garage");
            }
          })
          .catch((err) => {
            console.log(err);
            setError("Error creating PDF. Please contact Garage.");
          });
      } else {
        setError("URL does not point to a Garage listing. Please try again.");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={20}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 1000,
          textAlign: "center",
          borderRadius: 4,
          overflow: "scroll",
        }}
      >
        <Box display="flex" justifyContent="center" mb={3}>
          <Image
            src="/GarageLogo.png"
            alt="Garage Logo"
            height={0}
            width={0}
            sizes="30vw"
            style={{ width: "auto", height: "auto" }}
          />
        </Box>
        <Typography variant="h3" gutterBottom>
          Welcome to Garage
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Enter the URL of a listing on Garage to generate a PDF invoice.
        </Typography>
        <Grid2 container spacing={2} sx={{ my: 4 }} direction="column">
          <Grid2>
            <TextField
              required
              id="listingUrl"
              value={listingUrl}
              onChange={(event) => {
                if (error) {
                  setError(undefined);
                }
                setListingUrl(event.target.value);
              }}
              label="Listing URL"
              fullWidth
            />
          </Grid2>
          <Grid2>
            <Button
              disabled={!listingUrl}
              onClick={handleClick}
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ textTransform: "none" }}
            >
              Request PDF Invoice
            </Button>
          </Grid2>
        </Grid2>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }} icon={<ErrorOutlineIcon />}>
            {error}
          </Alert>
        )}
      </Paper>
    </Box>
  );
}
