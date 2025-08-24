import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronRight, 
  Zap, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  Menu, 
  X,
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Home, 
  Bookmark, 
  Settings, 
  LogOut, 
  Send, 
  Link as LinkIcon, 
  Star,
  TrendingUp,
  ShoppingCart,
  Heart,
  ExternalLink,
  Trash2,
  Search,
  Filter,
  Plus
} from 'lucide-react';

// Mock hooks for demonstration
const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const signIn = async (email, password) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ email, name: 'John Doe' });
    setLoading(false);
  };

  const signUp = async (email, password, name) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ email, name });
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ email: 'user@gmail.com', name: 'Google User' });
    setLoading(false);
  };

  const signOut = () => {
    setUser(null);
  };

  return { signIn, signUp, signInWithGoogle, signOut, loading, user };
};

const useApi = () => {
  const analyzeProduct = async (url) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      title: "Sample Product",
      price: "$99.99",
      rating: 4.5,
      reviews: 1250,
      description: "This is a great product with amazing features.",
      pros: ["High quality", "Great value", "Fast shipping"],
      cons: ["Limited colors", "Expensive"],
      recommendation: "Recommended"
    };
  };

  return { analyzeProduct };
};

const toast = {
  success: (message) => console.log('Success:', message),
  error: (message) => console.error('Error:', message),
  loading: (message) => console.log('Loading:', message)
};

// Landing Page Component
const Landing = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Get product insights in seconds with our AI-powered analysis"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Smart Recommendations",
      description: "AI-driven suggestions to help you make better purchasing decisions"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Price Tracking",
      description: "Monitor price changes and get alerts for the best deals"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-black/80 backdrop-blur-lg border-b border-gray-800' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">BuyBuddy</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</a>
              <button
                onClick={() => onNavigate('auth')}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-lg border-b border-gray-800">
            <div className="px-4 py-4 space-y-4">
              <button
                onClick={() => onNavigate('auth')}
                className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-left"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Shopping Assistant
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Smart Shopping
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Paste any product URL and get instant AI-powered insights, price comparisons, 
              and smart recommendations to make better purchasing decisions.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => onNavigate('auth')}
                className="group bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center space-x-2 hover:scale-105"
              >
                <span>Start Analyzing</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to make smarter shopping decisions, powered by advanced AI
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-gray-800/50 border border-gray-700 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:bg-gray-800/70 hover:scale-105"
              >
                <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Auth Component
