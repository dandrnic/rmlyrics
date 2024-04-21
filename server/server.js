const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 8080;

// lyrics
const GeniusLyrics = require("genius-lyrics");
const Client = new GeniusLyrics.Client(); // Scrapes if no key is provided

// jp translation
const wanakana = require('wanakana');

async function getSongDetails(searchTerm) {
  try {
    const searches = await Client.songs.search(searchTerm);
    // Pick first one
    const firstSong = searches[0];
    const SongImg = firstSong.thumbnail;

    // Ok let's get the lyrics
    const lyrics = await firstSong.lyrics();
    console.log("Lyrics of the Song:\n", lyrics, "\n");

    // Clean the lyrics text, convert it to romaji
    const lines = lyrics.split(/(\r?\n)/); // Split lyrics into lines including line breaks

    // Initialize an array to store cleaned lyrics with line breaks
    const songLyrics = [];

    // Process each line separately
    for (const line of lines) {
      // Check if the line is a line break
      if (line === '\n' || line === '\n\n') {
        // Add line break to songLyrics array
        songLyrics.push(line);
      } else {
        // Replace square brackets and extra spaces
        const cleanedLine = line.replace(/\[.*?\]/g, '').replace(/\s{2,}/g, ' ').trim();
        // Check if the cleaned line is not empty
        if (cleanedLine) {
          const romajiLine = wanakana.toRomaji(cleanedLine);
          songLyrics.push(romajiLine);
        }
      }
    }

    // Return an object containing both the song image and the cleaned lyrics
    return { SongImg, songLyrics };
  } catch (error) {
    console.error("Error:", error.message);
    // Throw the error to handle it outside the function
    throw new Error("An error occurred while fetching song details");
  }
}

app.use(cors());

app.get("/api/home", async (req, res) => {
  const { searchTerm } = req.query;

  try {
    const { songLyrics, SongImg } = await getSongDetails(searchTerm);
    res.json({ message: songLyrics, SongImg });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
