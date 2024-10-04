import productrepo from "../Repository/productRepo.mjs";

    const Product={


    // Admin creation function
    createproduct: async (req, res) => {
        try {
            const data = req.body;
console.log(data)
            // Check if admin with the same username or email already exists
            const product = await productrepo.save(data)

            return res.status(201).json(product);  // Return the created admin with a 201 status
        } catch (error) {
            console.error('Error during admin creation:', error);
            return res.status(500).json({ message: "Server error" });
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

            const user=await productrepo.update(id,req.body)

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
