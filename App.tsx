import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Register from './pages/Register';
import Login from './pages/Login';
import BloodBanks from './pages/BloodBanks';
import Camps from './pages/Camps';
import Dashboard from './pages/Dashboard';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import RequestBlood from './pages/RequestBlood';
import { BloodRequest } from './types';

const EmergencyModal: React.FC<{ requests: BloodRequest[], onClose: () => void }> = ({ requests, onClose }) => {
  if (requests.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
        <div className="bg-primary p-6 sm:p-8 text-white relative shrink-0">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-all hover:rotate-90 active:scale-90"
          >
            <span className="material-icons">close</span>
          </button>
          <div className="flex items-center gap-4 mb-2">
            <span className="material-icons text-3xl animate-pulse">emergency</span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
              {requests.length > 1 ? `${requests.length} Active Emergency Alerts` : 'Priority Emergency Alert'}
            </h2>
          </div>
          <p className="opacity-90 font-medium text-sm">Verified emergency broadcasts matching your location.</p>
        </div>
        
        <div className="p-4 sm:p-8 space-y-4 overflow-y-auto bg-slate-50 dark:bg-slate-950">
          {requests.map((request, idx) => (
            <div 
              key={request.id} 
              style={{ animationDelay: `${idx * 100}ms` }}
              className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 text-left transition-all hover:border-primary/30 hover:shadow-lg animate-fade-in-up"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center shadow-sm border border-red-100/50 dark:border-red-900/50">
                    <p className="text-2xl font-black text-primary">{request.bloodGroup}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Patient Name</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{request.patientName}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">District / City</p>
                   <p className="font-bold text-slate-700 dark:text-slate-300">{request.district}, {request.city}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="material-icons text-primary text-lg mt-0.5">hospital</span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Hospital</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{request.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-icons text-primary text-lg mt-0.5">history</span>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Broadcasted</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{new Date(request.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a href={`tel:${request.contactMobile}`} className="flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl font-black text-xs active:scale-95 shadow-md shadow-primary/20 hover:bg-red-700 transition-all">
                  <span className="material-icons text-sm">call</span>
                  Call Now
                </a>
                <a href={`https://wa.me/91${request.contactMobile}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3.5 bg-[#25D366] text-white rounded-xl font-black text-xs active:scale-95 shadow-md shadow-emerald-500/20 hover:bg-[#20ba5a] transition-all">
                  <span className="material-icons text-sm">chat</span>
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0 text-center">
          <p className="text-xs text-slate-400 font-medium italic">Please only contact in case of genuine availability to donate.</p>
        </div>
      </div>
    </div>
  );
};

const LiveAlertBar: React.FC<{ onView: (rs: BloodRequest[]) => void }> = ({ onView }) => {
  const [relevantRequests, setRelevantRequests] = useState<BloodRequest[]>([]);
  const location = useLocation();

  useEffect(() => {
    const checkAlerts = () => {
      const userStr = localStorage.getItem('indiaBloodConnect_user');
      const requestsStr = localStorage.getItem('indiaBloodConnect_requests');
      
      if (!userStr || !requestsStr) {
        setRelevantRequests([]);
        return;
      }

      const user = JSON.parse(userStr);
      const requests = JSON.parse(requestsStr);

      const matches = requests
        .filter((r: BloodRequest) => 
          r.district.toLowerCase() === user.district.toLowerCase() || 
          r.state.toLowerCase() === user.state.toLowerCase()
        )
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setRelevantRequests(matches);
    };

    checkAlerts();
    window.addEventListener('storage', checkAlerts);
    const interval = setInterval(checkAlerts, 2000); 
    return () => {
      window.removeEventListener('storage', checkAlerts);
      clearInterval(interval);
    };
  }, [location]);

  if (relevantRequests.length === 0) return null;

  const mainRequest = relevantRequests[0];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-3xl z-50 pointer-events-none">
      <div className="bg-[#1a1f2e] text-white p-3 pr-4 rounded-full shadow-2xl flex items-center justify-between border border-white/10 overflow-hidden animate-in slide-in-from-bottom-8 duration-500 pointer-events-auto group">
        <div className="flex items-center gap-4 min-w-0">
          <div className="bg-[#e53e3e] w-10 h-10 rounded-full flex items-center justify-center shrink-0">
            <span className="material-icons text-white text-xl animate-pulse">star</span>
          </div>
          <div className="min-w-0 text-left">
            <p className="text-[#e53e3e] text-[10px] font-black uppercase tracking-[0.15em] leading-none mb-1">Live Emergency Alert</p>
            <p className="text-sm font-bold truncate">
              {relevantRequests.length > 1 
                ? `${relevantRequests.length} Emergency Alerts in ${mainRequest.district}`
                : `${mainRequest.bloodGroup} Needed in ${mainRequest.district}`
              }
            </p>
          </div>
        </div>
        <button 
          onClick={() => onView(relevantRequests)}
          className="bg-white text-[#1a1f2e] px-6 py-2.5 rounded-full text-xs font-black hover:bg-primary hover:text-white transition-all active:scale-95 whitespace-nowrap ml-4 shadow-sm"
        >
          {relevantRequests.length > 1 ? 'View All' : 'View Request'}
        </button>
      </div>
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const checkUser = () => {
    const savedUser = localStorage.getItem('indiaBloodConnect_user');
    setUser(savedUser ? JSON.parse(savedUser) : null);
  };

  useEffect(() => {
    checkUser();
    window.addEventListener('storage', checkUser);
    const interval = setInterval(checkUser, 1000);
    return () => {
      window.removeEventListener('storage', checkUser);
      clearInterval(interval);
    };
  }, [location]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('indiaBloodConnect_user');
      setUser(null);
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Donors', path: '/search' },
    { name: 'Blood Banks', path: '/banks' },
    { name: 'Camps', path: '/camps' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-1.5 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
              <span className="material-icons text-white text-2xl leading-none">water_drop</span>
            </div>
            <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">INDIA <span className="text-primary">BLOOD</span></span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold px-4 py-2 rounded-xl transition-all ${
                  location.pathname === link.path 
                    ? 'text-primary bg-primary/5' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>
            
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className={`text-sm font-bold flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    location.pathname === '/dashboard' 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="material-icons text-lg">account_circle</span>
                  {user.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-primary transition-colors active:scale-90" title="Logout">
                  <span className="material-icons">logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary px-4 py-2 transition-colors">Login</Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-black hover:bg-red-700 hover:shadow-xl transition-all active:scale-95 shadow-primary/10"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-primary focus:outline-none active:scale-90 transition-transform">
              <span className="material-icons text-3xl">{isOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 z-40 bg-white dark:bg-slate-900 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="p-4 flex justify-end h-20 items-center">
            <button onClick={() => setIsOpen(false)} className="p-2 text-primary">
              <span className="material-icons text-3xl">close</span>
            </button>
         </div>
         <div className="px-6 space-y-2 flex flex-col items-center">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="w-full text-center py-4 text-xl font-bold border-b border-slate-50 dark:border-slate-800">
              {link.name}
            </Link>
          ))}
          {user ? (
            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="w-full text-center py-4 text-xl font-bold text-primary">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center py-4 text-xl font-bold">Login</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="w-full text-center py-4 text-xl font-bold text-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-white dark:bg-slate-950 pt-24 pb-12 border-t border-slate-100 dark:border-slate-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div className="space-y-6 text-left">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <span className="material-icons text-white text-xl">water_drop</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">INDIA <span className="text-primary">BLOOD</span></span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
            A nationwide ecosystem to bridge the gap between donors and patients in real-time.
          </p>
        </div>
        <div className="text-left">
          <h4 className="font-bold text-slate-900 dark:text-white mb-8 text-xs uppercase tracking-widest">Navigation</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><Link to="/search" className="hover:text-primary transition-colors">Find a Donor</Link></li>
            <li><Link to="/register" className="hover:text-primary transition-colors">Become a Donor</Link></li>
            <li><Link to="/banks" className="hover:text-primary transition-colors">Blood Banks</Link></li>
            <li><Link to="/camps" className="hover:text-primary transition-colors">Donation Camps</Link></li>
          </ul>
        </div>
        <div className="text-left">
          <h4 className="font-bold text-slate-900 dark:text-white mb-8 text-xs uppercase tracking-widest">Resources</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
        <div className="text-left">
          <h4 className="font-bold text-slate-900 dark:text-white mb-8 text-xs uppercase tracking-widest">Emergency</h4>
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 font-bold mb-1 uppercase">Helpline 24/7</p>
            <p className="text-lg font-black text-primary">1800-BLOOD-HELP</p>
          </div>
        </div>
      </div>
      <div className="pt-8 border-t border-slate-100 dark:border-slate-900 text-center flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-400 font-medium">© 2024 India Blood Connect. Building a healthier India.</p>
        <div className="flex gap-4">
          {['facebook', 'twitter', 'instagram'].map(icon => (
            <button key={icon} className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-primary transition-all">
              <span className={`material-icons text-base`}>{icon}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  const [selectedRequests, setSelectedRequests] = useState<BloodRequest[]>([]);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow page-transition">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/banks" element={<BloodBanks />} />
          <Route path="/camps" element={<Camps />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/request" element={<RequestBlood />} />
        </Routes>
      </main>
      
      <LiveAlertBar onView={(rs) => setSelectedRequests(rs)} />
      <EmergencyModal 
        requests={selectedRequests} 
        onClose={() => setSelectedRequests([])} 
      />
      
      <Footer />
    </div>
  );
};

const RootApp: React.FC = () => (
  <HashRouter>
    <App />
  </HashRouter>
);

export default RootApp;