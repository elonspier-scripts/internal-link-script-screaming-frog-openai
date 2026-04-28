return (async function() {
    const apiKey = 'API KEY HERE';
    const model = 'gpt-4o';

    const currentUrl = window.location.href;
    const targetDomain = window.location.hostname;
    const h1Text = document.querySelector('h1')?.innerText?.trim();

    if (!h1Text) return seoSpider.data("Geen H1 gevonden");

    try {
        const response = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                instructions: `You are a professional SEO auditor. 
                               1. Search for site:${targetDomain} "${h1Text}".
                               2. Browse/visit the top 5 results to analyze their full content.
                               3. Rank them based on how well the page content matches the intent of "${h1Text}".
                               4. Return ONLY the 5 most relevant URLs.
                               5. Strictly exclude the current URL: ${currentUrl}.
                               6. Output format: Raw URLs only, one per line, no text.`,
                input: `Rank the 5 best internal link opportunities for "${h1Text}" on ${targetDomain}.`,
                tools: [{ type: "web_search" }]
            })
        });

        const data = await response.json();

        if (data.error) return seoSpider.data("API Error: " + data.error.message);

        let urlList = [];

        if (data.output && Array.isArray(data.output)) {
            data.output.forEach(item => {
                if (item.type === 'message' && item.content) {
                    item.content.forEach(block => {
                        // Haal URL's uit citaties
                        if (block.annotations) {
                            block.annotations.forEach(anno => {
                                if (anno.url) urlList.push(anno.url.split('?')[0]);
                            });
                        }
                        // Haal URL's uit de tekst (regex)
                        if (block.text) {
                            const matches = block.text.match(/https?:\/\/[^\s"']+/g);
                            if (matches) {
                                matches.forEach(m => urlList.push(m.replace(/[()]/g, '').split('?')[0]));
                            }
                        }
                    });
                }
            });
        }

        // Opschonen: uniek maken, huidige URL filteren, alleen eigen domein
        const cleanUrls = [...new Set(urlList)]
            .filter(u => u.includes(targetDomain) && u.toLowerCase() !== currentUrl.toLowerCase())
            .slice(0, 5); // We pakken er nu exact 5 uit de grotere lijst

        if (cleanUrls.length === 0) return seoSpider.data("Geen resultaten gevonden.");

        return seoSpider.data(cleanUrls.join('\n'));

    } catch (err) {
        return seoSpider.data("Fout: " + err.message);
    }
})();
