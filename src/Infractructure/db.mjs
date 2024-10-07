import mongoose from "mongoose";
const ConnectDB = async ()=>{
  const uri = 'mongodb://localhost:27017/';

  // Connect to MongoDB using Mongoose (without deprecated options)
  mongoose.connect(uri,{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000
  })
      .then(() => console.log('Connected to MongoDB'))
      .catch(err => console.error('Failed to connect to MongoDB', err));
}

export default ConnectDB