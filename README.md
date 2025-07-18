# 🚌 Full-Stack Bus Booking Application

A complete, production-ready bus booking application with React frontend and Node.js backend, featuring real-world calculations, interactive maps, user authentication, booking history with SQLite database, and real-time features. Perfect for showcasing full-stack development skills and modern web application architecture.

## 🏗️ Architecture

### Frontend (React)
- **Modern React 18** with hooks and functional components
- **Responsive design** with Tailwind CSS
- **Smooth animations** with Framer Motion
- **Interactive maps** with real-time tracking
- **Real-world calculations** for pricing and travel times

### Backend (Node.js/Express)
- **RESTful API** with Express.js
- **SQLite database** with comprehensive schema
- **JWT authentication** with secure token management
- **Real-time features** with Socket.IO
- **Input validation** and error handling

## ✨ Features

### 🎨 **Beautiful Modern UI**
- **Glassmorphism Design** - Modern glass effects and backdrop blur
- **Smooth Animations** - Framer Motion powered interactions
- **Gradient Backgrounds** - Eye-catching animated hero sections
- **Responsive Design** - Perfect on all devices (mobile, tablet, desktop)
- **Interactive Elements** - Hover effects and micro-interactions
- **Custom Tailwind Components** - Tailored UI components

### 🚌 **Interactive Demo Features**
- **Advanced Search** - City selection, date picker, passenger count
- **Bus Listings** - Realistic bus schedules with filters and sorting
- **Interactive Seat Selection** - Visual bus layout with real-time seat selection
- **Booking Confirmation** - Beautiful confirmation page with confetti animation
- **Bus Tracking** - Interactive map showing rough bus location
- **Contact Information** - Driver contact and support details

### 📱 **User Experience**
- **Realistic Mock Data** - 12 cities, 5+ bus operators, dynamic schedules
- **Smart Filtering** - Filter by bus type, price, time, rating
- **Real-time Updates** - Seat availability updates during selection
- **Toast Notifications** - Beautiful feedback for user actions
- **Loading States** - Smooth loading animations throughout
- **Error Handling** - User-friendly error messages

### 🔐 **Backend & Database Features**
- **User Authentication**: JWT-based login/register system with secure password hashing
- **Booking History**: Complete booking management with SQLite database persistence
- **Real-time Features**: Socket.IO for live seat availability and bus tracking updates
- **Data Persistence**: All bookings saved with passenger details and payment information
- **RESTful API**: Comprehensive endpoints for authentication and booking operations
- **Security**: Input validation, rate limiting, CORS configuration, and error handling
- **Real-world Data**: Actual Indian cities, distances, and bus operator information

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

