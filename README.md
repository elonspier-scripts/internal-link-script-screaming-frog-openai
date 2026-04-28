# Screaming Frog AI Internal Link Finder

This Custom JavaScript extraction script for Screaming Frog automates internal link discovery. It leverages OpenAI's `gpt-4o` model to browse the live web and find the most relevant contextual link targets on your own domain.

## ⚠️ Security Warning
**Never share this script publicly with your live OpenAI API key.** If committing to a repository or sharing with a team, replace your key with a placeholder (e.g., `YOUR_API_KEY_HERE`).

## 🧠 How It Works (OpenAI `web_search` + Google Operators)
Instead of just guessing links, the AI actively uses Google Search to find them:
1. **Context Extraction:** The script scrapes the current page's `<h1>`, `<title>`, and `<meta name="description">` to understand its core topic.
2. **Live Google Search:** It triggers OpenAI's `web_search` tool to perform a real-time internet search.
3. **Google Operators:** The AI is instructed to use the `site:yourdomain.com` Google search operator combined with semantic keywords from your page. This forces Google to act as an internal site search engine.
4. **Intent Matching:** The AI evaluates the live Google search results, filters out utility pages (like `/contact` or `/cart`), and returns up to 5 raw URLs that serve as the best contextual internal links.

## 📋 Prerequisites
* **Screaming Frog SEO Spider** (Licensed version).
* **JavaScript Rendering Enabled** in Screaming Frog.
* **OpenAI API Key** with access to the `gpt-4o` model.

## 🛠️ Installation & Usage
1. Open Screaming Frog.
2. Navigate to **Configuration** > **Spider** > **Rendering** and set it to **JavaScript**.
3. Navigate to **Configuration** > **Custom** > **Custom Extraction**.
4. Click **+ Add** to create a new rule (e.g., "Internal Links").
5. Set the extraction method to **JavaScript**.
6. Paste the script into the code box.
7. Replace the `apiKey` string in the script with your actual OpenAI API key.
8. Start your crawl. The recommended internal link URLs will populate in the Custom Extraction tab.
