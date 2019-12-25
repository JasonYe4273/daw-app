To setup things, first install node/npm, then, in both the client and server folders, run:

`$ npm install`

To compile the client code, run:

`$ npm start`

in the client folder. This compiles the UI code, bundles it up with Webpack, and stores it in public/app.js.

To run the server, run:

`$ npm start`

in the server folder. This will run the server on port 8000, which will serve the files bundled into public/app.js with Webpack, and respond to requests from the client.

Whenever you edit client code, Webpack will automatically recompile it. Similarly, whenever you edit server code, the server will restart to reflect the changes.