document.getElementById('domain-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const domain = document.getElementById('domain').value;
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<p class="text-blue-500">Checking domain...</p>';

    try {
        const response = await fetch('https://your-backend-url.onrender.com/check-domain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain }),
        });

        if (!response.ok) throw new Error('Failed to fetch domain details.');
        const data = await response.json();

        resultDiv.innerHTML = `
            <div class="bg-green-100 border border-green-500 rounded-lg p-4">
                <p><strong>Trust Score:</strong> ${data.trustScore}%</p>
                <p><strong>Details:</strong> ${data.message}</p>
            </div>
        `;
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="bg-red-100 border border-red-500 rounded-lg p-4">
                <p><strong>Error:</strong> ${error.message}</p>
            </div>
        `;
    }
});
