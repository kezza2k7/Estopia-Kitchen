const express = require('express');

const cors = require('cors');
const path = require('path');
const ejs = require('ejs');

const KitchenApp = express();
const KitchenPORT = 8090;
const InfoPORT = 8100;

// Middleware to parse JSON bodies
KitchenApp.use(express.json());

// Use cors middleware to allow all origins
KitchenApp.use(cors());

KitchenApp.set('views', path.join(__dirname, 'views'));
KitchenApp.set('view engine', 'ejs');

const fs = require('fs');

const requireModulesInDirectory = (directoryPath) => {
    const modules = [];
    fs.readdirSync(directoryPath).forEach(file => {
        if (file.endsWith('.js')) {
            const moduleName = path.parse(file).name;
            const moduleType = moduleName.split('_')[0]; // Assuming filenames follow the convention type_name.js
            const modulenick = moduleName.split('_')[1];
            const moduleFunction = require(path.join(directoryPath, file));
            modules.push({ type: moduleType, name: modulenick, func: moduleFunction });
        }
    });
    return modules;
};

const pagessearch = (directoryPath, endsWith) => {
    const modules = [];

    fs.readdirSync(directoryPath).forEach(file => {
        if (file.endsWith(endsWith)) {
            const moduleName = path.parse(file).name;
            const moduleFunction = (req, res) => { // Added req and res parameters
                try {
                    // Render the HTML template with the module name
                    ejs.renderFile(path.join(directoryPath, `${moduleName}.ejs`), { moduleName }, (err, html) => {
                        if (err) {
                            console.error(err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            res.send(html);
                        }
                    });
                } catch (error) {
                    res.status(500).json({ error: error.message });
                }
            };
            if (moduleName === 'home') {
                modules.push({ name: '', func: moduleFunction });
            }
            if(moduleName === 'invites') { 
                modules.push({ name: 'invites/:invite', func: moduleFunction });
            }
            modules.push({ name: moduleName, func: moduleFunction });
        }
    });

    return modules;
};


const page = pagessearch(path.join(__dirname, 'src'), '.ejs');
page.forEach(({ name, func }) => {
    console.log(`name: ${name}`)
    KitchenApp.get(`/${name}`, func);
});

// Example: Register all modules in the 'routes' directory
const routeModules = requireModulesInDirectory(path.join(__dirname, 'api'), '.js');
routeModules.forEach(({ type, name, func }) => {
  console.log(`Type: ${type}, name: ${name}`)
  switch (type) {
    case 'get':
        KitchenApp.get(`/api/${name}`, func);
        break;
    case 'post':
        KitchenApp.post(`/api/${name}`, func);
        break;
    case 'put':
        KitchenApp.put(`/api/${name}`, func);
        break;
    case 'delete':
        KitchenApp.delete(`/api/${name}`, func);
        break;
    // Add more cases for other HTTP methods if needed
    default:
        console.error(`Unsupported HTTP method: ${type}`);
}
});

// Start the server
KitchenApp.listen(KitchenPORT, () => {
  console.log(`Server is running on port ${KitchenPORT}`);
});