const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// API route to handle domain checks
app.post('/check-domain', async (req, res) => {
    const { domain } = req.body;

    if (!domain) {
        return res.status(400).json({ message: 'Domain is required.' });
    }

    try {
        const apiKey = '7f45b536d218299741c3955a0adfaf1f812b6a39c6ab68f9848392ae444f971b';

        // Fetch data from VirusTotal API
        const response = await axios.get(`https://www.virustotal.com/api/v3/domains/${domain}`, {
            headers: { 'x-apikey': apiKey },
        });

        const stats = response.data.data.attributes.last_analysis_stats;
        const details = response.data.data.attributes.last_analysis_results;

        // Format details
        const formattedDetails = Object.keys(details)
            .map(key => `${key}: ${details[key].category}`)
            .join(', ');

        res.json({
            trustScore: stats.malicious || 0,
            message: `Analysis details: ${formattedDetails || 'No additional details available.'}`,
        });
    } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 403) {
            res.status(403).json({ message: 'Invalid API key or rate limit exceeded.' });
        } else if (error.response && error.response.status === 404) {
            res.status(404).json({ message: 'Domain not found in VirusTotal database.' });
        } else {
            res.status(500).json({ message: 'An error occurred while fetching domain data.' });
        }
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
