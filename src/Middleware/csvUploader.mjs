import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';
import StockModel from "../Models/StockModel.mjs";

// Set up multer with memoryStorage to avoid saving files locally
const storage = multer.memoryStorage();

// Filter to accept only CSV files
const csvFilter = (req, file, cb) => {
    if (file.mimetype === 'text/csv') {
        cb(null, true);
    } else {
        cb(new Error('Please upload only CSV files.'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: csvFilter });

// Function to convert buffer to readable stream
const bufferToStream = (buffer) => {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
};

// Function to handle file upload and CSV parsing
const parseCSVFile = (req, res) => {
    const csvData = [];
    const fileBuffer = req.file.buffer; // Access the file buffer directly

    // Convert buffer to stream and parse the CSV data
    const stream = bufferToStream(fileBuffer);
    stream
        .pipe(csv())
        .on('data', (row) => {
            csvData.push(row); // Push each row of CSV data into the array
        })
        .on('end', async () => {
            try {
                // Save each row of data to the StockModel
                await StockModel.insertMany(csvData);

                res.json({
                    message: 'CSV file processed and data saved successfully',
                    data: csvData
                });
            } catch (error) {
                res.status(500).json({ message: 'Error saving data to database', error: error.message });
            }
        })
        .on('error', (error) => {
            res.status(500).json({ message: 'Error processing CSV file', error: error.message });
        });
};

export { upload, parseCSVFile };
