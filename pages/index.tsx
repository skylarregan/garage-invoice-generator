import {
  Alert,
  Button,
  Container,
  Grid2,
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
    description: string,
    sellingPrice: number
  ) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Invoice", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Date: ${moment().format("MM/DD/YYYY")}`, 10, 40); // List today's date
    // Add a Line
    doc.setLineWidth(0.5);
    doc.line(10, 60, 200, 60);

    // Table Headers
    doc.setFontSize(12);
    doc.text("Item", 10, 70);
    doc.text("Price", 160, 70);

    // Add a Line
    doc.line(10, 75, 200, 75);

    let currentY = 85;
    doc.text(listingTitle, 10, currentY);
    doc.text(numeral(sellingPrice).format("$0,0.00"), 160, currentY);
    currentY += 10;

    doc.text("Purchase Details:", 10, currentY);
    doc.text(description, 10, currentY + 5); // Think this is not worth it
    // Download PDF
    doc.save("invoice.pdf");
  };

  const handleClick = () => {
    if (listingUrl) {
      const splitUrl = listingUrl.split("listing/");
      if (
        splitUrl.length == 2 &&
        splitUrl[0] === "https://www.withgarage.com/"
      ) {
        axios
          .post("https://garage-backend.onrender.com/getListing", {
            id: splitUrl[1].slice(-36), // UUID will be last 36 characters of URL
          })
          .then((response) => {
            console.log(response);
            if (
              response.data &&
              response.data.result &&
              response.data.result.listing
            ) {
              const listingInfo = response.data.result.listing;
              //item weight, item age
              handleDownloadPDF(
                listingInfo.listingTitle,
                listingInfo.listingDescription,
                listingInfo.sellingPrice
              );
              setError("");
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
    <Container sx={{ backgroundColor: "white", py: 2, px: 30 }}>
      <Image
        src={"/GarageLogo.png"}
        alt="legend"
        height={0}
        width={0}
        sizes="25vw"
        style={{ width: "auto", height: "auto" }}
      />
      <Grid2 container spacing={2} direction="column">
        <Grid2>
          <Typography variant="h5">
            Enter the URL of a listing on Garage to generate a PDF invoice.
          </Typography>
        </Grid2>
        <Grid2>
          <TextField
            id="listingUrl"
            value={listingUrl}
            onChange={(event) => setListingUrl(event.target.value)}
            label="Listing URL"
            fullWidth
          />
        </Grid2>
        <Grid2>
          <Button
            disabled={listingUrl === ""}
            onClick={handleClick}
            variant="contained"
            color="primary"
            fullWidth
          >
            Request PDF Invoice
          </Button>
        </Grid2>
      </Grid2>
      <br />
      {error && (
        <Alert icon={<ErrorOutlineIcon fontSize="inherit" />} severity="error">
          {error}
        </Alert>
      )}
    </Container>
  );
}

// export default Home;
