import mongoose from "mongoose";

const connectdb = async () => {
    try {
        console.log('=== CONNECTION DEBUG ===');
        console.log('MONGODB_URL exists:', !!process.env.MONGODB_URL);
        console.log('Connection string:', process.env.MONGODB_URL);
        
        mongoose.connection.on('connected', () => {
            console.log('✅ MongoDB connected successfully');
            console.log('Database name:', mongoose.connection.db.databaseName);
        });

        mongoose.connection.on('error', (err) => {
            console.log('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });

        // Now the database name is in the connection string
        await mongoose.connect(`${process.env.MONGODB_URL}/pres`);
        
    } catch (error) {
        console.log('MongoDB connection failed:', error);
        process.exit(1);
    }
}

export default connectdb;
