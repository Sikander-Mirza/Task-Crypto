import stockrepo from "../Repository/stockRepo.mjs";
import csv from 'csv-parser'; // To parse CSV files
import fs from 'fs';

    const Stock={


    // Admin creation function
    createstock: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded." });
            }
    
            const csvFilePath = req.file.path; // Get the path of the uploaded file
            const stockData = [];
    
            // Stream the CSV file and parse it
            fs.createReadStream(csvFilePath)
                .pipe(csv()) // Use the csv-parser library
                .on('data', (row) => {
                    // Push each row from the CSV into the stockData array
                    stockData.push({
                        product: row.product, // Assuming CSV has columns 'product'
                        amount: row.amount,   // Assuming CSV has columns 'amount'
                        price: row.price,     // Assuming CSV has columns 'price'
                    });
                })
                .on('end', async () => {
                    try {
                        // Save the parsed data to MongoDB
                        const savedProducts = await stockrepo.save(stockData);
                        return res.status(201).json(savedProducts); // Return the created stock items
                    } catch (error) {
                        console.error('Error saving products to DB:', error);
                        return res.status(500).json({ message: "Server error while saving data" });
                    }
                })
                .on('error', (error) => {
                    console.error('Error reading CSV file:', error);
                    return res.status(500).json({ message: "Error processing CSV file" });
                });
    
        } catch (error) {
            console.error('Error during stock creation:', error);
            return res.status(500).json({ message: "Server error" });
        }
    },

    Getstock: async(req,res)=>{

        try{

            const users = await stockrepo.show()
            if(!users){

                return res.status(404).json({message:"No users found"})
            }
            return res.status(200).json(users)

        }catch(error){

            console.log(error)

        }
    },
    

    
    
}

export default Stock;
