# Dynamic Esports Overlay 🖥️
This project is a simple web-based overlay that can be edited using the "admin" panel, built using Node.js. 

Allows real-time editing of match data such as score, map list, team names, and colors, which are stored in a local `data.json` file.

## Features ✨
### Implemented ✅
- Dynamic team colors
- Dynamic team names
- Dynamic scores
- Dynamic map names
- Easy side switch feature
- Expandable logo catalog (add images to /logos/)
- Team presets (names & colors linked to logos)

### Planned 📋
- ~~Gradients for colors~~
- Multiple layout options
- More settings such as league title

## Usage ⌨️
### Ensure NodeJS is installed locally.
Run `node -v` within a terminal to check if you have it installed / what version you have.
- visit https://nodejs.org/en/download for more instructions and info on NodeJS
### Setup (Terminal)
Run: ```git clone https://github.com/SirJavaDrinker/web-dynamic-esports-overlay.git``` to clone the repository.

Once inside the correct directory, simply run `node index.js` to start up the server.

By default this will open up a locally hosted server at port: `9999`

Navigate to:
- http://localhost:9999/ 		to view the overlay.
- http://localhost:9999/admin 	to view and access the overlay settings panel.

## OBS Setup ⏺️
In the sources tab, add a new browser source, then add in the overlay URL in the URL bar... and done! As long as the server is running in a terminal, it should work!
