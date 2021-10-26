import process from 'node:process'
import dotenv from 'dotenv'
import cryptoRandomString from 'crypto-random-string'

dotenv.config()

// Set default values if not set
process.env.VL_NEO4J_DB = process.env.VL_NEO4J_DB || 'bolt://localhost:7687'
process.env.VL_NEO4J_AUTH_USER = process.env.VL_NEO4J_AUTH_USER || 'neo4j'
process.env.VL_NEO4J_AUTH_PASSWORD = process.env.VL_NEO4J_AUTH_PASSWORD || 's3cr3t'
process.env.VL_NEO4J_JWT_SECRET = process.env.VL_NEO4J_JWT_SECRET || cryptoRandomString({length: 256})