#### Frontend Setup
1. **Clone or download the project**
```bash
cd bus-booking-demo
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Start the frontend development server**
```bash
npm start
```

#### Backend Setup (Optional - for full features)
4. **Navigate to backend directory**
```bash
cd backend
```

5. **Install backend dependencies**
```bash
npm install
```

6. **Initialize and seed the database**
```bash
npm run init-db
npm run seed
```

7. **Start the backend server**
```bash
npm run dev
```

#### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- The app will automatically reload when you make changes

## 🎯 Demo Flow

### **1. Home Page**
- Beautiful hero section with animated background
- Interactive search form with city selection
- Popular routes for quick selection
- Feature highlights and statistics

### **2. Search Results**
- Dynamic bus listings based on search criteria
- Advanced filtering (bus type, price, time, rating)
- Sorting options (price, departure time, duration, rating)
- Bus details with amenities and operator information

### **3. Seat Selection**
- Interactive bus layout visualization
- Different seat types (Available, Selected, Booked, Ladies)
- Real-time seat selection with animations
- Booking summary with total calculation

### **4. Booking Confirmation**
- Success animation with confetti
- Complete booking details
- Passenger information
- Action buttons (Download, Share, Track)

### **5. Bus Tracking**
- Interactive map with animated bus location
- Journey progress indicator
- Driver contact information
- Real-time status updates

## 🎨 UI Highlights

### **Design System**
- **Colors**: Blue primary palette with gradients
- **Typography**: Inter font family for modern look
- **Spacing**: Consistent 8px grid system
- **Shadows**: Layered shadows for depth
- **Animations**: Smooth transitions and micro-interactions

### **Components**
- **Search Form**: Glassmorphism effect with city swap animation
- **Bus Cards**: Hover effects with detailed information
- **Seat Layout**: Interactive grid with visual feedback
- **Status Badges**: Color-coded status indicators
- **Loading States**: Skeleton screens and spinners

### **Responsive Design**
- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Adapted layouts for tablets
- **Desktop Enhanced**: Full-featured desktop experience
- **Touch Friendly**: Large touch targets for mobile

## 📁 Project Structure

```
bus-booking-demo/
├── public/
│   ├── index.html          # HTML template with loading screen
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/
│   │   └── Layout/         # Navbar and Footer components
│   ├── data/
│   │   └── mockData.js     # Realistic mock data
│   ├── pages/
│   │   ├── Home.js         # Landing page with search
│   │   ├── SearchResults.js # Bus listings with filters
│   │   ├── SeatSelection.js # Interactive seat selection
│   │   ├── BookingConfirmation.js # Success page
│   │   └── BusTracking.js  # Bus location tracking
│   ├── App.js              # Main app with routing
│   ├── index.js            # React entry point
│   └── index.css           # Tailwind CSS with custom styles
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
└── package.json            # Dependencies and scripts
```

## 🛠️ Technologies Used

### **Frontend**
- **React 18** - Modern React with hooks
- **React Router v6** - Client-side routing
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **React Hot Toast** - Toast notifications
- **React Confetti** - Celebration animations
- **Date-fns** - Date formatting utilities

### **Development**
- **Create React App** - Zero-config setup
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🎮 Interactive Features

### **Search Experience**
- City autocomplete with popular routes
- Date picker with minimum date validation
- Passenger count selector
- City swap animation
- Form validation with error messages

### **Seat Selection**
- Visual bus layout representation
- Hover effects on available seats
- Click to select/deselect seats
- Different seat types with color coding
- Maximum seat limit (6 seats)
- Real-time price calculation

### **Booking Flow**
- Smooth page transitions
- Loading states between steps
- Data persistence using localStorage
- Success animations and feedback
- Shareable booking confirmation

### **Bus Tracking**
- Animated map with route visualization
- Moving bus icon with location updates
- Journey progress indicator
- Driver contact information
- Status updates and alerts

## 🎨 Customization

### **Colors**
Edit `tailwind.config.js` to change the color scheme:
```javascript
colors: {
  primary: {
    // Your custom color palette
  }
}
```

### **Mock Data**
Modify `src/data/mockData.js` to:
- Add more cities and routes
- Change bus operators
- Adjust pricing and schedules
- Customize amenities and features

### **Animations**
Customize animations in `src/index.css`:
- Adjust timing and easing
- Add new keyframe animations
- Modify hover effects

## 📱 Mobile Experience

- **Touch Optimized**: Large touch targets for mobile
- **Swipe Gestures**: Natural mobile interactions
- **Responsive Layout**: Adapts to all screen sizes
- **Fast Loading**: Optimized for mobile networks
- **Offline Ready**: Can be enhanced for PWA

## 🚀 Deployment

### **Build for Production**
```bash
npm run build
```

### **Deploy Options**
- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Use `gh-pages` package
- **Firebase Hosting**: Use Firebase CLI

## 🎯 Use Cases

- **Portfolio Projects**: Showcase web development skills
- **UI/UX Demonstrations**: Present modern design concepts
- **Client Presentations**: Show interactive prototypes
- **Learning Resource**: Study modern React patterns
- **Interview Projects**: Demonstrate coding abilities

## 📄 License

This project is open source and available under the MIT License.

---

**🚌 Built with ❤️ for modern web experiences**

*This is a demo application with mock data. No real bookings are processed.*
