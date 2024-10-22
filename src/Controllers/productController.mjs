// import {cloudinary}  from "../Services/ImageService.mjs";
import productrepo from "../Repository/productRepo.mjs";

  const Product={
    createproduct: async (req, res) => {
      try {
        console.log('Request Body:', req.body); // Ensure you're receiving the correct form-data
        console.log('Uploaded File:', req.file); // Check if the file was uploaded
  
        if (!req.file) {
          return res.status(400).json({ message: 'Image upload failed' });
        }
  
        const productData = {
          ...req.body,               // Spread the form data into the product data
          imageurl: req.file.path,    // Cloudinary returns the file path (URL)
        };
  
        console.log('Product Data:', productData); // Verify the data you're about to save
  
        // Simulating database operation (use your actual model's create method)
        const product = await productrepo.save(productData);
  
        return res.status(201).json(product);
      } catch (error) {
        console.error('Error during product creation:', error); // Log the full error
        return res.status(500).json({
          message: 'Server error',
          error: error.message, // Provide a useful error message
        });
      }
    },
      

    GetProducts: async(req,res)=>{

        try{

            const users = await productrepo.show()
            if(!users){

                return res.status(404).json({message:"No users found"})
            }
            return res.status(200).json(users)

        }catch(error){

            console.log(error)

        }
    },
    deleteProduct:async(req,res)=>{
try{
        const {id}=req.params

        const user=await productrepo.delete(id)

        if(!user){

            return res.status(404).json({message:"User not found"})

        }

        return res.status(200).json({message:"User deleted successfully"})
}
catch(error){

    console.log(error)
    return res.status(500).json({message:"internal server error"})


}    

    },
    updateProduct:async(req,res)=>{
        try{

            const {id}=req.params
            if (!req.file) {
                return res.status(400).json({ message: 'Image upload failed' });
              }
        
              const productData = {
                ...req.body,               // Spread the form data into the product data
                imageurl: req.file.path,    // Cloudinary returns the file path (URL)
              };
            const user=await productrepo.update(id,productData)

            if(!user){

                return res.status(404).json({message:"User not found"})

            }

            return res.status(200).json({message:"User updated successfully"})

        }
        catch(error){

            console.log(error)

            return res.status(500).json({message:"internal server error"})
        }
    },
    getsingle:async(req,res)=>{
        try{

            const {id}=req.params

            const user=await productrepo.single(id)

            if(!user){

                return res.status(404).json({message:"User not found"})

            }

            return res.status(200).json(user)

        }
        catch(error){

            console.log(error)

            return res.status(500).json({message:"internal server error"})

        }

    }

    
    
}

export default Product;
