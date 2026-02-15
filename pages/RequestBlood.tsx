
import React, { useState, useEffect } from 'react';
import { INDIAN_STATES_DISTRICTS } from '../data/locations';
import { BloodGroup, BloodRequest } from '../types';

const RequestBlood: React.FC = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [city, setCity] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [myRequests, setMyRequests] = useState<BloodRequest[]>([]);
  
  const [patientData, setPatientData] = useState({
    name: '',
    bloodGroup: '' as BloodGroup,
    location: '',
  });

  const states = Object.keys(INDIAN_STATES_DISTRICTS).sort();
  const districts = selectedState ? INDIAN_STATES_DISTRICTS[selectedState].sort() : [];

  const loadMyRequests = () => {
    const allRequestsStr = localStorage.getItem('indiaBloodConnect_requests');
    const userStr = localStorage.getItem('indiaBloodConnect_user');
    
    if (!allRequestsStr) {
      setMyRequests([]);
      return;
    }

    try {
      const allRequests: BloodRequest[] = JSON.parse(allRequestsStr);
      
      // If user is logged in, show their specific requests. 
      // Otherwise show all requests created in this local session for demo purposes
      if (userStr) {
        const user = JSON.parse(userStr);
        const filtered = allRequests.filter(req => req.contactMobile === user.mobile);
        setMyRequests(filtered);
      } else {
        // Fallback: if not logged in, just show all for the session
        setMyRequests(allRequests);
      }
    } catch (e) {
      console.error("Failed to parse requests", e);
      setMyRequests([]);
    }
  };

  useEffect(() => {
    loadMyRequests();
    window.addEventListener('storage', loadMyRequests);
    return () => window.removeEventListener('storage', loadMyRequests);
  }, []);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    const userStr = localStorage.getItem('indiaBloodConnect_user');
    if (!userStr) {
      alert("Please login to request blood support.");
      return;
    }
    
    const user = JSON.parse(userStr);
    setIsBroadcasting(true);
    
    const newRequest: BloodRequest = {
      id: 'REQ-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      patientName: patientData.name,
      bloodGroup: patientData.bloodGroup,
      state: selectedState,
      district: selectedDistrict,
      city: city,
      location: patientData.location,
      timestamp: new Date().toISOString(),
      contactName: user.name,
      contactMobile: user.mobile
    };

    setTimeout(() => {
      const existingRequestsStr = localStorage.getItem('indiaBloodConnect_requests');
      const existingRequests = existingRequestsStr ? JSON.parse(existingRequestsStr) : [];
      existingRequests.push(newRequest);
      localStorage.setItem('indiaBloodConnect_requests', JSON.stringify(existingRequests));
      
      window.dispatchEvent(new Event('storage'));

      setIsBroadcasting(false);
      setShowSuccess(true);
      loadMyRequests();
      setTimeout(() => setShowSuccess(false), 5000);
      
      // Reset Form
      setPatientData({ name: '', bloodGroup: '' as BloodGroup, location: '' });
      setSelectedState('');
      setSelectedDistrict('');
      setCity('');
    }, 1200);
  };

  const handleCancelRequest = (requestId: string) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this emergency request? It will be removed from the live broadcast network.");
    
    if (confirmCancel) {
      const allRequestsStr = localStorage.getItem('indiaBloodConnect_requests');
      if (allRequestsStr) {
        try {
          const allRequests: BloodRequest[] = JSON.parse(allRequestsStr);
          const updatedRequests = allRequests.filter(req => req.id !== requestId);
          
          localStorage.setItem('indiaBloodConnect_requests', JSON.stringify(updatedRequests));
          
          // Force immediate state update for the UI
          setMyRequests(prev => prev.filter(req => req.id !== requestId));
          
          // Notify other components
          window.dispatchEvent(new Event('storage'));
        } catch (e) {
          console.error("Failed to cancel request", e);
        }
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className={`fixed top-24 right-4 z-50 transition-all duration-500 transform ${showSuccess ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0 pointer-events-none'}`}>
        <div className="bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
          <span className="material-icons">rss_feed</span>
          <div className="text-left">
            <p className="font-bold text-sm">Broadcast Successful!</p>
            <p className="text-xs opacity-80">Live alerts sent to all donors in {selectedDistrict || 'the area'}.</p>
          </div>
        </div>
      </div>

      <div className="mb-8 text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 font-display">Request Emergency Blood</h1>
        <p className="text-slate-600 dark:text-slate-400">Fill out the details below to trigger a priority alert for verified donors in your specific location.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white dark:bg-slate-900/50 p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800">
            <form className="space-y-6" onSubmit={handleBroadcast}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-left">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Patient Name</label>
                  <input 
                    value={patientData.name}
                    onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-primary h-12 px-4 outline-none transition-all placeholder:text-slate-400" 
                    placeholder="Full Name" type="text" required 
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Blood Group Needed</label>
                  <select 
                    value={patientData.bloodGroup}
                    onChange={(e) => setPatientData({...patientData, bloodGroup: e.target.value as BloodGroup})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-primary h-12 px-4 outline-none transition-all text-slate-600" required
                  >
                    <option value="">Select Blood Group</option>
                    <option>A+</option><option>A-</option>
                    <option>B+</option><option>B-</option>
                    <option>O+</option><option>O-</option>
                    <option>AB+</option><option>AB-</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-4 text-left">
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <span className="material-icons text-primary text-sm">location_on</span>
                  Emergency Location
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">State</label>
                    <select 
                      value={selectedState}
                      onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); }}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-primary h-12 px-4 outline-none transition-all text-slate-600"
                      required
                    >
                      <option value="">Select State</option>
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">District</label>
                    <select 
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      disabled={!selectedState}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-primary h-12 px-4 outline-none transition-all disabled:opacity-50 text-slate-600"
                      required
                    >
                      <option value="">Select District</option>
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">City</label>
                  <input 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-primary h-12 px-4 outline-none transition-all placeholder:text-slate-400" 
                    placeholder="Enter City Name" type="text" required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Hospital / Detailed Address</label>
                  <input 
                    value={patientData.location}
                    onChange={(e) => setPatientData({...patientData, location: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-primary h-12 px-4 outline-none transition-all placeholder:text-slate-400" 
                    placeholder="Specific hospital or area" type="text" required 
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  disabled={isBroadcasting}
                  className="w-full bg-primary hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 active:scale-95" 
                  type="submit"
                >
                  {isBroadcasting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full mr-2"></div>
                      Broadcasting Alert...
                    </>
                  ) : (
                    "Broadcast Emergency Request"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Active Emergency Requests - UI Fixed per Screenshots */}
          {myRequests.length > 0 && (
            <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm text-left">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
                <div className="bg-red-50 dark:bg-red-900/10 w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="material-icons text-primary text-xl">history</span>
                </div>
                Active Emergency Requests
              </h3>
              <div className="space-y-5">
                {myRequests.map((req) => (
                  <div key={req.id} className="p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-[1.5rem] border border-slate-100/50 dark:border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all">
                    <div className="flex items-center gap-6 text-left w-full sm:w-auto">
                      <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-primary font-black text-2xl shrink-0 shadow-sm">
                        {req.bloodGroup}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-1">{req.patientName}</p>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.15em] leading-none mb-1">
                          {req.city ? `${req.city.toUpperCase()}, ` : ''}{req.district.toUpperCase()}, {req.state.toUpperCase()}
                        </p>
                        <p className="text-[11px] text-primary font-bold leading-none">
                          {new Date(req.timestamp).toLocaleDateString('en-US')}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCancelRequest(req.id)}
                      className="w-full sm:w-auto px-8 py-3 bg-[#eef2f6] dark:bg-slate-800 text-[#475569] dark:text-slate-300 rounded-full text-xs font-black hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition-all active:scale-95 shadow-sm"
                    >
                      Cancel Request
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-[2rem] p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                <div className="relative w-16 h-16 bg-primary flex items-center justify-center rounded-full text-white shadow-xl">
                  <span className="material-icons text-3xl">radar</span>
                </div>
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-lg mb-1">Live Broadcast Active</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  When you broadcast, your request immediately appears on the <span className="text-primary font-bold uppercase tracking-wider">Live Alert Bar</span> of every verified donor in <span className="font-bold tracking-tight">{selectedDistrict || 'your area'}</span>.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 text-white p-8 rounded-[2rem] relative overflow-hidden shadow-2xl">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-primary mb-4">
                <span className="material-icons text-xl">verified_user</span>
                <span className="text-xs font-black uppercase tracking-widest">Safe Donor Network</span>
              </div>
              <h4 className="text-xl font-black mb-4 font-display">India Blood Connect Safety</h4>
              <ul className="space-y-4">
                {[
                  'Instant location-based donor matching',
                  'Verified identities for every user',
                  'Strict no-commercialization policy',
                  '24/7 dedicated emergency support'
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="material-icons text-primary text-sm">check_circle</span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestBlood;
