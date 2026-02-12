const express = require('express')
const path = require("path")
const app = express()
const port = process.env.PORT || 8080;

const loadSightings = require("./utils/dataLoader")


app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
}); // about page 

// sightings 

app.get("/api/sightings", async (req, res) => {
    try {
        const sightings = await loadSightings();
        res.json(sightings);
    }
    catch (error) {
        res.status(404).json({ error: "Error loading sightings" })
    }
});

// verified sightings

app.get("/api/sightings/verified", async (req, res) => {
    try {
        const sightings = await loadSightings();
        const verifiedSightings = sightings.filter(sighting => sighting.verified === true);
        res.json(verifiedSightings);
    } catch (error) {
        res.status(404).json({ error: "Error loading verified sightings" })
    }
})

// species list

app.get("/api/sightings/species-list", async (req, res) => {
    try {
        const sightings = await loadSightings();
        const speciesList = sightings.map(sighting => sighting.species);
        const filteredSpecies = [...new Set(speciesList)];

        res.json(filteredSpecies);
    } catch (error) {
        res.status(404).json({ error: "Error loading species list" })
    }
})

// Forest habitat
app.get("/api/sightings/habitat/forest", async (req, res) => {
    try {
        const sightings = await loadSightings();

        const forestSighting = sightings.filter(
            sighting => sighting.habitat.toLowerCase() === "forest"
        );

        res.json({
            habitat: "forest",
            sightings: forestSighting,
            count: forestSighting.length
        });
    } catch (error) {
        res.status(404).json({ error: "Error loading forest habitat sightings" });
    }
})

//find eagle 

app.get("/api/sightings/search/eagle", async (req, res) => {
    try {
        const sightings = await loadSightings();
        const eSightings = sightings.find(
            sighting => sighting.species.toLowerCase().includes("eagle")
        )
        res.json(eSightings);
    } catch (error) {
        res.status(500).json({ error: "Error finding the species" })
    }
})

//find moose 

app.get("/api/sightings/find-index/moose", async (req, res) => {
    try {
        const sightings = await loadSightings();

        const index = sightings.findIndex(sighting => sighting.species.toLowerCase() === "moose")

        res.json({
            index: index,
            sighting: sightings[index]
        })
    } catch (error) {
        res.status(404).json({ error: "Error findding moose index" })
    }
})

// recent 

app.get("/api/sightings/recent", async (req, res) => {
    try {
        const sightings = await loadSightings();

        const recentSightings = sightings.slice(-3).map(sighting => ({
            species: sighting.species,
            location: sighting.location,
            date: sighting.date
        }))

        res.json(recentSightings);
    } catch (error) {
        res.status(404).json({ error: "Error loading recent" })
    }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))