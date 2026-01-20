# GoNomad 🚗

A comprehensive full-stack platform for renting cars and bikes. GoNomad connects vehicle owners with customers seeking reliable and affordable transportation solutions.

## 🎯 Project Overview

GoNomad is a modern, scalable car and bike rental platform built with cutting-edge technologies. It solves the transportation accessibility problem by providing users with:

- **Easy vehicle booking** - Browse and book cars/bikes with just a few clicks
- **Owner management** - Vehicle owners can manage their fleet and bookings
- **Secure authentication** - JWT-based authentication for both users and owners
- **Image management** - Seamless image uploads with ImageKit integration
- **Real-time updates** - Monitor bookings and vehicle status

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Contributing](#-contributing)
- [License](#-license)
- [Authors & Acknowledgments](#-authors--acknowledgments)
- [Support](#-support)

## ✨ Features

### User Features
- 🔐 Secure user authentication and registration
- 🚗 Browse available cars and bikes
- 📋 View detailed vehicle information
- 📅 Book vehicles for desired dates
- 📝 Manage personal bookings
- 💬 Newsletter subscription

### Owner Features
- 📊 Comprehensive dashboard
- ➕ Add and manage vehicle listings
- 📈 Track booking requests
- ✅ Accept/decline bookings
- 👥 Monitor booking history

### General Features
- 🎨 Responsive and modern UI design
- 📱 Mobile-friendly interface
- 🏃 Fast performance with Vite
- 🛡️ Data validation and security
- 📦 Image upload and storage

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.1.0
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4.1.10
- **HTTP Client**: Axios
- **Routing**: React Router DOM 7.6.2
- **Animations**: Motion 12.19.1
- **Notifications**: React Hot Toast 2.5.2
- **Linting**: ESLint

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose 8.16.0
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Bcrypt 6.0.0
- **File Upload**: Multer 2.0.1
- **Image Storage**: ImageKit
- **CORS**: Enabled for cross-origin requests
- **Dev Tool**: Nodemon 3.1.10

## 📦 Installation

### Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (v16.0.0 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Git

### Clone the Repository
```bash
git clone https://github.com/yourusername/go-nomad.git
cd go-nomad
```

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
CLIENT_URL=http://localhost:5173
```

4. Start the server:
```bash
npm run server  # Development mode with nodemon
# or
npm start      # Production mode
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory (if needed):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:5173`

5. Build for production:
```bash
npm run build
```

## 🚀 Usage

### For Users
1. Open the application at `http://localhost:5173`
2. Register or login with your credentials
3. Browse available vehicles on the Cars page
4. Click on a vehicle to view details
5. Select your booking dates and confirm
6. View your bookings in the "My Bookings" section
7. Subscribe to our newsletter for updates

### For Owners
1. Login as an owner or register as a new owner
2. Navigate to the Owner Dashboard
3. Click "Add Car" to list a new vehicle
4. Fill in vehicle details and upload images
5. Manage your fleet in "Manage Cars"
6. Review and respond to booking requests in "Manage Bookings"
7. Track your booking history and earnings

### API Endpoints

#### User Routes
```
POST   /api/users/register      - Register new user
POST   /api/users/login         - User login
GET    /api/users/profile       - Get user profile
```

#### Owner Routes
```
POST   /api/owners/register     - Register as owner
POST   /api/owners/add-car      - Add new vehicle
GET    /api/owners/cars         - Get owner's vehicles
PUT    /api/owners/update-car   - Update vehicle details
GET    /api/owners/bookings     - Get booking requests
```

#### Booking Routes
```
POST   /api/bookings/create     - Create new booking
GET    /api/bookings/my-bookings - Get user's bookings
PUT    /api/bookings/update     - Update booking status
```

## 📂 Project Structure

```
go-nomad/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (state management)
│   │   ├── assets/         # Images and static files
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── server/                  # Node.js backend
    ├── controllers/        # Route handlers
    ├── models/            # MongoDB models
    ├── routes/            # API routes
    ├── middleware/        # Custom middleware
    ├── configs/           # Configuration files
    ├── server.js
    └── package.json
```

## ⚙️ Configuration

### Environment Variables

**Server (.env)**
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `IMAGEKIT_*` - ImageKit API credentials
- `CLIENT_URL` - Frontend URL for CORS

**Client (.env)**
- `VITE_API_BASE_URL` - Backend API URL

### Database Models
- **User** - Stores user account information
- **Car** - Vehicle listings and details
- **Booking** - Rental bookings and status
- **Owner** - Vehicle owner information

## 🤝 Contributing

We welcome contributions! To contribute to GoNomad, please follow these steps:

1. **Fork the repository** on GitHub
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**:
   ```bash
   git commit -m "Add your feature description"
   ```
4. **Push to the branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Submit a Pull Request** with a clear description of your changes

### Reporting Bugs
If you find a bug, please create an issue with:
- A clear description of the bug
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots (if applicable)

### Requesting Features
To request a new feature:
- Open an issue with the "enhancement" label
- Clearly describe the feature and its use case
- Include any relevant examples or mockups

**Special Thanks To**
- MongoDB community for excellent documentation
- Express.js team for the robust framework
- React community for continuous improvements
- ImageKit for image management solutions
- All contributors and testers who helped improve GoNomad

## 🆘 Support

For support, email 22bcs029@nith.ac.in or open an issue on GitHub.

### Additional Resources
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Made with ❤️ by the Aryan**