const Auth = ({ onAuth, onNavigate }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const { signIn, signUp, signInWithGoogle, loading } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.name);
        toast.success('Account created successfully!');
      } else {
        await signIn(formData.email, formData.password);
        toast.success('Signed in successfully!');
      }
      onAuth();
    } catch (error) {
      toast.error('Authentication failed');
      console.error('Auth error:', error);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
      toast.success('Signed in with Google!');
      onAuth();
    } catch (error) {
      toast.error('Google sign-in failed');
      console.error('Google auth error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
      
      <button
        onClick={() => onNavigate('landing')}
        className="absolute top-6 left-6 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors z-10"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </button>

      <div className="relative w-full max-w-md">
        <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">BuyBuddy</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-400">
              {isSignUp 
                ? 'Start your smart shopping journey today' 
                : 'Sign in to continue to your dashboard'
              }
            </p>
          </div>

          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full bg-white text-black hover:bg-gray-100 border border-gray-300 px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-3 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 pl-12 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 pl-12 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 pl-12 pr-12 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('analyze');
  const [productUrl, setProductUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [savedProducts, setSavedProducts] = useState([
    {
      id: 1,
      title: "iPhone 15 Pro Max",
      price: "$1,199",
      rating: 4.5,
      image: "https://via.placeholder.com/150",
      analyzed: true
    },
    {
      id: 2,
      title: "MacBook Air M2",
      price: "$1,099",
      rating: 4.8,
      image: "https://via.placeholder.com/150",
      analyzed: true
    }
  ]);

  const { user, signOut } = useAuth();
  const { analyzeProduct } = useApi();

  const handleAnalyze = async () => {
    if (!productUrl.trim()) {
      toast.error('Please enter a product URL');
      return;
    }

    setAnalyzing(true);
    try {
      const result = await analyzeProduct(productUrl);
      setAnalysisResult(result);
      toast.success('Product analyzed successfully!');
    } catch (error) {
      toast.error('Failed to analyze product');
      console.error('Analysis error:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveProduct = () => {
    if (analysisResult) {
      const newProduct = {
        id: Date.now(),
        title: analysisResult.title,
        price: analysisResult.price,
        rating: analysisResult.rating,
        image: "https://via.placeholder.com/150",
        analyzed: true
      };
      setSavedProducts([...savedProducts, newProduct]);
      toast.success('Product saved to your list!');
    }
  };

  const handleDeleteProduct = (id) => {
    setSavedProducts(savedProducts.filter(product => product.id !== id));
    toast.success('Product removed from your list');
  };

  const handleSignOut = () => {
    signOut();
    onNavigate('landing');
    toast.success('Signed out successfully');
  };

  const renderSidebar = () => (
    <div className="w-64 bg-gray-900 border-r border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">BuyBuddy</h2>
          <p className="text-sm text-gray-400">{user?.name}</p>
        </div>
      </div>

      <nav className="space-y-2">
        <button
          onClick={() => setActiveTab('analyze')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'analyze' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Analyze Product</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'saved' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span>Saved Products</span>
          <span className="ml-auto bg-gray-700 text-xs px-2 py-1 rounded-full">
            {savedProducts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </nav>

      <div className="absolute bottom-6 w-56">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  const renderAnalyzeTab = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-2xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Analyze Product</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product URL
            </label>
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder="Paste Amazon, eBay, or any product URL here..."
                  className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 pl-12 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {analyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Analyze</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {analysisResult && (
        <div className="bg-gray-800 rounded-2xl p-8">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold text-white">Analysis Results</h3>
            <button
              onClick={handleSaveProduct}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Save Product</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold text-white mb-4">{analysisResult.title}</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-green-400">{analysisResult.price}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-white">{analysisResult.rating}</span>
                    <span className="text-gray-400">({analysisResult.reviews} reviews)</span>
                  </div>
                </div>
                <p className="text-gray-300">{analysisResult.description}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h5 className="text-lg font-semibold text-green-400 mb-2">Pros</h5>
                <ul className="space-y-1">
                  {analysisResult.pros.map((pro, index) => (
                    <li key={index} className="text-gray-300 flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-lg font-semibold text-red-400 mb-2">Cons</h5>
                <ul className="space-y-1">
                  {analysisResult.cons.map((con, index) => (
                    <li key={index} className="text-gray-300 flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-900/50 border border-blue-500/20 rounded-lg p-4">
                <h5 className="text-lg font-semibold text-blue-400 mb-2">AI Recommendation</h5>
                <p className="text-gray-300">{analysisResult.recommendation}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSavedTab = () => (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Saved Products</h2>
        <div className="flex items-center space-x-4">
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {savedProducts.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No saved products yet</h3>
          <p className="text-gray-500">Start analyzing products to build your collection</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProducts.map((product) => (
            <div key={product.id} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors">
              <div className="relative mb-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{product.title}</h3>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-green-400">{product.price}</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white text-sm">{product.rating}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettingsTab = () => (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-8">Settings</h2>
      
      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Profile Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={user?.name || ''}
                className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your email"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Price Drop Alerts</h4>
                <p className="text-gray-400 text-sm">Get notified when saved products go on sale</p>
              </div>
              <button className="bg-blue-600 relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
                <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Weekly Digest</h4>
                <p className="text-gray-400 text-sm">Receive weekly summary of your saved products</p>
              </div>
              <button className="bg-gray-600 relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
                <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-medium mb-2">Delete Account</h4>
              <p className="text-gray-400 text-sm mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex">
      {renderSidebar()}
      
      <div className="flex-1 p-8 overflow-auto">
        {activeTab === 'analyze' && renderAnalyzeTab()}
        {activeTab === 'saved' && renderSavedTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const handleAuthentication = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  useEffect(() => {
    // Check if user is already authenticated (you'd check localStorage/sessionStorage in real app)
    const checkAuth = () => {
      // Simulated auth check
      const isLoggedIn = false; // This would be your actual auth check
      if (isLoggedIn) {
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
      }
    };
    
    checkAuth();
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onNavigate={handleNavigation} />;
      case 'auth':
        return <Auth onAuth={handleAuthentication} onNavigate={handleNavigation} />;
      case 'dashboard':
        return isAuthenticated ? <Dashboard onNavigate={handleNavigation} /> : <Auth onAuth={handleAuthentication} onNavigate={handleNavigation} />;
      default:
        return <Landing onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
      {/* Toast notifications would go here in a real app */}
    </div>
  );
};

export default App;