import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  Bookmark, 
  Settings, 
  LogOut, 
  Send, 
  Link2 as LinkIcon, 
  Star,
  TrendingUp,
  ShoppingCart,
  Heart,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';

const Dashboard = ({ user = { name: 'John Doe', email: 'john@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' }, onLogout = () => console.log('Logout clicked') }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hi! I\'m your AI shopping assistant. Paste any product URL and I\'ll analyze it for you!',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedProducts, setSavedProducts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    // Simulate API call for product analysis
    setTimeout(() => {
      if (isValidUrl(inputValue)) {
        // Simulated product data
        const productData = {
          title: "Apple iPhone 15 Pro Max",
          price: "$1,199.00",
          originalPrice: "$1,299.00",
          discount: "8% off",
          rating: 4.7,
          reviews: 2847,
          image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop",
          description: "The most advanced iPhone ever with titanium design, A17 Pro chip, and pro camera system.",
          features: [
            "6.7-inch Super Retina XDR display",
            "A17 Pro chip with 6-core GPU",
            "Pro camera system with 5x optical zoom",
            "Titanium design"
          ],
          pros: [
            "Exceptional camera quality",
            "Premium titanium build",
            "Excellent performance",
            "Long battery life"
          ],
          cons: [
            "Very expensive",
            "No significant design changes",
            "Lightning to USB-C transition"
          ],
          alternatives: [
            { name: "Samsung Galaxy S24 Ultra", price: "$1,099.99" },
            { name: "Google Pixel 8 Pro", price: "$999.00" }
          ],
          aiSummary: "This is a premium flagship phone with excellent build quality and camera performance. While expensive, it offers top-tier features and will last for years. Consider waiting for sales or looking at alternatives if budget is a concern."
        };

        const botResponse = {
          id: messages.length + 2,
          type: 'bot',
          content: 'analysis',
          productData,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botResponse]);
      } else {
        const botResponse = {
          id: messages.length + 2,
          type: 'bot',
          content: 'I can help you analyze products! Please paste a valid product URL from Amazon, eBay, or other shopping sites.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }
      setLoading(false);
    }, 2000);
  };

  const saveProduct = (productData) => {
    const savedProduct = {
      id: Date.now(),
      ...productData,
      savedAt: new Date()
    };
    setSavedProducts(prev => [...prev, savedProduct]);
  };

  const renderMessage = (message) => {
    if (message.type === 'user') {
      return (
        <div key={message.id} className="flex justify-end mb-4">
          <div className="max-w-xs lg:max-w-md">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg rounded-br-none">
              {message.content}
            </div>
            <div className="text-xs text-gray-400 mt-1 text-right">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      );
    }

    if (message.content === 'analysis' && message.productData) {
      const product = message.productData;
      return (
        <div key={message.id} className="flex justify-start mb-6">
          <div className="max-w-2xl w-full">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full md:w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{product.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-green-400">{product.price}</span>
                    {product.originalPrice && (
                      <>
                        <span className="text-gray-400 line-through">{product.originalPrice}</span>
                        <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">
                          {product.discount}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-white">{product.rating}</span>
                    <span className="text-gray-400">({product.reviews} reviews)</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveProduct(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      Save
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      View Product
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-4 mb-6">
              <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                AI Analysis
              </h4>
              <p className="text-gray-300">{product.aiSummary}</p>
            </div>

            {/* Pros and Cons */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="text-green-400 font-semibold mb-2">Pros</h4>
                <ul className="space-y-1">
                  {product.pros.map((pro, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-red-400 font-semibold mb-2">Cons</h4>
                <ul className="space-y-1">
                  {product.cons.map((con, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Alternatives */}
            <div>
              <h4 className="text-white font-semibold mb-3">Similar Products</h4>
              <div className="grid gap-2">
                {product.alternatives.map((alt, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-lg p-3 flex justify-between items-center">
                    <span className="text-gray-300">{alt.name}</span>
                    <span className="text-blue-400 font-semibold">{alt.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-400 mt-2">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={message.id} className="flex justify-start mb-4">
        <div className="max-w-xs lg:max-w-md">
          <div className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg rounded-bl-none">
            {message.content}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  };

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'saved', label: 'Saved Products', icon: Bookmark },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'saved':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Saved Products</h2>
            {savedProducts.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No saved products yet</p>
                <p className="text-sm">Start analyzing products to save your favorites!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {savedProducts.map(product => (
                  <div key={product.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <div className="flex gap-4">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{product.title}</h3>
                        <p className="text-blue-400 font-bold">{product.price}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          Saved {product.savedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <div className="space-y-6">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Profile</h3>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <p className="text-white font-semibold">{user.name}</p>
                    <p className="text-gray-400">{user.email}</p>
                  </div>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Edit Profile
                </button>
              </div>
              
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Email Notifications</span>
                    <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Price Alerts</span>
                    <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map(renderMessage)}
              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      <span className="text-gray-400">Analyzing product...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-700 p-6">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Paste a product URL here..."
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    disabled={loading}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={loading || !inputValue.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Paste any product URL from Amazon, eBay, or other shopping sites
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">BuyBuddy</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;