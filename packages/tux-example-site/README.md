This is an example site showcasing tux's features.

## Folder Structure

For the project to build, **these files must exist with exact filenames**:

* `src/Html.js` is the React page template;
* `src/index.js` is the JavaScript entry point for the browser.
* `src/server.js` is the JavaScript entry point for the server. Only required for SSR.

You can delete or rename the other files.

Building the project creates the following structure:

```
my-app/
  build/
    server.js
    static/
      index.html
      index.[hash].bundle.js
      index.css
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

The page will reload if you make edits.

### `npm run build`

Builds the app for production to the `build/static` folder for static hosting.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

### `npm start-server`

Builds and runs the app with server-side rendering.<br>
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

If you edit files, you have to restart the command.

### `npm run build-server`

Builds the app for production to the `build` folder for hosting with server side rendering.<br>

The client build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!
