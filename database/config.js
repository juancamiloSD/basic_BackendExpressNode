const mongoose = require('mongoose');

const dbConnection = async() => {
    try{
        await mongoose.connect(process.env.DB_CNN);
        // await mongoose.connect('mongodb+srv://mean_user:ozjJtbZzrP842lQx@cluster0.tbfo3.mongodb.net/hospitaldb', {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        //     useCreateIndex: true
        // });
        console.log('DB Online');
    }catch(error){
        console.log(error);
        throw new error('Error al conectarse a la base de datos');
    } 
}

module.exports = {
    dbConnection
}