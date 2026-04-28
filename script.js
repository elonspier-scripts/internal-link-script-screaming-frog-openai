return (async function() {
    // ⚠️ WARNING: Replace with your actual key only locally. Do not share publicly.
    const apiKey = 'YOUR_API_HERE';
    const model = 'gpt-4o'; // you can choose other model with web_search capabilities

    const currentUrl = window.location.href;
    const targetDomain = window.location.hostname;
    
    // IMPROVEMENT 1: Gather richer page context
    const h1Text = document.querySelector('h1')?.innerText?.trim() || '';
    const pageTitle = document.title || '';
    const metaDesc = document.querySelector('meta[name="description"]')?.content || '';

    // Failsafe if the page is completely empty
    if (!h1Text && !pageTitle) return seoSpider.data("Geen H1 of Title gevonden");

    try {
        const response = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                // IMPROVEMENT 2: Advanced SEO instructions
                instructions: `You are an expert SEO strategist building topical clusters. 
                               1. Formulate a search query using site:${targetDomain} and the core keywords from the provided context. Do NOT use exact-match quotes around long phrases.
                               2. Browse the top results to evaluate semantic relevance and intent matching.
                               3. Select pages that would serve as highly valuable, logical related reading for a user.
                               4. STRICTLY EXCLUDE administrative/utility pages (e.g., /contact, /about, /cart, /login, /tag/, /author/).
                               5. STRICTLY EXCLUDE the current URL: ${currentUrl}.
                               6. Output format: Raw URLs only, one per line, absolutely no extra text.`,
                // IMPROVEMENT 3: Feeding the AI better data
                input: `Find the 5 best internal link opportunities on ${targetDomain} for a page about:
                        H1: "${h1Text}"
                        Title: "${pageTitle}"
                        Description: "${metaDesc}"`,
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
                        // Extract URLs from citations
                        if (block.annotations) {
                            block.annotations.forEach(anno => {
                                if (anno.url) urlList.push(anno.url.split('?')[0]);
                            });
                        }
                        // Extract URLs from raw text
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

        // IMPROVEMENT 4: Clean up trailing slashes for better deduplication
        const cleanUrls = [...new Set(urlList.map(u => u.replace(/\/$/, '')))]
            .filter(u => u.includes(targetDomain) && u.toLowerCase() !== currentUrl.replace(/\/$/, '').toLowerCase())
            .slice(0, 5); 

        if (cleanUrls.length === 0) return seoSpider.data("Geen resultaten gevonden.");

        return seoSpider.data(cleanUrls.join('\n'));

    } catch (err) {
        return seoSpider.data("Fout: " + err.message);
    }
})();
