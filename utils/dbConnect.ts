import mongoose from 'mongoose';

const mongodbUri = process.env.INDOME_MONGODB_URI;
const dbName = process.env.INDOME_DB_NAME!;

if (!mongodbUri) {
  throw new Error('Please add the MongoDB URI to the environment variable!');
}

if (!dbName) {
  throw new Error('Please put the database name in the environment variable!');
}

let cached = globalThis.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongodbUri!, {
      retryWrites: true,
      dbName,
      w: 'majority',
    }).then(mongoose => {
      return mongoose
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect

