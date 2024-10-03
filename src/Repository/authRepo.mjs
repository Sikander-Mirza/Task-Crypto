import AuthModel from '../Models/AuthModel.mjs';

const authrepo={
    findByUserName :async (userName) => {
      return await AuthModel.findOne({ userName });  // Query by userName in MongoDB
    },
    save :async (admin) => {
      return await admin.save();  // Save the document in MongoDB (this updates verifyToken)
    }
  
}
  export default authrepo;
