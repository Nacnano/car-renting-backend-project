# API Service

## How to Run

### Prerequisites

- Node.js installed
- MongoDB connection string

### Steps

1. Navigate to the `api` directory:

   ```bash
   cd api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `config/config.env` file (use `config/config.env.example` as a template) and add your configuration:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=<your_mongodb_uri>
   JWT_SECRET=<your_secret>
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   ```

4. Run the server:

   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`
