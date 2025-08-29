# VoiceCart - Voice-Enabled Retail App

A modern React Native app that enables voice-powered shopping with AI features. Shop using natural language commands, track orders through an intelligent chat bot, and enjoy a seamless mobile commerce experience.

## 🌟 Features

### Core Features
- **Voice & Text Search**: Search products using natural language like "Show me breakfast items under 200"
- **Voice Commands**: Add items to cart by saying "Order 2 packs of dosa batter"
- **Smart Cart Management**: Complete shopping cart with quantity controls and real-time totals
- **Order Tracking Bot**: AI-powered chat bot for checking order status
- **Secure Authentication**: Email/password authentication with Supabase
- **Real-time Updates**: Live cart and order synchronization

### AI & Voice Features
- **Natural Language Processing**: Parse complex search queries and voice commands
- **Intent Recognition**: Understand user intent from speech (search, add to cart, order status)
- **Voice Feedback**: Text-to-speech responses for voice interactions
- **Smart Product Matching**: Find products using partial names and descriptions

### Technical Features
- **Cross-platform**: Works on iOS, Android, and Web
- **Responsive Design**: Optimized for all screen sizes
- **Offline-first**: Graceful handling of network issues
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Beautiful design with smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Expo CLI
- Supabase account

### Setup Instructions

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd voice-retail-app
   npm install
   ```

2. **Setup Supabase**
   - Click "Connect to Supabase" button in the top right
   - The database schema will be automatically created
   - Sample products will be populated

3. **Start Development**
   ```bash
   npm run dev
   ```

4. **Open the App**
   - Scan QR code with Expo Go app
   - Or press 'w' to open in web browser

## 📱 How to Use

### Getting Started
1. Create an account or sign in
2. Browse products on the Home tab
3. Use voice or text search to find items

### Voice Commands Examples
- **Search**: "Show me breakfast items under 200"
- **Add to Cart**: "Order 2 packs of dosa batter"
- **Order Status**: "What's the status of order #ABC123"

### Shopping Flow
1. **Search Products**: Use the search bar or voice button
2. **Add to Cart**: Tap the + button or use voice commands
3. **Review Cart**: Go to Cart tab to review items
4. **Checkout**: Place your order with one tap
5. **Track Order**: Use the Orders tab or chat bot

### Order Tracking
- View all orders in the Orders tab
- Use the chat bot for natural language order queries
- Get real-time status updates

## 🛠 Technical Architecture

### Project Structure
```
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
├── services/              # Business logic and API calls
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── lib/                   # Configuration and utilities
└── supabase/             # Database migrations
```

### Key Technologies
- **Framework**: React Native with Expo
- **Navigation**: Expo Router with tab-based architecture
- **Database**: Supabase with PostgreSQL
- **Voice**: Web Speech API / Expo Speech
- **Styling**: StyleSheet with design system
- **State Management**: React hooks and context
- **Typography**: Inter font family

### Database Schema
- **Products**: Store product catalog with categories and pricing
- **Cart Items**: User shopping cart with quantities
- **Orders**: Order history with status tracking
- **Order Items**: Individual items within orders

## 🎨 Design System

### Colors
- **Primary**: Purple (#8B5CF6)
- **Accent**: Blue (#3B82F6) 
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)
- **Neutral**: Gray scale

### Typography
- **Headings**: Inter Bold/SemiBold
- **Body**: Inter Regular/Medium
- **Spacing**: 8px grid system

### Components
- **Voice Button**: Animated microphone with pulse effect
- **Product Cards**: Clean cards with images and pricing
- **Chat Interface**: Message bubbles with timestamps
- **Search Header**: Combined text/voice search

## 🧪 Testing Voice Features

### Web Testing
- Use Chrome or Safari for best voice recognition
- Grant microphone permissions when prompted
- Speak clearly after pressing the voice button

### Mobile Testing
- Voice recognition works on iOS and Android
- Test with Expo Go app for full functionality
- Ensure microphone permissions are granted

### Sample Voice Commands
```
"Show me breakfast items under 200"
"Order 2 packs of dosa batter"  
"Add coconut chutney to cart"
"What's my latest order status?"
"Find spices under 150"
```

## 🔧 Environment Variables

Required environment variables (automatically configured with Supabase):
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚢 Deployment

### Web Deployment
```bash
npm run build:web
```

### Mobile Deployment
1. **Development Build**:
   ```bash
   npx expo install --fix
   npx expo run:ios
   npx expo run:android
   ```

2. **Production Build**:
   ```bash
   eas build --platform all
   ```

## 🛡 Security Features

- **Row Level Security**: Users can only access their own data
- **Authentication**: Secure email/password authentication
- **Data Validation**: Input validation and sanitization
- **API Security**: Protected routes and proper error handling

## 📊 Performance Optimizations

- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Optimized product images
- **Database Indexing**: Fast queries with proper indexes
- **Caching**: Efficient data caching strategies

## 🧭 Future Enhancements

### Planned Features
- **Telegram Bot**: Order via Telegram
- **Personalized Offers**: AI-powered recommendations
- **Auto Categorization**: Smart product categorization
- **Advanced NLP**: More sophisticated voice understanding
- **Push Notifications**: Order status updates
- **Payment Integration**: Stripe/Razorpay integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Built with ❤️ using modern React Native and AI technologies.