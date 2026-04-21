# Plaid Pattern Europe - Account Funding

This is an example account funding app that outlines an end-to-end integration with [Plaid][plaid]. This app focusses on the Europe specific Payment Initiation product.

Plaid Pattern apps are provided for illustrative purposes and are not meant to be run as production applications.

![Plaid Pattern Europe client][client-img]

## Requirements

- [Node.js][nodejs] v20.12 or higher
- [PostgreSQL][postgres] 16 (install via [Homebrew][homebrew]: `brew install postgresql@16`)
- [Plaid API keys][plaid-keys] - [sign up][plaid-signup] for a free Sandbox account if you don't already have one
- (Optional) [ngrok][ngrok] for testing webhooks - [sign up for a free account](https://dashboard.ngrok.com/signup)

## Getting Started

1. Clone the repo.
   ```shell
   git clone https://github.com/plaid/payment-initiation-pattern-app.git
   cd payment-initiation-pattern-app
   ```

1. Create the `.env` file.
   ```shell
   cp .env.template .env
   ```
   Update the `.env` file with your [Plaid API keys][plaid-keys].

1. Verify Payment Initiation is enabled for your client ID through the Plaid Developer Dashboard in [Sandbox](https://dashboard.plaid.com/overview/sandbox) and/or [Production](https://dashboard.plaid.com/team/products). If it is not enabled, contact your Plaid Account Executive or Account Manager.

1. Make sure PostgreSQL is running.
   ```shell
   brew services start postgresql@16
   ```

1. Install dependencies.
   ```shell
   make install
   ```

1. Start the app.
   ```shell
   make start
   ```

1. Open http://localhost:3002 in a web browser.

1. When you're finished, press `Ctrl+C` in the terminal to stop, or run:
   ```shell
   make stop
   ```

## Additional Commands

All available commands can be seen by calling `make help`.

| Command | Description |
|---------|-------------|
| `make install` | Install server and client dependencies |
| `make start` | Start the server and client (initializes DB on first run) |
| `make stop` | Stop the server and client |
| `make sql` | Open an interactive psql session |
| `make clear-db` | Drop and recreate all database tables |

## Architecture

Pattern consists of three components running as local processes:

- **client** — a [React][react]-based single-page web frontend served by [Vite][vite] on port 3002
- **server** — a [Node.js][nodejs] / [Express][express] backend on port 5001
- **database** — a [PostgreSQL][postgres] instance on port 5432

The client proxies API requests to the server via Vite's dev server proxy (configured in `client/vite.config.ts`).

# Client

The Pattern web client is written in TypeScript using [React][react]. It presents an example account funding workflow to the user.

## Key concepts

### Communicating with the server

All HTTP calls to the Pattern server are defined in `src/services/api.js`.

### Webhooks and Websockets

The Pattern server sends a message over a websocket whenever it receives a webhook from Plaid. On the client side, websocket listeners in `src/components/Sockets.jsx` wait for these messages and update data in real time.

# Server

The application server is written in JavaScript using [Node.js][nodejs] and [Express][express]. It interacts with the Plaid API via the [Plaid Node SDK][plaid-node], and with the database using [`node-postgres`][node-pg].

## Key Concepts

### Using webhooks with ngrok

To receive Plaid webhooks during local development, you can use [ngrok][ngrok] to expose your local server to the internet:

```shell
brew install ngrok
ngrok http 5001
```

Browse to [localhost:4040](http://localhost:4040/inspect/http) to see the ngrok dashboard and inspect raw webhook payloads. This link is also available in the app's Developer Console.

**Do NOT use ngrok in production!** It's only included here as a convenience for local development.

ngrok's free account has a session limit of 2 hours. When your session expires, any previously linked Items will stop receiving webhooks because they're registered with the old ngrok URL.

Don't want to use ngrok? As long as you serve the app with an endpoint that is publicly exposed, all the Plaid webhooks will work.

# Database

The database is a [PostgreSQL][postgres] instance running locally on port 5432.

Username and password are configured in your `.env` file (defaults: `postgres` / `password`).

To clear all the data in the database:

```bash
make clear-db
```

## Tables

The `*.sql` scripts in the `database/init` directory define the database schema. See the [create.sql][create-script] initialization script for table schemas.

The database is automatically initialized on the first `make start` if the tables don't exist yet.

## Troubleshooting

**Port already in use**: Check what's using the port with `lsof -i :5001` and either stop that process or change the `PORT` in your `.env` file.

**PostgreSQL connection refused**: Make sure PostgreSQL is running (`brew services list`). If you installed it via Homebrew, start it with `brew services start postgresql@16`.

**Database authentication errors**: The default `.env` uses `postgres` / `password`. If your local PostgreSQL has different credentials, update your `.env` file accordingly.

View [Plaid server logs](https://dashboard.plaid.com/developers/logs) on the Dashboard.

## Debugging

To run the server with the Node.js inspector:

```shell
cd server
npx nodemon --env-file=../.env --inspect index.js
```

Then attach your debugger to port 9229. In VS Code, use a "Node.js: Attach" launch configuration. See the [VS Code docs][vscode-debugging] for more information.

## Testing with OAuth redirect URIs (optional)

> On desktop, OAuth will work without a redirect URI configured. However, using redirect URIs is recommended for best conversion on mobile web, and mandatory when using a Plaid mobile SDK. For more details, see the documentation on [redirect URIs on desktop and mobile web](https://plaid.com/docs/link/oauth/#desktop-web-mobile-web-react-or-webview).

#### In Sandbox

Set `PLAID_SANDBOX_REDIRECT_URI=http://localhost:3002/oauth-link` in your `.env` file, then register this URI in your [Plaid Dashboard](https://dashboard.plaid.com/team/api).

To test the OAuth redirect URI flow you may use the Chrome browser to simulate a mobile device. Learn how to do this under "Mobile Device Viewport Mode" here: https://developer.chrome.com/docs/devtools/device-mode/

#### In Production

When running in Production, you must use an https:// URL. Set `PLAID_PRODUCTION_REDIRECT_URI=https://localhost:3002/oauth-link` in your `.env` file, then register this URI in your [Plaid Dashboard](https://dashboard.plaid.com/team/api).

To run localhost with https, create a self-signed certificate. Note that self-signed certificates should be used for testing purposes only.

#### macOS instructions for https with localhost

```bash
cd client
brew install mkcert
mkcert -install
mkcert localhost
```

This creates `localhost.pem` and `localhost-key.pem` in the client folder. Then update `client/vite.config.ts` to add HTTPS configuration to the server options:

```typescript
server: {
  port: 3002,
  https: {
    key: './localhost-key.pem',
    cert: './localhost.pem',
  },
  // ... proxy config
}
```

After restarting, visit https://localhost:3002.

## Additional Resources

- For an overview of the Plaid platform and products, refer to this [Quickstart guide][plaid-quickstart].
- Check out this [introduction to Payment Initiation](https://plaid.com/docs/payment-initiation/).
- Find comprehensive information on Plaid API endpoints in the [API documentation][plaid-docs].
- Questions? Please head to the [Help Center][plaid-help] or [open a Support ticket][plaid-support-ticket].

## License

Plaid Pattern is a demo app that is intended to be used only for the purpose of demonstrating how you can integrate with Plaid. You are solely responsible for ensuring the correctness, legality, security, privacy, and compliance of your own app and Plaid integration. The Pattern code is licensed under the [MIT License](LICENSE) and is provided as-is and without warranty of any kind. Plaid Pattern is provided for demonstration purposes only and is not intended for use in production environments.

[create-script]: database/init/create.sql
[client-img]: docs/client.png
[express]: https://expressjs.com/
[homebrew]: https://brew.sh/
[ngrok]: https://ngrok.com/
[node-pg]: https://github.com/brianc/node-postgres
[nodejs]: https://nodejs.org/en/
[plaid]: https://plaid.com
[plaid-docs]: https://plaid.com/docs/
[plaid-help]: https://support.plaid.com/hc/en-us
[plaid-keys]: https://dashboard.plaid.com/account/keys
[plaid-node]: https://github.com/plaid/plaid-node
[plaid-quickstart]: https://plaid.com/docs/quickstart/
[plaid-signup]: https://dashboard.plaid.com/signup
[plaid-support-ticket]: https://dashboard.plaid.com/support/new
[postgres]: https://www.postgresql.org/
[react]: https://reactjs.org/
[vite]: https://vite.dev/
[vscode-debugging]: https://code.visualstudio.com/docs/editor/debugging
