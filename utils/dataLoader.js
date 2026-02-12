const fs= require("fs").promises;
const path= require("path");

async function loadSightings() {
    try {
        const filePath = path.join(__dirname, "..","data", "sightings.json");

        const data = await fs.readFile(filePath, "utf-8");
        const jsonData = JSON.parse(data);

         return jsonData.sightings;  
    } catch (error) {
        console.error("Sightings data error", error)
        throw new Error("Wildlife sightings data loading error");
    }
    
}

module.exports= loadSightings;