import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const port = process.env.PORT;
const app = express();

// Swagger setup
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ... your other middleware and route setups

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
 