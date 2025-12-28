# Amp Free Trigger

A Cloudflare Worker to toggle Amp Free on/off via API. Amp Free is an ad-supported mode that provides $10/day of free usage across all Amp modes.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- Cloudflare account

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Wrangler CLI globally (if not already installed):
   ```bash
   npm install -g wrangler
   ```

3. Login to Cloudflare:
   ```bash
   wrangler login
   ```

## Configuration

### Environment Variables

| Variable  | Description                          |
| --------- | ------------------------------------ |
| `GAESA`   | GAESA cookie from ampcode.com        |
| `SESSION` | Session cookie from ampcode.com      |
| `APIKEY`  | API key to authenticate worker calls |

### How to Get Cookies

1. Go to [ampcode.com](https://ampcode.com) and log in
2. Open DevTools (F12) → Application → Cookies → `https://ampcode.com`
3. Copy the values of `GAESA` and `session` cookies

## Deployment

```bash
npm run deploy
```

After deployment, note the URL in the output (e.g., `https://amp-free-trigger.your-subdomain.workers.dev`). Use this URL for the API calls below.

### Set Secrets

Set secrets using Wrangler (you'll be prompted to enter each value):

```bash
wrangler secret put GAESA
wrangler secret put SESSION
wrangler secret put APIKEY
```

Or bulk upload from a JSON file:

```bash
cp secrets-example.json secrets.json
# Edit secrets.json with your actual values
wrangler secret bulk secrets.json
```

## Usage

### Enable Amp Free

```bash
curl -H "x-api-key: YOUR_API_KEY" https://amp-free-trigger.your-subdomain.workers.dev/enable
```

### Disable Amp Free

```bash
curl -H "x-api-key: YOUR_API_KEY" https://amp-free-trigger.your-subdomain.workers.dev/disable
```

## API Endpoints

| Endpoint   | Description          |
| ---------- | -------------------- |
| `/enable`  | Enable Amp Free      |
| `/disable` | Disable Amp Free     |

All endpoints require the `x-api-key` header for authentication.

## Example: AGENTS.md for AI Agents

Use this worker to enable Amp Free before web searches to save tokens. Add this to your `AGENTS.md`:

    ## Web Search Protocol

    **Before** first `web_search` or `read_web_page`:
    ```bash
    curl -s -H "x-api-key: your-api-key" amp-free-trigger.your-subdomain.workers.dev/enable
    ```

    **After** all web operations complete:
    ```bash
    curl -s -H "x-api-key: your-api-key" amp-free-trigger.your-subdomain.workers.dev/disable
    ```

    > For multiple web operations, only enable/disable once around the entire batch.

## Local Development

1. Copy the example env file:
   ```bash
   cp .dev.vars.example .dev.vars
   ```

2. Edit `.dev.vars` and replace the placeholder values with your actual credentials:
   ```
   GAESA=your-actual-gaesa-cookie
   SESSION=your-actual-session-cookie
   APIKEY=your-chosen-api-key
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

## License

MIT
