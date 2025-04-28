# Windsurf Flow JSON Snippets

This document contains five Windsurf Flow JSON snippets for the UAE Real-Estate AI Operating System project. These flows can be imported into Windsurf Editor to automate common development tasks.

## Table of Contents

1. [Backend Initialization Flow](#flow-init-backend)
2. [PGVector Migration Flow](#flow-pgvector-migration)
3. [Langfuse Tracing Flow](#flow-langfuse-trace)
4. [Helm Deployment Flow](#flow-deploy-helm)
5. [ADR Writing Flow](#flow-write-adr)

## How to Use These Flows

1. Copy the JSON snippet for the flow you want to use
2. In Windsurf, open Cascade (Cmd/Ctrl+L)
3. Type "Import Flow" and paste the JSON when prompted
4. The flow will be available in your Flows library

## Flow: Init Backend <a name="flow-init-backend"></a>

This flow initializes a new backend for the UAE Real-Estate AI project with Node.js, Express, TypeScript, and PostgreSQL.

```json
{
  "name": "Initialize Real Estate AI Backend",
  "description": "Sets up a new Node.js backend with Express, TypeScript, and PostgreSQL for the UAE Real-Estate AI project",
  "uid": "flow_init_backend",
  "actions": [
    {
      "type": "createDirectory",
      "path": "src"
    },
    {
      "type": "createDirectory",
      "path": "src/controllers"
    },
    {
      "type": "createDirectory",
      "path": "src/models"
    },
    {
      "type": "createDirectory",
      "path": "src/routes"
    },
    {
      "type": "createDirectory",
      "path": "src/services"
    },
    {
      "type": "createDirectory",
      "path": "src/utils"
    },
    {
      "type": "createDirectory",
      "path": "src/middleware"
    },
    {
      "type": "createDirectory",
      "path": "src/config"
    },
    {
      "type": "createFile",
      "path": "package.json",
      "content": "{\n  \"name\": \"uae-real-estate-ai-backend\",\n  \"version\": \"1.0.0\",\n  \"description\": \"Backend for UAE Real-Estate AI Operating System\",\n  \"main\": \"dist/index.js\",\n  \"scripts\": {\n    \"build\": \"tsc\",\n    \"start\": \"node dist/index.js\",\n    \"dev\": \"ts-node-dev --respawn src/index.ts\",\n    \"test\": \"jest\",\n    \"lint\": \"eslint . --ext .ts\"\n  },\n  \"dependencies\": {\n    \"cors\": \"^2.8.5\",\n    \"dotenv\": \"^16.3.1\",\n    \"express\": \"^4.18.2\",\n    \"helmet\": \"^7.1.0\",\n    \"pg\": \"^8.11.3\",\n    \"pg-hstore\": \"^2.3.4\",\n    \"sequelize\": \"^6.35.1\"\n  },\n  \"devDependencies\": {\n    \"@types/cors\": \"^2.8.17\",\n    \"@types/express\": \"^4.17.21\",\n    \"@types/jest\": \"^29.5.10\",\n    \"@types/node\": \"^20.10.0\",\n    \"@typescript-eslint/eslint-plugin\": \"^6.12.0\",\n    \"@typescript-eslint/parser\": \"^6.12.0\",\n    \"eslint\": \"^8.54.0\",\n    \"jest\": \"^29.7.0\",\n    \"ts-jest\": \"^29.1.1\",\n    \"ts-node-dev\": \"^2.0.0\",\n    \"typescript\": \"^5.3.2\"\n  }\n}"
    },
    {
      "type": "createFile",
      "path": "tsconfig.json",
      "content": "{\n  \"compilerOptions\": {\n    \"target\": \"es2022\",\n    \"module\": \"commonjs\",\n    \"outDir\": \"./dist\",\n    \"rootDir\": \"./src\",\n    \"strict\": true,\n    \"esModuleInterop\": true,\n    \"skipLibCheck\": true,\n    \"forceConsistentCasingInFileNames\": true,\n    \"resolveJsonModule\": true\n  },\n  \"include\": [\"src/**/*\"],\n  \"exclude\": [\"node_modules\", \"**/*.test.ts\"]\n}"
    },
    {
      "type": "createFile",
      "path": ".env.example",
      "content": "# Server Configuration\nPORT=3000\nNODE_ENV=development\n\n# Database Configuration\nDB_HOST=localhost\nDB_PORT=5432\nDB_NAME=real_estate_ai\nDB_USER=postgres\nDB_PASSWORD=postgres\n\n# JWT Configuration\nJWT_SECRET=your_jwt_secret_key\nJWT_EXPIRES_IN=1d\n\n# OpenAI Configuration\nOPENAI_API_KEY=your_openai_api_key\n\n# Langfuse Configuration\nLANGFUSE_PUBLIC_KEY=your_langfuse_public_key\nLANGFUSE_SECRET_KEY=your_langfuse_secret_key\nLANGFUSE_HOST=https://cloud.langfuse.com"
    },
    {
      "type": "createFile",
      "path": "src/index.ts",
      "content": "import express from 'express';\nimport cors from 'cors';\nimport helmet from 'helmet';\nimport dotenv from 'dotenv';\nimport { sequelize } from './config/database';\nimport propertyRoutes from './routes/property.routes';\nimport userRoutes from './routes/user.routes';\nimport leadRoutes from './routes/lead.routes';\n\n// Load environment variables\ndotenv.config();\n\nconst app = express();\nconst PORT = process.env.PORT || 3000;\n\n// Middleware\napp.use(helmet());\napp.use(cors());\napp.use(express.json());\n\n// Routes\napp.use('/api/properties', propertyRoutes);\napp.use('/api/users', userRoutes);\napp.use('/api/leads', leadRoutes);\n\n// Health check endpoint\napp.get('/health', (req, res) => {\n  res.status(200).json({ status: 'ok' });\n});\n\n// Database connection and server start\nsequelize\n  .authenticate()\n  .then(() => {\n    console.log('Database connection established successfully.');\n    app.listen(PORT, () => {\n      console.log(`Server running on port ${PORT}`);\n    });\n  })\n  .catch((err) => {\n    console.error('Unable to connect to the database:', err);\n  });\n\nexport default app;"
    },
    {
      "type": "createFile",
      "path": "src/config/database.ts",
      "content": "import { Sequelize } from 'sequelize';\nimport dotenv from 'dotenv';\n\ndotenv.config();\n\nconst {\n  DB_HOST,\n  DB_PORT,\n  DB_NAME,\n  DB_USER,\n  DB_PASSWORD\n} = process.env;\n\nexport const sequelize = new Sequelize({\n  dialect: 'postgres',\n  host: DB_HOST || 'localhost',\n  port: parseInt(DB_PORT || '5432', 10),\n  database: DB_NAME || 'real_estate_ai',\n  username: DB_USER || 'postgres',\n  password: DB_PASSWORD || 'postgres',\n  logging: process.env.NODE_ENV !== 'production',\n  pool: {\n    max: 5,\n    min: 0,\n    acquire: 30000,\n    idle: 10000\n  }\n});\n\nexport default sequelize;"
    },
    {
      "type": "createFile",
      "path": "src/models/property.model.ts",
      "content": "import { Model, DataTypes } from 'sequelize';\nimport sequelize from '../config/database';\n\ninterface PropertyAttributes {\n  id: string;\n  title: string;\n  description: string;\n  price: number;\n  bedrooms: number;\n  bathrooms: number;\n  area: number;\n  location: string;\n  propertyType: string;\n  status: string;\n  agentId: string;\n}\n\nclass Property extends Model<PropertyAttributes> implements PropertyAttributes {\n  public id!: string;\n  public title!: string;\n  public description!: string;\n  public price!: number;\n  public bedrooms!: number;\n  public bathrooms!: number;\n  public area!: number;\n  public location!: string;\n  public propertyType!: string;\n  public status!: string;\n  public agentId!: string;\n\n  // Timestamps\n  public readonly createdAt!: Date;\n  public readonly updatedAt!: Date;\n}\n\nProperty.init(\n  {\n    id: {\n      type: DataTypes.UUID,\n      defaultValue: DataTypes.UUIDV4,\n      primaryKey: true\n    },\n    title: {\n      type: DataTypes.STRING,\n      allowNull: false\n    },\n    description: {\n      type: DataTypes.TEXT,\n      allowNull: false\n    },\n    price: {\n      type: DataTypes.DECIMAL(10, 2),\n      allowNull: false\n    },\n    bedrooms: {\n      type: DataTypes.INTEGER,\n      allowNull: false\n    },\n    bathrooms: {\n      type: DataTypes.INTEGER,\n      allowNull: false\n    },\n    area: {\n      type: DataTypes.DECIMAL(10, 2),\n      allowNull: false\n    },\n    location: {\n      type: DataTypes.STRING,\n      allowNull: false\n    },\n    propertyType: {\n      type: DataTypes.STRING,\n      allowNull: false\n    },\n    status: {\n      type: DataTypes.ENUM('available', 'sold', 'rented'),\n      allowNull: false,\n      defaultValue: 'available'\n    },\n    agentId: {\n      type: DataTypes.UUID,\n      allowNull: false\n    }\n  },\n  {\n    sequelize,\n    tableName: 'properties',\n    timestamps: true\n  }\n);\n\nexport default Property;"
    },
    {
      "type": "createFile",
      "path": "src/routes/property.routes.ts",
      "content": "import { Router } from 'express';\nimport * as PropertyController from '../controllers/property.controller';\n\nconst router = Router();\n\nrouter.get('/', PropertyController.getAllProperties);\nrouter.get('/:id', PropertyController.getPropertyById);\nrouter.post('/', PropertyController.createProperty);\nrouter.put('/:id', PropertyController.updateProperty);\nrouter.delete('/:id', PropertyController.deleteProperty);\nrouter.post('/search', PropertyController.searchProperties);\n\nexport default router;"
    },
    {
      "type": "createFile",
      "path": "src/controllers/property.controller.ts",
      "content": "import { Request, Response } from 'express';\nimport Property from '../models/property.model';\nimport { Op } from 'sequelize';\n\n// Get all properties\nexport const getAllProperties = async (req: Request, res: Response) => {\n  try {\n    const properties = await Property.findAll();\n    return res.status(200).json(properties);\n  } catch (error) {\n    console.error('Error fetching properties:', error);\n    return res.status(500).json({ message: 'Internal server error' });\n  }\n};\n\n// Get property by ID\nexport const getPropertyById = async (req: Request, res: Response) => {\n  try {\n    const { id } = req.params;\n    const property = await Property.findByPk(id);\n    \n    if (!property) {\n      return res.status(404).json({ message: 'Property not found' });\n    }\n    \n    return res.status(200).json(property);\n  } catch (error) {\n    console.error('Error fetching property:', error);\n    return res.status(500).json({ message: 'Internal server error' });\n  }\n};\n\n// Create new property\nexport const createProperty = async (req: Request, res: Response) => {\n  try {\n    const property = await Property.create(req.body);\n    return res.status(201).json(property);\n  } catch (error) {\n    console.error('Error creating property:', error);\n    return res.status(500).json({ message: 'Internal server error' });\n  }\n};\n\n// Update property\nexport const updateProperty = async (req: Request, res: Response) => {\n  try {\n    const { id } = req.params;\n    const [updated] = await Property.update(req.body, {\n      where: { id }\n    });\n    \n    if (updated === 0) {\n      return res.status(404).json({ message: 'Property not found' });\n    }\n    \n    const updatedProperty = await Property.findByPk(id);\n    return res.status(200).json(updatedProperty);\n  } catch (error) {\n    console.error('Error updating property:', error);\n    return res.status(500).json({ message: 'Internal server error' });\n  }\n};\n\n// Delete property\nexport const deleteProperty = async (req: Request, res: Response) => {\n  try {\n    const { id } = req.params;\n    const deleted = await Property.destroy({\n      where: { id }\n    });\n    \n    if (deleted === 0) {\n      return res.status(404).json({ message: 'Property not found' });\n    }\n    \n    return res.status(204).send();\n  } catch (error) {\n    console.error('Error deleting property:', error);\n    return res.status(500).json({ message: 'Internal server error' });\n  }\n};\n\n// Search properties\nexport const searchProperties = async (req: Request, res: Response) => {\n  try {\n    const { location, minPrice, maxPrice, bedrooms, propertyType } = req.body;\n    \n    const whereClause: any = {};\n    \n    if (location) {\n      whereClause.location = { [Op.iLike]: `%${location}%` };\n    }\n    \n    if (minPrice || maxPrice) {\n      whereClause.price = {};\n      if (minPrice) whereClause.price[Op.gte] = minPrice;\n      if (maxPrice) whereClause.price[Op.lte] = maxPrice;\n    }\n    \n    if (bedrooms) {\n      whereClause.bedrooms = { [Op.gte]: bedrooms };\n    }\n    \n    if (propertyType) {\n      whereClause.propertyType = propertyType;\n    }\n    \n    const properties = await Property.findAll({ where: whereClause });\n    return res.status(200).json(properties);\n  } catch (error) {\n    console.error('Error searching properties:', error);\n    return res.status(500).json({ message: 'Internal server error' });\n  }\n};"
    },
    {
      "type": "createFile",
      "path": ".gitignore",
      "content": "# Dependencies\nnode_modules/\n\n# Build output\ndist/\nbuild/\n\n# Environment variables\n.env\n\n# Logs\nlogs/\n*.log\nnpm-debug.log*\n\n# IDE files\n.idea/\n.vscode/\n*.sublime-project\n*.sublime-workspace\n\n# OS files\n.DS_Store\nThumbs.db\n\n# Test coverage\ncoverage/"
    },
    {
      "type": "executeCommand",
      "command": "npm install"
    }
  ]
}
```

## Flow: PGVector Migration <a name="flow-pgvector-migration"></a>

This flow sets up pgvector extension in PostgreSQL and creates migration scripts for vector embeddings.

```json
{
  "name": "PGVector Migration Setup",
  "description": "Sets up pgvector extension and creates migration scripts for vector embeddings in the UAE Real-Estate AI project",
  "uid": "flow_pgvector_migration",
  "actions": [
    {
      "type": "createDirectory",
      "path": "migrations"
    },
    {
      "type": "createFile",
      "path": "migrations/01_create_pgvector_extension.sql",
      "content": "-- Enable the pgvector extension\nCREATE EXTENSION IF NOT EXISTS vector;\n\n-- Comment explaining the purpose\nCOMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw index access methods';"
    },
    {
      "type": "createFile",
      "path": "migrations/02_create_embeddings_table.sql",
      "content": "-- Create table for property embeddings\nCREATE TABLE IF NOT EXISTS property_embeddings (\n  id UUID PRIMARY KEY REFERENCES properties(id) ON DELETE CASCADE,\n  embedding vector(1536) NOT NULL,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\n\n-- Create index for similarity search\nCREATE INDEX IF NOT EXISTS property_embeddings_idx ON property_embeddings USING hnsw (embedding vector_cosine_ops);\n\n-- Function to update the updated_at timestamp\nCREATE OR REPLACE FUNCTION update_updated_at_column()\nRETURNS TRIGGER AS $$\nBEGIN\n    NEW.updated_at = CURRENT_TIMESTAMP;\n    RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;\n\n-- Trigger to automatically update the updated_at column\nCREATE TRIGGER update_property_embeddings_updated_at\nBEFORE UPDATE ON property_embeddings\nFOR EACH ROW\nEXECUTE FUNCTION update_updated_at_column();"
    },
    {
      "type": "createFile",
      "path": "src/utils/vector.ts",
      "content": "import { Pool } from 'pg';\nimport dotenv from 'dotenv';\n\ndotenv.config();\n\nconst pool = new Pool({\n  host: process.env.DB_HOST || 'localhost',\n  port: parseInt(process.env.DB_PORT || '5432', 10),\n  database: process.env.DB_NAME || 'real_estate_ai',\n  user: process.env.DB_USER || 'postgres',\n  password: process.env.DB_PASSWORD || 'postgres',\n});\n\n/**\n * Store a vector embedding for a property\n * @param propertyId - The UUID of the property\n * @param embedding - The vector embedding (1536 dimensions)\n */\nexport async function storeEmbedding(propertyId: string, embedding: number[]): Promise<void> {\n  try {\n    const query = `\n      INSERT INTO property_embeddings (id, embedding)\n      VALUES ($1, $2)\n      ON CONFLICT (id) DO UPDATE SET\n        embedding = $2,\n        updated_at = CURRENT_TIMESTAMP\n    `;\n    \n    await pool.query(query, [propertyId, embedding]);\n    console.log(`Stored embedding for property ${propertyId}`);\n  } catch (error) {\n    console.error('Error storing embedding:', error);\n    throw error;\n  }\n}\n\n/**\n * Find similar properties using vector similarity search\n * @param embedding - The query vector embedding\n * @param limit - Maximum number of results to return\n * @param threshold - Minimum similarity threshold (0-1)\n */\nexport async function findSimilarProperties(embedding: number[], limit: number = 10, threshold: number = 0.7): Promise<any[]> {\n  try {\n    const query = `\n      SELECT p.*, 1 - (e.embedding <=> $1) AS similarity\n      FROM property_embeddings e\n      JOIN properties p ON e.id = p.id\n      WHERE 1 - (e.embedding <=> $1) > $3\n      ORDER BY similarity DESC\n      LIMIT $2\n    `;\n    \n    const result = await pool.query(query, [embedding, limit, threshold]);\n    return result.rows;\n  } catch (error) {\n    console.error('Error finding similar properties:', error);\n    throw error;\n  }\n}\n\n/**\n * Generate embeddings for all properties without embeddings\n * @param generateEmbeddingFn - Function to generate embeddings from property data\n */\nexport async function generateMissingEmbeddings(generateEmbeddingFn: (property: any) => Promise<number[]>): Promise<void> {\n  try {\n    // Find properties without embeddings\n    const findQuery = `\n      SELECT p.*\n      FROM properties p\n      LEFT JOIN property_embeddings e ON p.id = e.id\n      WHERE e.id IS NULL\n    `;\n    \n    const properties = await pool.query(findQuery);\n    \n    console.log(`Found ${properties.rowCount} properties without embeddings`);\n    \n    // Generate and store embeddings for each property\n    for (const property of properties.rows) {\n      const embedding = await generateEmbeddingFn(property);\n      await storeEmbedding(property.id, embedding);\n    }\n    \n    console.log('Finished generating missing embeddings');\n  } catch (error) {\n    console.error('Error generating missing embeddings:', error);\n    throw error;\n  }\n}"
    },
    {
      "type": "createFile",
      "path": "src/scripts/run-migrations.ts",
      "content": "import { Pool } from 'pg';\nimport fs from 'fs';\nimport path from 'path';\nimport dotenv from 'dotenv';\n\ndotenv.config();\n\nasync function runMigrations() {\n  const pool = new Pool({\n    host: process.env.DB_HOST || 'localhost',\n    port: parseInt(process.env.DB_PORT || '5432', 10),\n    database: process.env.DB_NAME || 'real_estate_ai',\n    user: process.env.DB_USER || 'postgres',\n    password: process.env.DB_PASSWORD || 'postgres',\n  });\n\n  try {\n    // Create migrations table if it doesn't exist\n    await pool.query(`\n      CREATE TABLE IF NOT EXISTS migrations (\n        id SERIAL PRIMARY KEY,\n        name VARCHAR(255) NOT NULL,\n        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n      )\n    `);\n\n    // Get list of executed migrations\n    const { rows: executedMigrations } = await pool.query('SELECT name FROM migrations');\n    const executedMigrationNames = executedMigrations.map(row => row.name);\n\n    // Read migration files\n    const migrationsDir = path.join(__dirname, '../../migrations');\n    const migrationFiles = fs.readdirSync(migrationsDir)\n      .filter(file => file.endsWith('.sql'))\n      .sort(); // Ensure migrations run in order\n\n    // Execute migrations that haven't been run yet\n    for (const file of migrationFiles) {\n      if (!executedMigrationNames.includes(file)) {\n        console.log(`Running migration: ${file}`);\n        const filePath = path.join(migrationsDir, file);\n        const sql = fs.readFileSync(filePath, 'utf8');\n\n        // Start a transaction for each migration\n        const client = await pool.connect();\n        try {\n          await client.query('BEGIN');\n          await client.query(sql);\n          await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);\n          await client.query('COMMIT');\n          console.log(`Migration ${file} completed successfully`);\n        } catch (error) {\n          await client.query('ROLLBACK');\n          console.error(`Error running migration ${file}:`, error);\n          throw error;\n        } finally {\n          client.release();\n        }\n      } else {\n        console.log(`Migration ${file} already executed, skipping`);\n      }\n    }\n\n    console.log('All migrations completed successfully');\n  } catch (error) {\n    console.error('Migration error:', error);\n    process.exit(1);\n  } finally {\n    await pool.end();\n  }\n}\n\nrunMigrations().catch(console.error);"
    },
    {
      "type": "updateFile",
      "path": "package.json",
      "updates": [
        {
          "type": "addScript",
          "name": "migrate",
          "value": "ts-node src/scripts/run-migrations.ts"
        },
        {
          "type": "addDependency",
          "name": "pg-vector",
          "version": "^0.2.0"
        }
      ]
    },
    {
      "type": "createFile",
      "path": "src/controllers/search.controller.ts",
      "content": "import { Request, Response } from 'express';\nimport { findSimilarProperties } from '../utils/vector';\nimport { generateEmbedding } from '../services/embedding.service';\n\n// Semantic search for properties\nexport const semanticSearch = async (req: Request, res: Response) => {\n  try {\n    const { query, limit = 10, threshold = 0.7 } = req.body;\n    \n    if (!query) {\n      return res.status(400).json({ message: 'Query is required' });\n    }\n    \n    // Generate embedding for the search query\n    const embedding = await generateEmbedding(query);\n    \n    // Find similar properties using vector similarity\n    const properties = await findSimilarProperties(\n      embedding,\n      parseInt(limit as string, 10),\n      parseFloat(threshold as string)\n    );\n    \n    return res.status(200).json(properties);\n  } catch (error) {\n    console.error('Error in semantic search:', error);\n    return res.status(500).json({ message: 'Internal server error' });\n  }\n};"
    },
    {
      "type": "createFile",
      "path": "src/services/embedding.service.ts",
      "content": "import { Configuration, OpenAIApi } from 'openai';\nimport dotenv from 'dotenv';\n\ndotenv.config();\n\nconst configuration = new Configuration({\n  apiKey: process.env.OPENAI_API_KEY,\n});\n\nconst openai = new OpenAIApi(configuration);\n\n/**\n * Generate an embedding for text using OpenAI's embedding model\n * @param text - The text to generate an embedding for\n * @returns A vector embedding (array of numbers)\n */\nexport async function generateEmbedding(text: string): Promise<number[]> {\n  try {\n    const response = await openai.createEmbedding({\n      model: 'text-embedding-3-large',\n      input: text,\n    });\n    \n    return response.data.data[0].embedding;\n  } catch (error) {\n    console.error('Error generating embedding:', error);\n    throw error;\n  }\n}\n\n/**\n * Generate an embedding for a property based on its description and features\n * @param property - The property object\n * @returns A vector embedding (array of numbers)\n */\nexport async function generatePropertyEmbedding(property: any): Promise<number[]> {\n  // Create a rich text representation of the property\n  const propertyText = [\n    `Title: ${property.title}`,\n    `Description: ${property.description}`,\n    `Location: ${property.location}`,\n    `Property Type: ${property.propertyType}`,\n    `Bedrooms: ${property.bedrooms}`,\n    `Bathrooms: ${property.bathrooms}`,\n    `Area: ${property.area} sq ft`,\n    `Price: ${property.price}`,\n  ].join('\\n');\n  \n  return generateEmbedding(propertyText);\n}"
    },
    {
      "type": "updateFile",
      "path": "src/routes/property.routes.ts",
      "updates": [
        {
          "type": "addImport",
          "import": "import * as SearchController from '../controllers/search.controller';"
        },
        {
          "type": "addRoute",
          "route": "router.post('/semantic-search', SearchController.semanticSearch);"
        }
      ]
    }
  ]
}
```

## Flow: Langfuse Trace <a name="flow-langfuse-trace"></a>

This flow sets up Langfuse tracing for monitoring and observability of LLM operations.

```json
{
  "name": "Langfuse Tracing Setup",
  "description": "Integrates Langfuse for LLM observability and tracing in the UAE Real-Estate AI project",
  "uid": "flow_langfuse_trace",
  "actions": [
    {
      "type": "createDirectory",
      "path": "src/observability"
    },
    {
      "type": "updateFile",
      "path": "package.json",
      "updates": [
        {
          "type": "addDependency",
          "name": "langfuse",
          "version": "^2.0.0"
        }
      ]
    },
    {
      "type": "createFile",
      "path": "src/observability/langfuse.ts",
      "content": "import { Langfuse } from 'langfuse';\nimport dotenv from 'dotenv';\n\ndotenv.config();\n\n// Initialize Langfuse client\nexport const langfuse = new Langfuse({\n  publicKey: process.env.LANGFUSE_PUBLIC_KEY || '',\n  secretKey: process.env.LANGFUSE_SECRET_KEY || '',\n  baseUrl: process.env.LANGFUSE_HOST || 'https://cloud.langfuse.com',\n});\n\n// Create a new trace for a user session\nexport function createTrace(userId: string, sessionId: string, metadata?: Record<string, any>) {\n  return langfuse.trace({\n    name: 'user_session',\n    userId,\n    sessionId,\n    metadata,\n  });\n}\n\n// Log an LLM generation\nexport function logGeneration(trace: any, name: string, model: string, prompt: string, completion: string, metadata?: Record<string, any>) {\n  return trace.generation({\n    name,\n    model,\n    prompt,\n    completion,\n    metadata,\n  });\n}\n\n// Log a span for timing operations\nexport function startSpan(trace: any, name: string, metadata?: Record<string, any>) {\n  return trace.span({\n    name,\n    metadata,\n  });\n}\n\n// Log an event\nexport function logEvent(trace: any, name: string, metadata?: Record<string, any>) {\n  return trace.event({\n    name,\n    metadata,\n  });\n}\n\n// Score a generation or trace\nexport function scoreGeneration(generationId: string, name: string, value: number, comment?: string) {\n  return langfuse.score({\n    generationId,\n    name,\n    value,\n    comment,\n  });\n}\n\n// Middleware for Express to create a trace for each request\nexport function langfuseMiddleware() {\n  return (req: any, res: any, next: any) => {\n    // Create a trace for the request\n    const trace = langfuse.trace({\n      name: `${req.method} ${req.path}`,\n      userId: req.user?.id || 'anonymous',\n      metadata: {\n        method: req.method,\n        path: req.path,\n        query: req.query,\n        ip: req.ip,\n        userAgent: req.get('user-agent'),\n      },\n    });\n    \n    // Attach trace to request object\n    req.langfuseTrace = trace;\n    \n    // Capture response\n    const originalSend = res.send;\n    res.send = function(body: any) {\n      // Log response in trace\n      trace.update({\n        metadata: {\n          ...trace.metadata,\n          statusCode: res.statusCode,\n          responseTime: Date.now() - req.startTime,\n        },\n      });\n      \n      // End the trace\n      trace.end();\n      \n      // Call original send\n      return originalSend.call(this, body);\n    };\n    \n    // Store request start time\n    req.startTime = Date.now();\n    \n    next();\n  };\n}"
    },
    {
      "type": "createFile",
      "path": "src/services/llm.service.ts",
      "content": "import { Configuration, OpenAIApi } from 'openai';\nimport { logGeneration } from '../observability/langfuse';\nimport dotenv from 'dotenv';\n\ndotenv.config();\n\nconst configuration = new Configuration({\n  apiKey: process.env.OPENAI_API_KEY,\n});\n\nconst openai = new OpenAIApi(configuration);\n\n/**\n * Generate text using OpenAI's GPT model with Langfuse tracing\n * @param prompt - The prompt to send to the model\n * @param trace - The Langfuse trace object\n * @param options - Additional options for the API call\n * @returns The generated text\n */\nexport async function generateText(prompt: string, trace: any, options: any = {}) {\n  try {\n    const defaultOptions = {\n      model: 'gpt-4',\n      temperature: 0.7,\n      max_tokens: 500,\n      name: 'text_generation',\n    };\n    \n    const mergedOptions = { ...defaultOptions, ...options };\n    const { model, temperature, max_tokens, name } = mergedOptions;\n    \n    const response = await openai.createCompletion({\n      model,\n      prompt,\n      temperature,\n      max_tokens,\n    });\n    \n    const completion = response.data.choices[0].text || '';\n    \n    // Log the generation to Langfuse\n    logGeneration(trace, name, model, prompt, completion, {\n      temperature,\n      max_tokens,\n      tokens: response.data.usage,\n    });\n    \n    return completion;\n  } catch (error) {\n    console.error('Error generating text:', error);\n    throw error;\n  }\n}\n\n/**\n * Generate a property description using AI\n * @param propertyData - The property data to generate a description for\n * @param trace - The Langfuse trace object\n * @returns A professionally written property description\n */\nexport async function generatePropertyDescription(propertyData: any, trace: any): Promise<string> {\n  const prompt = `\n    Write a professional and appealing real estate description for the following property:\n    \n    Location: ${propertyData.location}\n    Property Type: ${propertyData.propertyType}\n    Bedrooms: ${propertyData.bedrooms}\n    Bathrooms: ${propertyData.bathrooms}\n    Area: ${propertyData.area} sq ft\n    Price: ${propertyData.price} AED\n    Features: ${propertyData.features || 'N/A'}\n    \n    The description should be engaging, highlight the key selling points, and be appropriate for the UAE real estate market.\n  `;\n  \n  return generateText(prompt, trace, {\n    name: 'property_description',\n    temperature: 0.6,\n    max_tokens: 300,\n  });\n}"
    },
    {
      "type": "updateFile",
      "path": "src/index.ts",
      "updates": [
        {
          "type": "addImport",
          "import": "import { langfuseMiddleware } from './observability/langfuse';"
        },
        {
          "type": "addMiddleware",
          "middleware": "app.use(langfuseMiddleware());"
        }
      ]
    },
    {
      "type": "createFile",
      "path": "src/controllers/proposal.controller.ts",
      "content": "import { Request, Response } from 'express';\nimport { generatePropertyDescription } from '../services/llm.service';\nimport { createTrace } from '../observability/langfuse';\n\n// Generate a property proposal\nexport const generateProposal = async (req: Request, res: Response) => {\n  try {\n    const { propertyId, clientId } = req.body;\n    \n    if (!propertyId || !clientId) {\n      return res.status(400).json({ message: 'Property ID and client ID are required' });\n    }\n    \n    // Create a trace for this proposal generation\n    const trace = createTrace(clientId, req.sessionID || 'unknown', {\n      propertyId,\n      operation: 'generate_proposal',\n    });\n    \n    // Start a span for the database query\n    const dbSpan = trace.span({ name: 'fetch_property_data' });\n    \n    // Fetch property data (mock for this example)\n    const propertyData = {\n      id: propertyId,\n      location: 'Downtown Dubai',\n      propertyType: 'Apartment',\n      bedrooms: 2,\n      bathrooms: 2,\n      area: 1200,\n      price: 1500000,\n      features: 'Balcony, Pool, Gym, 24/7 Security',\n    };\n    \n    // End the database span\n    dbSpan.end();\n    \n    // Generate property description\n    const description = await generatePropertyDescription(propertyData, trace);\n    \n    // Log the completion of the proposal generation\n    trace.event({\n      name: 'proposal_generated',\n      metadata: {\n        propertyId,\n        clientId,\n        descriptionLength: description.length,\n      },\n    });\n    \n    // End the trace\n    trace.end();\n    \n    return res.status(200).json({\n      propertyId,\n      clientId,\n      description,\n      generatedAt: new Date().toISOString(),\n    });\n  } catch (error) {\n    console.error('Error generating proposal:', error);\n    return res.status(500).json({ message: 'Internal server error' });\n  }\n};"
    },
    {
      "type": "createFile",
      "path": "src/routes/proposal.routes.ts",
      "content": "import { Router } from 'express';\nimport * as ProposalController from '../controllers/proposal.controller';\n\nconst router = Router();\n\nrouter.post('/generate', ProposalController.generateProposal);\n\nexport default router;"
    },
    {
      "type": "updateFile",
      "path": "src/index.ts",
      "updates": [
        {
          "type": "addImport",
          "import": "import proposalRoutes from './routes/proposal.routes';"
        },
        {
          "type": "addRoute",
          "route": "app.use('/api/proposals', proposalRoutes);"
        }
      ]
    }
  ]
}
```

## Flow: Deploy Helm <a name="flow-deploy-helm"></a>

This flow sets up Helm charts for Kubernetes deployment of the UAE Real-Estate AI project.

```json
{
  "name": "Helm Deployment Setup",
  "description": "Creates Helm charts for Kubernetes deployment of the UAE Real-Estate AI project",
  "uid": "flow_deploy_helm",
  "actions": [
    {
      "type": "createDirectory",
      "path": "helm"
    },
    {
      "type": "createDirectory",
      "path": "helm/real-estate-ai"
    },
    {
      "type": "createDirectory",
      "path": "helm/real-estate-ai/templates"
    },
    {
      "type": "createDirectory",
      "path": "helm/real-estate-ai/charts"
    },
    {
      "type": "createFile",
      "path": "helm/real-estate-ai/Chart.yaml",
      "content": "apiVersion: v2\nname: real-estate-ai\ndescription: A Helm chart for the UAE Real-Estate AI Operating System\ntype: application\nversion: 0.1.0\nappVersion: \"1.0.0\"\n\ndependencies:\n  - name: postgresql\n    version: \"12.1.3\"\n    repository: https://charts.bitnami.com/bitnami\n    condition: postgresql.enabled\n  - name: redis\n    version: \"17.3.14\"\n    repository: https://charts.bitnami.com/bitnami\n    condition: redis.enabled"
    },
    {
      "type": "createFile",
      "path": "helm/real-estate-ai/values.yaml",
      "content": "# Default values for real-estate-ai\n# This is a YAML-formatted file.\n\nreplicaCount: 1\n\nimage:\n  repository: real-estate-ai\n  pullPolicy: IfNotPresent\n  tag: \"latest\"\n\nimagePullSecrets: []\n\nnameOverride: \"\"\nfullnameOverride: \"\"\n\nserviceAccount:\n  create: true\n  annotations: {}\n  name: \"\"\n\npodAnnotations: {}\n\npodSecurityContext: {}\n\nsecurityContext: {}\n\nservice:\n  type: ClusterIP\n  port: 80\n\ningress:\n  enabled: true\n  className: \"nginx\"\n  annotations:\n    kubernetes.io/ingress.class: nginx\n    cert-manager.io/cluster-issuer: letsencrypt-prod\n  hosts:\n    - host: real-estate-ai.example.com\n      paths:\n        - path: /\n          pathType: Prefix\n  tls:\n    - secretName: real-estate-ai-tls\n      hosts:\n        - real-estate-ai.example.com\n\nresources:\n  limits:\n    cpu: 1000m\n    memory: 1Gi\n  requests:\n    cpu: 500m\n    memory: 512Mi\n\nautoscaling:\n  enabled: true\n  minReplicas: 1\n  maxReplicas: 5\n  targetCPUUtilizationPercentage: 80\n  targetMemoryUtilizationPercentage: 80\n\nnodeSelector: {}\n\ntolerations: []\n\naffinity: {}\n\n# Application configuration\nconfig:\n  env: production\n  logLevel: info\n\n# Database configuration\npostgresql:\n  enabled: true\n  auth:\n    username: real_estate_ai\n    password: \"\"\n    database: real_estate_ai\n  primary:\n    persistence:\n      size: 10Gi\n  metrics:\n    enabled: true\n\n# Redis configuration\nredis:\n  enabled: true\n  auth:\n    password: \"\"\n  master:\n    persistence:\n      size: 5Gi\n  metrics:\n    enabled: true\n\n# Langfuse configuration\nlangfuse:\n  enabled: true\n  publicKey: \"\"\n  secretKey: \"\"\n  host: \"https://cloud.langfuse.com\"\n\n# OpenAI configuration\nopenai:\n  apiKey: \"\""
    },
    {
      "type": "createFile",
      "path": "helm/real-estate-ai/templates/deployment.yaml",
      "content": "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: {{ include \"real-estate-ai.fullname\" . }}\n  labels:\n    {{- include \"real-estate-ai.labels\" . | nindent 4 }}\nspec:\n  {{- if not .Values.autoscaling.enabled }}\n  replicas: {{ .Values.replicaCount }}\n  {{- end }}\n  selector:\n    matchLabels:\n      {{- include \"real-estate-ai.selectorLabels\" . | nindent 6 }}\n  template:\n    metadata:\n      {{- with .Values.podAnnotations }}\n      annotations:\n        {{- toYaml . | nindent 8 }}\n      {{- end }}\n      labels:\n        {{- include \"real-estate-ai.selectorLabels\" . | nindent 8 }}\n    spec:\n      {{- with .Values.imagePullSecrets }}\n      imagePullSecrets:\n        {{- toYaml . | nindent 8 }}\n      {{- end }}\n      serviceAccountName: {{ include \"real-estate-ai.serviceAccountName\" . }}\n      securityContext:\n        {{- toYaml .Values.podSecurityContext | nindent 8 }}\n      containers:\n        - name: {{ .Chart.Name }}\n          securityContext:\n            {{- toYaml .Values.securityContext | nindent 12 }}\n          image: \"{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}\"\n          imagePullPolicy: {{ .Values.image.pullPolicy }}\n          env:\n            - name: NODE_ENV\n              value: {{ .Values.config.env }}\n            - name: LOG_LEVEL\n              value: {{ .Values.config.logLevel }}\n            - name: PORT\n              value: \"3000\"\n            - name: DB_HOST\n              value: {{ include \"real-estate-ai.fullname\" . }}-postgresql\n            - name: DB_PORT\n              value: \"5432\"\n            - name: DB_NAME\n              value: {{ .Values.postgresql.auth.database }}\n            - name: DB_USER\n              value: {{ .Values.postgresql.auth.username }}\n            - name: DB_PASSWORD\n              valueFrom:\n                secretKeyRef:\n                  name: {{ include \"real-estate-ai.fullname\" . }}-postgresql\n                  key: password\n            - name: REDIS_HOST\n              value: {{ include \"real-estate-ai.fullname\" . }}-redis-master\n            - name: REDIS_PORT\n              value: \"6379\"\n            - name: REDIS_PASSWORD\n              valueFrom:\n                secretKeyRef:\n                  name: {{ include \"real-estate-ai.fullname\" . }}-redis\n                  key: redis-password\n            - name: LANGFUSE_PUBLIC_KEY\n              valueFrom:\n                secretKeyRef:\n                  name: {{ include \"real-estate-ai.fullname\" . }}-secrets\n                  key: langfuse-public-key\n            - name: LANGFUSE_SECRET_KEY\n              valueFrom:\n                secretKeyRef:\n                  name: {{ include \"real-estate-ai.fullname\" . }}-secrets\n                  key: langfuse-secret-key\n            - name: LANGFUSE_HOST\n              value: {{ .Values.langfuse.host }}\n            - name: OPENAI_API_KEY\n              valueFrom:\n                secretKeyRef:\n                  name: {{ include \"real-estate-ai.fullname\" . }}-secrets\n                  key: openai-api-key\n          ports:\n            - name: http\n              containerPort: 3000\n              protocol: TCP\n          livenessProbe:\n            httpGet:\n              path: /health\n              port: http\n            initialDelaySeconds: 30\n            periodSeconds: 10\n          readinessProbe:\n            httpGet:\n              path: /health\n              port: http\n            initialDelaySeconds: 5\n            periodSeconds: 5\n          resources:\n            {{- toYaml .Values.resources | nindent 12 }}\n      {{- with .Values.nodeSelector }}\n      nodeSelector:\n        {{- toYaml . | nindent 8 }}\n      {{- end }}\n      {{- with .Values.affinity }}\n      affinity:\n        {{- toYaml . | nindent 8 }}\n      {{- end }}\n      {{- with .Values.tolerations }}\n      tolerations:\n        {{- toYaml . | nindent 8 }}\n      {{- end }}"
    },
    {
      "type": "createFile",
      "path": "helm/real-estate-ai/templates/service.yaml",
      "content": "apiVersion: v1\nkind: Service\nmetadata:\n  name: {{ include \"real-estate-ai.fullname\" . }}\n  labels:\n    {{- include \"real-estate-ai.labels\" . | nindent 4 }}\nspec:\n  type: {{ .Values.service.type }}\n  ports:\n    - port: {{ .Values.service.port }}\n      targetPort: http\n      protocol: TCP\n      name: http\n  selector:\n    {{- include \"real-estate-ai.selectorLabels\" . | nindent 4 }}"
    },
    {
      "type": "createFile",
      "path": "helm/real-estate-ai/templates/ingress.yaml",
      "content": "{{- if .Values.ingress.enabled -}}\n{{- $fullName := include \"real-estate-ai.fullname\" . -}}\n{{- $svcPort := .Values.service.port -}}\n{{- if and .Values.ingress.className (not (semverCompare \">=1.18-0\" .Capabilities.KubeVersion.GitVersion)) }}\n  {{- if not (hasKey .Values.ingress.annotations \"kubernetes.io/ingress.class\") }}\n  {{- $_ := set .Values.ingress.annotations \"kubernetes.io/ingress.class\" .Values.ingress.className}}\n  {{- end }}\n{{- end }}\n{{- if semverCompare \">=1.19-0\" .Capabilities.KubeVersion.GitVersion -}}\napiVersion: networking.k8s.io/v1\n{{- else if semverCompare \">=1.14-0\" .Capabilities.KubeVersion.GitVersion -}}\napiVersion: networking.k8s.io/v1beta1\n{{- else -}}\napiVersion: extensions/v1beta1\n{{- end }}\nkind: Ingress\nmetadata:\n  name: {{ $fullName }}\n  labels:\n    {{- include \"real-estate-ai.labels\" . | nindent 4 }}\n  {{- with .Values.ingress.annotations }}\n  annotations:\n    {{- toYaml . | nindent 4 }}\n  {{- end }}\nspec:\n  {{- if and .Values.ingress.className (semverCompare \">=1.18-0\" .Capabilities.KubeVersion.GitVersion) }}\n  ingressClassName: {{ .Values.ingress.className }}\n  {{- end }}\n  {{- if .Values.ingress.tls }}\n  tls:\n    {{- range .Values.ingress.tls }}\n    - hosts:\n        {{- range .hosts }}\n        - {{ . | quote }}\n        {{- end }}\n      secretName: {{ .secretName }}\n    {{- end }}\n  {{- end }}\n  rules:\n    {{- range .Values.ingress.hosts }}\n    - host: {{ .host | quote }}\n      http:\n        paths:\n          {{- range .paths }}\n          - path: {{ .path }}\n            {{- if and .pathType (semverCompare \">=1.18-0\" $.Capabilities.KubeVersion.GitVersion) }}\n            pathType: {{ .pathType }}\n            {{- end }}\n            backend:\n              {{- if semverCompare \">=1.19-0\" $.Capabilities.KubeVersion.GitVersion }}\n              service:\n                name: {{ $fullName }}\n                port:\n                  number: {{ $svcPort }}\n              {{- else }}\n              serviceName: {{ $fullName }}\n              servicePort: {{ $svcPort }}\n              {{- end }}\n          {{- end }}\n    {{- end }}\n{{- end }}"
    },
    {
      "type": "createFile",
      "path": "helm/real-estate-ai/templates/secrets.yaml",
      "content": "apiVersion: v1\nkind: Secret\nmetadata:\n  name: {{ include \"real-estate-ai.fullname\" . }}-secrets\n  labels:\n    {{- include \"real-estate-ai.labels\" . | nindent 4 }}\ntype: Opaque\ndata:\n  langfuse-public-key: {{ .Values.langfuse.publicKey | b64enc | quote }}\n  langfuse-secret-key: {{ .Values.langfuse.secretKey | b64enc | quote }}\n  openai-api-key: {{ .Values.openai.apiKey | b64enc | quote }}"
    },
    {
      "type": "createFile",
      "path": "helm/real-estate-ai/templates/serviceaccount.yaml",
      "content": "{{- if .Values.serviceAccount.create -}}\napiVersion: v1\nkind: ServiceAccount\nmetadata:\n  name: {{ include \"real-estate-ai.serviceAccountName\" . }}\n  labels:\n    {{- include \"real-estate-ai.labels\" . | nindent 4 }}\n  {{- with .Values.serviceAccount.annotations }}\n  annotations:\n    {{- toYaml . | nindent 4 }}\n  {{- end }}\n{{- end }}"
    },
    {
      "type": "createFile",
      "path": "helm/real-estate-ai/templates/hpa.yaml",
      "content": "{{- if .Values.autoscaling.enabled }}\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: {{ include \"real-estate-ai.fullname\" . }}\n  labels:\n    {{- include \"real-estate-ai.labels\" . | nindent 4 }}\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: {{ include \"real-estate-ai.fullname\" . }}\n  minReplicas: {{ .Values.autoscaling.minReplicas }}\n  maxReplicas: {{ .Values.autoscaling.maxReplicas }}\n  metrics:\n    {{- if .Values.autoscaling.targetCPUUtilizationPercentage }}\n    - type: Resource\n      resource:\n        name: cpu\n        target:\n          type: Utilization\n          averageUtilization: {{ .Values.autoscaling.targetCPUUtilizationPercentage }}\n    {{- end }}\n    {{- if .Values.autoscaling.targetMemoryUtilizationPercentage }}\n    - type: Resource\n      resource:\n        name: memory\n        target:\n          type: Utilization\n          averageUtilization: {{ .Values.autoscaling.targetMemoryUtilizationPercentage }}\n    {{- end }}\n{{- end }}"
    },
    {
      "type": "createFile",
      "path": "helm/real-estate-ai/templates/_helpers.tpl",
      "content": "{{/*\nExpand the name of the chart.\n*/}}\n{{- define \"real-estate-ai.name\" -}}\n{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix \"-\" }}\n{{- end }}\n\n{{/*\nCreate a default fully qualified app name.\nWe truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).\nIf release name contains chart name it will be used as a full name.\n*/}}\n{{- define \"real-estate-ai.fullname\" -}}\n{{- if .Values.fullnameOverride }}\n{{- .Values.fullnameOverride | trunc 63 | trimSuffix \"-\" }}\n{{- else }}\n{{- $name := default .Chart.Name .Values.nameOverride }}\n{{- if contains $name .Release.Name }}\n{{- .Release.Name | trunc 63 | trimSuffix \"-\" }}\n{{- else }}\n{{- printf \"%s-%s\" .Release.Name $name | trunc 63 | trimSuffix \"-\" }}\n{{- end }}\n{{- end }}\n{{- end }}\n\n{{/*\nCreate chart name and version as used by the chart label.\n*/}}\n{{- define \"real-estate-ai.chart\" -}}\n{{- printf \"%s-%s\" .Chart.Name .Chart.Version | replace \"+\" \"_\" | trunc 63 | trimSuffix \"-\" }}\n{{- end }}\n\n{{/*\nCommon labels\n*/}}\n{{- define \"real-estate-ai.labels\" -}}\nhelm.sh/chart: {{ include \"real-estate-ai.chart\" . }}\n{{ include \"real-estate-ai.selectorLabels\" . }}\n{{- if .Chart.AppVersion }}\napp.kubernetes.io/version: {{ .Chart.AppVersion | quote }}\n{{- end }}\napp.kubernetes.io/managed-by: {{ .Release.Service }}\n{{- end }}\n\n{{/*\nSelector labels\n*/}}\n{{- define \"real-estate-ai.selectorLabels\" -}}\napp.kubernetes.io/name: {{ include \"real-estate-ai.name\" . }}\napp.kubernetes.io/instance: {{ .Release.Name }}\n{{- end }}\n\n{{/*\nCreate the name of the service account to use\n*/}}\n{{- define \"real-estate-ai.serviceAccountName\" -}}\n{{- if .Values.serviceAccount.create }}\n{{- default (include \"real-estate-ai.fullname\" .) .Values.serviceAccount.name }}\n{{- else }}\n{{- default \"default\" .Values.serviceAccount.name }}\n{{- end }}\n{{- end }}"
    },
    {
      "type": "createFile",
      "path": "helm/real-estate-ai/templates/NOTES.txt",
      "content": "1. Get the application URL by running these commands:\n{{- if .Values.ingress.enabled }}\n{{- range $host := .Values.ingress.hosts }}\n  {{- range .paths }}\n  http{{ if $.Values.ingress.tls }}s{{ end }}://{{ $host.host }}{{ .path }}\n  {{- end }}\n{{- end }}\n{{- else if contains \"NodePort\" .Values.service.type }}\n  export NODE_PORT=$(kubectl get --namespace {{ .Release.Namespace }} -o jsonpath=\"{.spec.ports[0].nodePort}\" services {{ include \"real-estate-ai.fullname\" . }})\n  export NODE_IP=$(kubectl get nodes --namespace {{ .Release.Namespace }} -o jsonpath=\"{.items[0].status.addresses[0].address}\")\n  echo http://$NODE_IP:$NODE_PORT\n{{- else if contains \"LoadBalancer\" .Values.service.type }}\n     NOTE: It may take a few minutes for the LoadBalancer IP to be available.\n           You can watch the status of by running 'kubectl get --namespace {{ .Release.Namespace }} svc -w {{ include \"real-estate-ai.fullname\" . }}'\n  export SERVICE_IP=$(kubectl get svc --namespace {{ .Release.Namespace }} {{ include \"real-estate-ai.fullname\" . }} --template \"{{ \"{{ range (index .status.loadBalancer.ingress 0) }}{{ . }}{{ end }}\" }}\")\n  echo http://$SERVICE_IP:{{ .Values.service.port }}\n{{- else if contains \"ClusterIP\" .Values.service.type }}\n  export POD_NAME=$(kubectl get pods --namespace {{ .Release.Namespace }} -l \"app.kubernetes.io/name={{ include \"real-estate-ai.name\" . }},app.kubernetes.io/instance={{ .Release.Name }}\" -o jsonpath=\"{.items[0].metadata.name}\")\n  export CONTAINER_PORT=$(kubectl get pod --namespace {{ .Release.Namespace }} $POD_NAME -o jsonpath=\"{.spec.containers[0].ports[0].containerPort}\")\n  echo \"Visit http://127.0.0.1:8080 to use your application\"\n  kubectl --namespace {{ .Release.Namespace }} port-forward $POD_NAME 8080:$CONTAINER_PORT\n{{- end }}"
    },
    {
      "type": "createFile",
      "path": "helm/real-estate-ai/.helmignore",
      "content": "# Patterns to ignore when building packages.\n# This supports shell glob matching, relative path matching, and\n# negation (prefixed with !). Only one pattern per line.\n.DS_Store\n# Common VCS dirs\n.git/\n.gitignore\n.bzr/\n.bzrignore\n.hg/\n.hgignore\n.svn/\n# Common backup files\n*.swp\n*.bak\n*.tmp\n*.orig\n*~\n# Various IDEs\n.project\n.idea/\n*.tmproj\n.vscode/"
    },
    {
      "type": "createFile",
      "path": "helm/values-dev.yaml",
      "content": "# Development environment values for real-estate-ai\n\nreplicaCount: 1\n\nimage:\n  repository: real-estate-ai\n  tag: \"dev\"\n\nresources:\n  limits:\n    cpu: 500m\n    memory: 512Mi\n  requests:\n    cpu: 250m\n    memory: 256Mi\n\nautoscaling:\n  enabled: false\n\nconfig:\n  env: development\n  logLevel: debug\n\ningress:\n  enabled: true\n  hosts:\n    - host: dev.real-estate-ai.example.com\n      paths:\n        - path: /\n          pathType: Prefix\n  tls:\n    - secretName: real-estate-ai-dev-tls\n      hosts:\n        - dev.real-estate-ai.example.com\n\npostgresql:\n  primary:\n    persistence:\n      size: 5Gi\n\nredis:\n  master:\n    persistence:\n      size: 2Gi"
    },
    {
      "type": "createFile",
      "path": "helm/values-prod.yaml",
      "content": "# Production environment values for real-estate-ai\n\nreplicaCount: 3\n\nimage:\n  repository: real-estate-ai\n  tag: \"stable\"\n\nresources:\n  limits:\n    cpu: 2000m\n    memory: 2Gi\n  requests:\n    cpu: 1000m\n    memory: 1Gi\n\nautoscaling:\n  enabled: true\n  minReplicas: 3\n  maxReplicas: 10\n\nconfig:\n  env: production\n  logLevel: info\n\ningress:\n  enabled: true\n  annotations:\n    kubernetes.io/ingress.class: nginx\n    cert-manager.io/cluster-issuer: letsencrypt-prod\n    nginx.ingress.kubernetes.io/ssl-redirect: \"true\"\n    nginx.ingress.kubernetes.io/proxy-body-size: \"10m\"\n  hosts:\n    - host: real-estate-ai.example.com\n      paths:\n        - path: /\n          pathType: Prefix\n  tls:\n    - secretName: real-estate-ai-tls\n      hosts:\n        - real-estate-ai.example.com\n\npostgresql:\n  primary:\n    persistence:\n      size: 50Gi\n  replication:\n    enabled: true\n    readReplicas: 1\n  metrics:\n    enabled: true\n    serviceMonitor:\n      enabled: true\n\nredis:\n  architecture: replication\n  master:\n    persistence:\n      size: 10Gi\n  replica:\n    replicaCount: 2\n  metrics:\n    enabled: true\n    serviceMonitor:\n      enabled: true"
    },
    {
      "type": "createFile",
      "path": "Dockerfile",
      "content": "# Build stage\nFROM node:18-alpine AS build\n\nWORKDIR /app\n\n# Copy package files and install dependencies\nCOPY package*.json ./\nRUN npm ci\n\n# Copy source code\nCOPY . .\n\n# Build the application\nRUN npm run build\n\n# Production stage\nFROM node:18-alpine\n\nWORKDIR /app\n\n# Set environment variables\nENV NODE_ENV=production\n\n# Copy package files and install production dependencies\nCOPY package*.json ./\nRUN npm ci --only=production\n\n# Copy built application from build stage\nCOPY --from=build /app/dist ./dist\n\n# Copy migrations\nCOPY --from=build /app/migrations ./migrations\n\n# Expose the application port\nEXPOSE 3000\n\n# Start the application\nCMD [\"node\", \"dist/index.js\"]"
    },
    {
      "type": "createFile",
      "path": "scripts/deploy.sh",
      "content": "#!/bin/bash\n\n# Deploy script for the UAE Real-Estate AI Operating System\n\nset -e\n\n# Default values\nENVIRONMENT=\"dev\"\nNAMESPACE=\"real-estate-ai\"\nRELEASE_NAME=\"real-estate-ai\"\n\n# Parse command line arguments\nwhile [[ $# -gt 0 ]]; do\n  key=\"$1\"\n  case $key in\n    -e|--environment)\n      ENVIRONMENT=\"$2\"\n      shift\n      shift\n      ;;\n    -n|--namespace)\n      NAMESPACE=\"$2\"\n      shift\n      shift\n      ;;\n    -r|--release-name)\n      RELEASE_NAME=\"$2\"\n      shift\n      shift\n      ;;\n    *)\n      echo \"Unknown option: $1\"\n      exit 1\n      ;;\n  esac\ndo\n\n# Validate environment\nif [[ \"$ENVIRONMENT\" != \"dev\" && \"$ENVIRONMENT\" != \"staging\" && \"$ENVIRONMENT\" != \"prod\" ]]; then\n  echo \"Invalid environment: $ENVIRONMENT. Must be one of: dev, staging, prod\"\n  exit 1\nfi\n\n# Set values file based on environment\nVALUES_FILE=\"helm/values-${ENVIRONMENT}.yaml\"\n\n# Check if values file exists\nif [[ ! -f \"$VALUES_FILE\" ]]; then\n  echo \"Values file not found: $VALUES_FILE\"\n  exit 1\nfi\n\n# Create namespace if it doesn't exist\nkubectl get namespace \"$NAMESPACE\" &> /dev/null || kubectl create namespace \"$NAMESPACE\"\n\n# Add Bitnami repo if not already added\nhelm repo list | grep -q \"bitnami\" || helm repo add bitnami https://charts.bitnami.com/bitnami\n\n# Update Helm repos\nhelm repo update\n\n# Deploy with Helm\necho \"Deploying $RELEASE_NAME to $NAMESPACE environment: $ENVIRONMENT\"\nhelm upgrade --install \"$RELEASE_NAME\" ./helm/real-estate-ai \\\n  --namespace \"$NAMESPACE\" \\\n  --values \"$VALUES_FILE\" \\\n  --timeout 10m \\\n  --wait\n\necho \"Deployment completed successfully!\"\n"
    },
    {
      "type": "executeCommand",
      "command": "chmod +x scripts/deploy.sh"
    }
  ]
}
```

## Flow: Write ADR <a name="flow-write-adr"></a>

This flow creates an Architectural Decision Record (ADR) template and generates a new ADR.

```json
{
  "name": "ADR Writing Flow",
  "description": "Creates an ADR template and generates a new ADR for the UAE Real-Estate AI project",
  "uid": "flow_write_adr",
  "actions": [
    {
      "type": "createDirectory",
      "path": "docs/adr"
    },
    {
      "type": "createFile",
      "path": "docs/adr/template.md",
      "content": "# [ADR-NNN] [Title of the ADR]\n\n## Status\n\n[Proposed | Accepted | Deprecated | Superseded]\n\nIf superseded, include a link to the new ADR.\n\n## Context\n\n[Describe the context and problem statement that this decision addresses. Include any relevant background information, constraints, and alternatives that were considered.]\n\n## Decision\n\n[Clearly state the decision that was made. Be specific and concise.]\n\n## Rationale\n\n[Explain the reasoning behind the decision. Include the factors that were considered, the trade-offs that were evaluated, and why this particular solution was chosen over alternatives.]\n\n## Consequences\n\n[Describe the resulting context after applying the decision. Include both positive and negative consequences.]\n\n### Positive\n\n- [List positive consequences]\n\n### Negative\n\n- [List negative consequences]\n\n### Neutral\n\n- [List neutral consequences]\n\n## Compliance\n\n[Describe how compliance with this decision will be verified or measured.]\n\n## Notes\n\n[Any additional notes, links, or references that provide further context or information.]\n"
    },
    {
      "type": "createFile",
      "path": "docs/adr/001-use-langchain-langgraph-for-multilingual-chatbot.md",
      "content": "# ADR-001: Use LangChain and LangGraph for Multilingual Chatbot\n\n## Status\n\nAccepted\n\n## Context\n\nThe UAE Real-Estate AI Operating System requires a multilingual chatbot interface that can handle conversations in English, Arabic, and French. The chatbot needs to understand natural language queries about properties, assist with property searches, and generate property proposals. It must maintain context across conversation turns and integrate with various backend systems.\n\nWe need to select a framework for building this chatbot that provides:\n\n1. Robust support for multiple languages\n2. Ability to maintain conversation context\n3. Integration with vector databases for semantic search\n4. Flexible orchestration of LLM calls and other tools\n5. Observability and monitoring capabilities\n\nThe following alternatives were considered:\n\n- Custom implementation using direct LLM API calls\n- LangChain with LangGraph\n- LlamaIndex\n- Microsoft Semantic Kernel\n- Haystack by Deepset\n\n## Decision\n\nWe will use LangChain with LangGraph for implementing the multilingual chatbot component of the UAE Real-Estate AI Operating System.\n\n## Rationale\n\nLangChain with LangGraph provides several advantages that align with our requirements:\n\n1. **Multilingual Support**: LangChain works seamlessly with models that support multiple languages, including Arabic and French. It allows for easy integration of translation services and language detection.\n\n2. **Stateful Conversations**: LangGraph extends LangChain with graph-based workflows that can maintain conversation state across turns, which is essential for complex property search dialogues.\n\n3. **Vector Database Integration**: LangChain has built-in integrations with vector databases like pgvector, which we'll use for semantic property search.\n\n4. **Tool Integration**: LangChain's agent framework allows the chatbot to use tools like database queries, API calls, and search functions based on user intent.\n\n5. **Observability**: LangChain integrates well with Langfuse for monitoring and observability, which is crucial for tracking performance and debugging.\n\n6. **Community and Documentation**: LangChain has a large community, extensive documentation, and many examples, which will accelerate development.\n\n7. **Flexibility**: LangChain is framework-agnostic and can work with various LLM providers, allowing us to switch models if needed.\n\nWhile other frameworks like LlamaIndex and Semantic Kernel offer similar capabilities, LangChain with LangGraph provides the best combination of features, flexibility, and maturity for our specific requirements.\n\n## Consequences\n\n### Positive\n\n- Faster development time due to pre-built components and integrations\n- More robust conversation handling with LangGraph's stateful workflows\n- Better observability through Langfuse integration\n- Flexibility to switch LLM providers if needed\n- Strong community support for troubleshooting and best practices\n\n### Negative\n\n- Learning curve for developers not familiar with LangChain/LangGraph\n- Dependency on third-party library that may change over time\n- Potential performance overhead compared to a more lightweight custom solution\n\n### Neutral\n\n- Need to keep up with LangChain/LangGraph updates and changes\n- May require custom extensions for real estate-specific functionality\n\n## Compliance\n\nCompliance with this decision will be verified through:\n\n1. Code reviews to ensure proper use of LangChain/LangGraph patterns\n2. Performance testing to ensure the chatbot meets latency requirements\n3. Language support testing to verify functionality in English, Arabic, and French\n4. Integration testing with the vector database and other components\n\n## Notes\n\n- LangChain documentation: https://python.langchain.com/docs/get_started/introduction\n- LangGraph documentation: https://python.langchain.com/docs/langgraph\n- We should monitor the development of other frameworks and reevaluate this decision if significant advantages emerge in alternative solutions.\n"
    },
    {
      "type": "createFile",
      "path": "docs/adr/002-use-pgvector-for-vector-similarity-search.md",
      "content": "# ADR-002: Use pgvector for Vector Similarity Search\n\n## Status\n\nAccepted\n\n## Context\n\nThe UAE Real-Estate AI Operating System requires semantic search capabilities to match property listings with user queries and preferences. This involves storing and querying vector embeddings that represent the semantic meaning of property descriptions, features, and user queries.\n\nWe need a vector database solution that provides:\n\n1. Efficient similarity search for high-dimensional vectors\n2. Integration with our existing PostgreSQL database\n3. Support for multiple vector similarity metrics (cosine, L2, dot product)\n4. Scalability to handle thousands of property listings\n5. Production readiness and reliability\n\nThe following alternatives were considered:\n\n- pgvector (PostgreSQL extension)\n- Pinecone\n- Weaviate\n- Milvus\n- Qdrant\n- Elasticsearch with vector search\n\n## Decision\n\nWe will use pgvector, a PostgreSQL extension, for vector similarity search in the UAE Real-Estate AI Operating System.\n\n## Rationale\n\npgvector provides several advantages that align with our requirements:\n\n1. **PostgreSQL Integration**: Since our application already uses PostgreSQL for relational data, pgvector allows us to store vector embeddings in the same database, simplifying our architecture and reducing operational complexity.\n\n2. **Performance**: pgvector supports both exact and approximate nearest neighbor search algorithms (IVFFlat and HNSW), providing a good balance between search accuracy and performance.\n\n3. **Similarity Metrics**: pgvector supports multiple similarity metrics (cosine, L2, inner product), allowing us to choose the most appropriate one for our use case.\n\n4. **Transactional Consistency**: Using pgvector ensures that our vector data and relational data remain consistent within transactions, which is important for operations like updating property listings.\n\n5. **Operational Simplicity**: By using pgvector, we avoid having to operate and maintain a separate vector database service, reducing operational overhead.\n\n6. **Cost Efficiency**: pgvector doesn't require additional licensing costs beyond our existing PostgreSQL infrastructure.\n\n7. **Maturity**: pgvector has gained significant adoption and is used in production by many organizations, indicating its reliability and stability.\n\nWhile dedicated vector databases like Pinecone or Weaviate might offer better performance at extreme scales, pgvector provides sufficient performance for our expected scale while offering significant operational advantages.\n\n## Consequences\n\n### Positive\n\n- Simplified architecture with vectors and relational data in one database\n- Reduced operational complexity and costs\n- Transactional consistency between vector and relational data\n- Leveraging existing PostgreSQL expertise and infrastructure\n\n### Negative\n\n- Potential performance limitations compared to specialized vector databases at very large scales\n- Limited to PostgreSQL's scaling capabilities\n- Requires careful index tuning for optimal performance\n\n### Neutral\n\n- Need to keep pgvector extension updated with PostgreSQL updates\n- May need to revisit this decision if vector search requirements grow beyond pgvector's capabilities\n\n## Compliance\n\nCompliance with this decision will be verified through:\n\n1. Performance testing to ensure search latency meets requirements\n2. Load testing to verify scalability with the expected number of property listings\n3. Integration testing with LangChain and other components\n4. Monitoring of query performance in production\n\n## Notes\n\n- pgvector GitHub repository: https://github.com/pgvector/pgvector\n- We should implement appropriate monitoring for vector search performance\n- We should periodically evaluate whether pgvector continues to meet our needs as the system scales\n"
    },
    {
      "type": "createFile",
      "path": "docs/adr/003-multilingual-support-strategy.md",
      "content": "# ADR-003: Multilingual Support Strategy\n\n## Status\n\nAccepted\n\n## Context\n\nThe UAE Real-Estate AI Operating System needs to support multiple languages to serve the diverse population of the UAE. Specifically, the system must support English, Arabic, and French for all user-facing content, including the chatbot interface, property descriptions, and generated proposals.\n\nWe need to define a strategy for multilingual support that addresses:\n\n1. User interface localization\n2. Content translation\n3. Natural language understanding in multiple languages\n4. Right-to-left (RTL) text support for Arabic\n5. Consistent user experience across languages\n\nThe following approaches were considered:\n\n- Client-side translation using browser capabilities\n- Server-side translation with cached translations\n- LLM-based translation and content generation\n- Hybrid approach combining multiple methods\n\n## Decision\n\nWe will implement a hybrid multilingual support strategy with the following components:\n\n1. **UI Localization**: Use a standard i18n framework with language files for static UI elements\n2. **Dynamic Content**: Use LLM-based translation for dynamic content like property descriptions\n3. **Chatbot**: Leverage multilingual capabilities of LLMs through LangChain for natural language understanding and generation in all supported languages\n4. **Database Design**: Store content in multiple languages where appropriate, with English as the fallback\n5. **RTL Support**: Implement comprehensive RTL support for Arabic through CSS and UI components\n\n## Rationale\n\nThe hybrid approach provides several advantages:\n\n1. **Efficiency**: Static content is efficiently handled through traditional i18n methods, while dynamic content leverages the advanced capabilities of LLMs.\n\n2. **Quality**: LLM-based translation and generation can produce more natural and contextually appropriate content than traditional machine translation.\n\n3. **Flexibility**: The system can easily adapt to user language preferences and switch between languages as needed.\n\n4. **Consistency**: By using a combination of pre-translated content and LLM generation, we can maintain a consistent user experience across languages.\n\n5. **Scalability**: This approach can scale to additional languages in the future with minimal changes to the architecture.\n\n6. **User Experience**: Native RTL support for Arabic ensures a proper user experience for Arabic-speaking users.\n\nWhile client-side translation would be simpler to implement, it would not provide the quality and consistency needed for a professional real estate application. A purely LLM-based approach would be more expensive and potentially slower for static content.\n\n## Consequences\n\n### Positive\n\n- High-quality translations and natural language generation in all supported languages\n- Consistent user experience across languages\n- Proper support for RTL text in Arabic\n- Flexibility to add more languages in the future\n\n### Negative\n\n- Increased complexity in the codebase to handle multiple languages\n- Higher computational costs for LLM-based translation and generation\n- Need for careful testing across all supported languages\n\n### Neutral\n\n- Need for language detection to automatically determine user preferences\n- Regular updates to language files and translation models\n\n## Compliance\n\nCompliance with this decision will be verified through:\n\n1. UI testing in all supported languages to ensure proper display and functionality\n2. Quality assessment of LLM-generated content in each language\n3. User testing with native speakers of each language\n4. Performance testing to ensure acceptable response times for translated content\n\n## Notes\n\n- We should implement a feedback mechanism for users to report translation issues\n- We should monitor the quality of LLM-generated translations and fine-tune as needed\n- We should consider adding language-specific cultural nuances to property descriptions where appropriate\n"
    },
    {
      "type": "createFile",
      "path": "scripts/create-adr.sh",
      "content": "#!/bin/bash\n\n# Script to create a new ADR from the template\n\nset -e\n\n# Check if title is provided\nif [ -z \"$1\" ]; then\n  echo \"Error: ADR title is required\"\n  echo \"Usage: $0 'Title of the ADR'\"\n  exit 1\nfi\n\n# Get the title from the first argument\nTITLE=\"$1\"\n\n# Convert title to kebab case for filename\nFILENAME=$(echo \"$TITLE\" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')\n\n# Find the next ADR number\nLAST_ADR=$(find docs/adr -name \"[0-9][0-9][0-9]-*.md\" | sort -r | head -n 1 | sed 's/.*\\/\\([0-9][0-9][0-9]\\).*/\\1/')\n\nif [ -z \"$LAST_ADR\" ]; then\n  NEXT_NUM=001\nelse\n  NEXT_NUM=$(printf \"%03d\" $((10#$LAST_ADR + 1)))\nfi\n\n# Create the new ADR file\nNEW_ADR=\"docs/adr/${NEXT_NUM}-${FILENAME}.md\"\n\n# Copy the template and replace the title\ncp docs/adr/template.md \"$NEW_ADR\"\nsed -i \"s/\\[ADR-NNN\\] \\[Title of the ADR\\]/ADR-${NEXT_NUM}: ${TITLE}/\" \"$NEW_ADR\"\n\necho \"Created new ADR: $NEW_ADR\"\necho \"Edit the file to complete the ADR.\"\n"
    },
    {
      "type": "executeCommand",
      "command": "chmod +x scripts/create-adr.sh"
    }
  ]
}
```

## Conclusion

These Windsurf Flow JSON snippets provide automation for common development tasks in the UAE Real-Estate AI Operating System project. They can be imported into Windsurf Editor to streamline development workflows and ensure consistency across the project.

Remember to customize these flows as needed for your specific project requirements. The JSON structure follows Windsurf's flow format with `name`, `description`, `uid`, and `actions` properties.
