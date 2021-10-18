import dotenv from 'dotenv'
dotenv.config()

// Set default values if not set
process.env.VL_NEO4J_DB = process.env.VL_NEO4J_DB || 'bolt://localhost:7687'
process.env.VL_NEO4J_AUTH_USER = process.env.VL_NEO4J_AUTH_USER || 'neo4j'
process.env.VL_NEO4J_AUTH_PASSWORD = process.env.VL_NEO4J_AUTH_PASSWORD || 's3cr3t'
