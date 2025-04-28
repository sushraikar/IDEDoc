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
      "content": "import { Pool } from 'pg';\nimport dotenv from 'dotenv';\n\ndotenv.config();\n\nconst pool = new Pool({\n  host: process.env.DB_HOST || 'localhost',\n  port: parseInt(process.env.DB_PORT || '5432', 10),\n  database: process.env.DB_NAME || 'real_estate_ai',\n  user: process.env.DB_USER || 'postgres',\n  password: process.env.DB_PASSWORD || 'postgres',\n});\n\n/**\n * Store a vector embedding for a property\n * @param propertyId - The UUID of the property\n * @param embedding - The vector embedding (1536 dimensions)\n */\nexport async function storeEmbedding(propertyId: string, embedding: number[]): Promise<void> {\n  try {\n    const query = `\n      INSERT INTO property_embeddings (id, embedding)\n      VALUES ($1, $2)\n      ON CONFLICT (id) DO UPDATE SET\n        embedding = $2,\n        updated_at = CURRENT_TIMESTAMP\n    `;\n    \n    await pool.query(query, [propertyId, embedding]);\n    console.log(`Stored embedding for property ${propertyId}`);\n  } catch (error) {\n    console.error('Error storing embedding:', error);\n    throw error;\n  }\n}\n\n/**\n * Find similar properties using vector similarity search\n * @param embedding - The query vector embedding\n * @param limit - Maximum number of results to return\n * @param threshold - Minimum similarity threshold (0-1)\n */\nexport async function findSimilarProperties(embedding: number[], limit: number = 10, threshold: number = 0.7): Promise<any[]> {\n  try {\n    const query = `\n      SELECT p.*, 1 - (e.embedding <=> $1) AS si
(Content truncated due to size limit. Use line ranges to read in chunks)