const axios = require('axios');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

const projectId = "66fe7808e24c351c40239571";

if (!projectId) {
  console.error('Please provide a projectId.');
  process.exit(1);
}

async function fetchData() {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/datasources/project`, null, {
      headers: { projectId }
    });
    console.log(response.data)
    const jsonData = response.data.data.response;

    if (!Array.isArray(jsonData)) {
      console.error('Expected an array in the response data.');
      return;
    }

    console.log(jsonData);
    const dirPath = path.join(__dirname, 'datasources', 'rest');
    fs.mkdirSync(dirPath, { recursive: true });

    jsonData.forEach((item, index) => {
      const yamlData = yaml.dump(item);
      const yamlFilePath = path.join(dirPath, `rest${index + 1}.yaml`);
      fs.writeFileSync(yamlFilePath, yamlData);
      console.log(`Created ${yamlFilePath}`);
    });

    console.log(`Data for project ID ${projectId} has been fetched and converted to individual YAML files.`);
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
}

fetchData();
