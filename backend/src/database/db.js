import mongoose from 'mongoose';

const connectDataBase = () => {
    console.log('Connecting to the database...');

    mongoose.connect(process.env.DATABASE_URL)
    .then(() => 
        console.log('MongoDB Atlas connected successfully.')
    )
    .catch((error) => {
        console.error('Error connecting to the database:', error);
    })
};

export default connectDataBase;