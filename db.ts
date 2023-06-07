import { Container, CosmosClient } from "@azure/cosmos";

const globalForCosmos = global as unknown as {
  cosmos: {
    promise: Promise<Container> | null;
    container: Container | null;
  };
};
const COSMOSDB_URI = process.env.COSMOSDB_URI;

if (!COSMOSDB_URI) {
  throw new Error(
    "Please define the COSMOSDB_URI environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = globalForCosmos.cosmos;

if (!cached) {
  cached = globalForCosmos.cosmos = { container: null, promise: null };
}

async function dbConnect() {
  if (!COSMOSDB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }
  if (cached.container) {
    return cached.container;
  }

  if (!cached.promise) {
    const cosmosClient = new CosmosClient(COSMOSDB_URI);
    cached.promise = new Promise(async (resolve) => {
        const databaseResponse = await cosmosClient.databases.createIfNotExists({ id: "test" })
        const containerResponse = await databaseResponse.database.containers.createIfNotExists({
            id: "posts",
            partitionKey: { paths: ["/userEmail"] },
          });
        return resolve(containerResponse.container)
    })
  }

  try {
    cached.container = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.container;
}

export default dbConnect;
