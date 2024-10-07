import stockrepo from "../Repository/stockRepo.mjs";
import fs from 'fs';
import xlsx from 'xlsx'; // Library to handle Excel files

const Stock = {
  // Admin creation function
  createstock: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }

      const excelFilePath = req.file.path; // Get the path of the uploaded file

      // Read the uploaded Excel file
      const workbook = xlsx.readFile(excelFilePath);
      const sheetName = workbook.SheetNames[0]; // Read the first sheet
      const worksheet = workbook.Sheets[sheetName];

      // Convert the sheet data to JSON format
      const stockData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

      if (stockData.length === 0) {
        return res.status(400).json({ message: "The Excel file is empty." });
      }

      // Assuming the first row is the header, extract headers and map the data
      const [headers, ...rows] = stockData;

      // Expected headers: product, amount, price (adjust based on your needs)
      const productIndex = headers.indexOf('product');
      const amountIndex = headers.indexOf('amount');
      const priceIndex = headers.indexOf('price');

      if (productIndex === -1 || amountIndex === -1 || priceIndex === -1) {
        return res.status(400).json({ message: "Invalid Excel format. Expected columns: product, amount, price" });
      }

      const formattedData = rows.map(row => ({
        product: row[productIndex],
        amount: row[amountIndex],
        price: row[priceIndex]
      }));

      try {
        // Save the parsed data to MongoDB
        const savedProducts = await stockrepo.save(formattedData);
        return res.status(201).json(savedProducts); // Return the created stock items
      } catch (error) {
        console.error('Error saving products to DB:', error);
        return res.status(500).json({ message: "Server error while saving data" });
      }
    } catch (error) {
      console.error('Error during stock creation:', error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  // Get stock function
  Getstock: async (req, res) => {
    try {
      const products = await stockrepo.show();
      if (!products) {
        return res.status(404).json({ message: "No products found" });
      }
      return res.status(200).json(products);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};

export default Stock;
