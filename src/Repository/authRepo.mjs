import AuthModel from '../Models/AuthModel.mjs';

const authrepo={
    findByUserName :async (username) => {
      
      return await AuthModel.findOne({ username });  // Query by userName in MongoDB
    },
    save :async (admin) => {
      return await admin.save();  // Save the document in MongoDB (this updates verifyToken)
    },
    show: async()=>{
      return await AuthModel.find()
    },
    delete: async(id)=>{
      return await AuthModel.findByIdAndDelete(id)
    }
  
}
  export default authrepo;
