# Expense Tracker Application

A modern expense tracking application built with React, TypeScript, Vite, and MongoDB. This application helps users track their expenses, categorize spending, and visualize their financial data.

## Features

- 📊 Track income and expenses
- 📱 Responsive design for all devices
- 🔒 User authentication
- 📅 Filter expenses by date and category
- 📈 Visualize spending with charts

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher) or Yarn
- MongoDB (local or MongoDB Atlas)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/expense-tracker-application.git
cd expense-tracker-application
```

### 2. Set up the Backend (MongoDB API)

1. Navigate to the mongo-api directory:
   ```bash
   cd mongo-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `mongo-api` directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```
   - For local MongoDB: `mongodb://localhost:27017/expense-tracker`
   - For MongoDB Atlas: Use the connection string from your MongoDB Atlas dashboard

4. Start the backend server:
   ```bash
   npm start
   ```
   The API will be available at `http://localhost:5000`

### 3. Set up the Frontend

1. Open a new terminal and navigate to the project root directory:
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create a `.env` file in the root directory to configure the API URL:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## Available Scripts

In the project directory, you can run:

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## Project Structure

```
expense-tracker-application/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── mongo-api/           # Backend API server
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   └── index.js         # Server entry point
├── .env.example         # Example environment variables
├── package.json         # Frontend dependencies
└── vite.config.ts       # Vite configuration
```

## Environment Variables

### Frontend (Optional)
The frontend can be configured using environment variables. Create a `.env` file in the root directory:

```
VITE_API_BASE_URL=http://localhost:5000
```

### Backend
Required environment variables for the backend are configured in `mongo-api/.env`:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `PORT`: Port for the backend server (default: 5000)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [MongoDB](https://www.mongodb.com/)
- [Lucide Icons](https://lucide.dev/)
- [React Router](https://reactrouter.com/)
- [Express](https://expressjs.com/)
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
