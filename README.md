# Ethereum Account and Token Service

## Description

This backend service provides endpoints for creating an account based on an Ethereum address and fetching tokens along with their balances for a given Ethereum address. The project follows the principles of Clean Architecture. While it is not production-ready, efforts have been made to bring it close to that stage.

Key features:
- Endpoint for creating an account using an Ethereum address.
- Endpoint for fetching tokens and their balances for a given Ethereum address.
- Middleware for Ethereum address validation.
- Error handling using the Result and Failure objects for centralized decision-making.
- Configurable cache mechanism for fetching token metadata (currently, only a flag is used to demonstrate caching capabilities).

Future enhancements:
- Fix/Add Swagger Docs
- Add session management to control who can access the endpoints.
- Integrate a monitoring system like New Relic for error reporting.
- Use Redis sorted-sets for implementing a leaderboard feature.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/rkamysz/jumper-backend.git
    cd your-repository
    ```

2. Install dependencies:
    ```bash
    npm i
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory and add the necessary environment variables as described in `.env.template`.

## Usage

1. Run the following command to start MongoDB:
    ```bash
    docker-compose up -d
    ```

This will start a MongoDB instance on port 27017, and you can connect to it using the MongoDB connection URI specified in your `.env` file.


2. Start the development server:
    ```bash
    npm run build
    npm run start
    ```

3. Open your browser and navigate to `http://localhost:3000` (or the specified `HOST` and `PORT` in your `.env` file).

## Configuration

### Environment Variables

A description of each environment variable used in the project. Add these variables to a `.env` file in the root directory.

#### Server Configuration

- `NODE_ENV`: Specifies the environment in which the application is running. Options: `'development'`, `'production'`.
    ```plaintext
    NODE_ENV="development"
    ```
- `PORT`: The port on which the server will listen.
    ```plaintext
    PORT="8080"
    ```
- `HOST`: The hostname for the server.
    ```plaintext
    HOST="localhost"
    ```

#### CORS Settings

- `CORS_ORIGIN`: Specifies the allowed CORS origin. Adjust this as necessary for your frontend application.
    ```plaintext
    CORS_ORIGIN="http://localhost:*"
    ```

#### Rate Limiting

- `COMMON_RATE_LIMIT_WINDOW_MS`: The window size for rate limiting, in milliseconds.
    ```plaintext
    COMMON_RATE_LIMIT_WINDOW_MS="1000"
    ```
- `COMMON_RATE_LIMIT_MAX_REQUESTS`: The maximum number of requests per window per IP address.
    ```plaintext
    COMMON_RATE_LIMIT_MAX_REQUESTS="20"
    ```

#### API Keys

- `ETHERSCAN_IO_API_KEY`: The API key for accessing Etherscan services.
    ```plaintext
    ETHERSCAN_IO_API_KEY="FGHJK45678YTREWRSDTYUIKJ34"
    ```
- `ALCHEMY_API_KEY`: The API key for accessing Alchemy services.
    ```plaintext
    ALCHEMY_API_KEY="F7Mu7X5mbZSChT-jhGGqg6xh77823dC"
    ```
- `ALCHEMY_NETWORK`: The Alchemy network to connect to. For example, `eth-mainnet`.
    ```plaintext
    ALCHEMY_NETWORK="eth-mainnet"
    ```

#### Token List Configuration

- `LIST_TOKENS_CHUNK_SIZE`: The chunk size for listing tokens. This specifies how many tokens to fetch in each chunk.
    ```plaintext
    LIST_TOKENS_CHUNK_SIZE="100"
    ```

#### Caching Configuration

- `USE_CACHE`: Specifies whether to cache data (metadata). Set to `true` to enable caching, `false` to disable.
    ```plaintext
    USE_CACHE="true"
    ```

#### MongoDB Configuration

- `MONGO_DB_NAME`: The name of the MongoDB database.
    ```plaintext
    MONGO_DB_NAME="jumper"
    ```
- `MONGO_HOSTS`: The host addresses for the MongoDB servers.
    ```plaintext
    MONGO_HOSTS="localhost"
    ```
- `MONGO_PORTS`: The port numbers for the MongoDB servers.
    ```plaintext
    MONGO_PORTS="27017"
    ```
- `MONGO_USER`: The username for MongoDB authentication (commented out if not used).
    ```plaintext
    # MONGO_USER="admin"
    ```
- `MONGO_PASSWORD`: The password for MongoDB authentication (commented out if not used).
    ```plaintext
    # MONGO_PASSWORD="admin"
    ```

## Running Tests

1. Run unit tests:
    ```bash
    npm run test
    ```

2. Run test coverage:
    ```bash
    npm run test:coverage
    ```

## Project Structure

The project is divided into several key modules:

- **API**: Uses Express to define routes and handle all tasks related to preparing data for use in business logic.
- **Features**: Contains the core application logic required to perform tasks. This module is decoupled from the web framework, making it reusable across different platforms.
- **IOC (Inversion of Control)**: Contains all dependency injection configurations based on Inversify. This serves as the central place for managing dependencies.
- **Server and Bootstrap**: Responsible for creating and starting the server.