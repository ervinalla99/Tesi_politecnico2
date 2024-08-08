const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
// Serve static files from the 'dist' directory (where bundle.js is generated)
//app.use(express.static(path.join(__dirname, 'dist')));
app.use('/dist', (req, res, next) => {
    res.setHeader('Content-Type', 'application/javascript');
    next();
}, express.static(path.join(__dirname, 'dist')));
// Serve index.html from the root folder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// Array to store SSE clients
let sseClients = [];
app.use('/src', express.static(path.join(__dirname, 'src'))); 
// Route to handle SSE connections
app.get('/events', (req, res) => {
    // Set the headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send an initial response to keep the connection open
    res.write('\n');

    // Add the response object to the SSE clients array
    sseClients.push(res);

    // Handle client disconnect
    req.on('close', () => {
        // Remove the disconnected client from the array
        sseClients = sseClients.filter(client => client !== res);
    });
});

// Handle POST requests at '/CrossSection'
app.post('/CrossSection', (req, res) => {
    // Send 'Action1' to all connected clients via SSE
    const actionData = {
      action: 'Action1'
    };
    sendActionToClients(actionData);
  
    // Respond to Dialogflow webhook with a JSON object
    const jsonResponse = {
      message: 'Webhook received the message.'
    };
    res.status(200).json(jsonResponse);
  });
  
  // Handle POST requests at '/Isolate'
  app.post('/Isolate', (req, res) => {
    // Send 'Isolate' action to all connected clients via SSE
    const actionData = {
      action: 'Isolate'
    };
    sendActionToClients(actionData);
  
    // Respond with a JSON object
    const jsonResponse = {
      message: 'Isolate action sent to clients.'
    };
    res.status(200).json(jsonResponse);
  });
  
  // Handle POST requests at '/ShowAll'
  app.post('/ShowAll', (req, res) => {
    // Send 'ShowAll' action to all connected clients via SSE
    const actionData = {
      action: 'ShowAll'
    };
    sendActionToClients(actionData);
  
    // Respond with a JSON object
    const jsonResponse = {
      message: 'ShowAll action sent to clients.'
    };
    res.status(200).json(jsonResponse);
  });
    // Handle POST requests at '/Description'
    let storedClass = '';

// Endpoint to store the description from the client-side
app.post('/Class', (req, res) => {
  const Class = req.body.Class;
  
  if (!Class) {
    return res.status(400).json({ error: 'Class is required' });
  }

  storedClass = Class;
  //console.log('Stored class:', storedClass);

  res.json({ message: 'Class stored successfully' });
});

// Endpoint for Dialogflow webhook
app.post('/ClassWebhook', (req, res) => {
  if (!storedClass) {
    return res.status(400).json({ error: 'No Class available' });
  }

  const jsonResponse = {
    fulfillmentResponse: {
      messages: [
        {
          text: {
            text: [`The class of this element is: ${storedClass}`]
          }
        }
      ]
    }
  };

  console.log('Responding to Dialogflow with:', jsonResponse);
  res.json(jsonResponse);
});
    
  // Function to send SSE action data to all clients
  function sendActionToClients(actionData) {
    sseClients.forEach(client => {
      client.write(`data: ${JSON.stringify(actionData)}\n\n`);
    });
  }
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
