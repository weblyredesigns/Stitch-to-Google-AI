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
      if (userStr) {
        const user = JSON.parse(userStr);
        const filtered = allRequests.filter(req => req.contactMobile === user.mobile);
        setMyRequests(filtered);
      } else {
        setMyRequests(allRequests);
      }
    } catch (e) {
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
      
      setPatientData({ name: '', bloodGroup: '' as BloodGroup, location: '' });
      setSelectedState('');
      setSelectedDistrict('');
      setCity('');
    }, 1500);
  };

  const handleCancelRequest = (requestId: string) => {
    if (window.confirm("Confirm cancellation? This will remove the live alert for donors.")) {
      const allRequestsStr = localStorage.getItem('indiaBloodConnect_requests');
      if (allRequestsStr) {
        try {
          const allRequests: BloodRequest[] = JSON.parse(allRequestsStr);
          const updatedRequests = allRequests.filter(req => req.id !== requestId);
          localStorage.setItem('indiaBloodConnect_requests', JSON.stringify(updatedRequests));
          setMyRequests(prev => prev.filter(req => req.id !== requestId));
          window.dispatchEvent(new Event('storage'));
        } catch (e) {
          console.error("Cancellation failed", e);
        }
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Toast Notification */}
      <div className={`fixed top-24 right-4 z-50 transition-all duration-500 transform ${showSuccess ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0 pointer-events-none'}`}>
        <div className="bg-emerald-600 text-white px-6 py-5 rounded-2xl shadow-2xl flex items-center gap-4 border-l-8 border-emerald-400">
          <span className="material-icons text-3xl">check_circle</span>
          <div className="text-left">
            <p className="font-black text-sm uppercase tracking-widest">Broadcast Live!</p>
            <p className="text-xs opacity-90">Priority alerts sent to all nearby donors.</p>
          </div>
        </div>
      </div>

      <div className="mb-12 text-left animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Request Support</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Broadcast a priority emergency request to the verified donor network.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
        <div className="lg:col-span-7 space-y-12">
          {/* Main Form Card */}
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 animate-fade-in-up delay-100">
            <form className="space-y-8" onSubmit={handleBroadcast}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient Name</label>
                  <input 
                    value={patientData.name}
                    onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-primary h-14 px-5 text-lg font-bold outline-none transition-all" 
                    placeholder="Full Patient Name" type="text" required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Blood Group</label>
                  <select 
                    value={patientData.bloodGroup}
                    onChange={(e) => setPatientData({...patientData, bloodGroup: e.target.value as BloodGroup})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-primary h-14 px-5 font-black text-lg outline-none transition-all" required
                  >
                    <option value="">Select Group</option>
                    <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                    <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                   <span className="material-icons text-primary">location_on</span>
                   <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Emergency Location Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">State</label>
                    <select 
                      value={selectedState}
                      onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); }}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-primary h-14 px-5 font-bold outline-none transition-all"
                      required
                    >
                      <option value="">Select State</option>
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">District</label>
                    <select 
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      disabled={!selectedState}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-primary h-14 px-5 font-bold outline-none transition-all disabled:opacity-50"
                      required
                    >
                      <option value="">Select District</option>
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City / Town</label>
                  <input 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-primary h-14 px-5 font-bold outline-none transition-all" 
                    placeholder="Enter city or area" type="text" required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Hospital Name / Floor</label>
                  <input 
                    value={patientData.location}
                    onChange={(e) => setPatientData({...patientData, location: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-primary h-14 px-5 font-bold outline-none transition-all" 
                    placeholder="Specific hospital address" type="text" required 
                  />
                </div>
              </div>

              <div className="pt-8">
                <button 
                  disabled={isBroadcasting}
                  className="w-full bg-primary hover:bg-red-700 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3 disabled:bg-slate-200 active:scale-[0.98] text-xl" 
                  type="submit"
                >
                  {isBroadcasting ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent animate-spin rounded-full"></div>
                      Broadcasting...
                    </>
                  ) : (
                    <>
                      <span className="material-icons">rss_feed</span>
                      Broadcast Emergency Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Active Request List Section */}
          {myRequests.length > 0 && (
            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm animate-fade-in-up delay-200">
              <h3 className="text-2xl font-black mb-10 flex items-center gap-4">
                <div className="bg-red-50 dark:bg-red-900/10 w-12 h-12 rounded-full flex items-center justify-center">
                  <span className="material-icons text-primary text-2xl">history</span>
                </div>
                Manage Your Active Broadcasts
              </h3>
              <div className="space-y-6">
                {myRequests.map((req, idx) => (
                  <div key={req.id} 
                    style={{ animationDelay: `${idx * 150}ms` }}
                    className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all hover:border-primary/20 animate-fade-in-up"
                  >
                    <div className="flex items-center gap-6 w-full sm:w-auto">
                      <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-primary font-black text-2xl shrink-0 shadow-sm border border-slate-50 dark:border-slate-800">
                        {req.bloodGroup}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-slate-900 dark:text-white text-lg leading-tight mb-1">{req.patientName}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] leading-none mb-1">
                          {req.district.toUpperCase()}, {req.state.toUpperCase()}
                        </p>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest">
                          Requested: {new Date(req.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCancelRequest(req.id)}
                      className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition-all active:scale-95 shadow-sm border border-slate-100 dark:border-slate-700"
                    >
                      Cancel Alert
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="lg:col-span-5 flex flex-col gap-8 animate-slide-in-right delay-300">
          <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex flex-col sm:flex-row items-start gap-8 relative z-10">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                <div className="relative w-20 h-20 bg-primary flex items-center justify-center rounded-[1.5rem] text-white shadow-2xl shadow-primary/40">
                  <span className="material-icons text-4xl">radar</span>
                </div>
              </div>
              <div className="text-left">
                <h3 className="font-black text-slate-900 dark:text-white text-2xl mb-3 tracking-tighter">Instant Pulse Broadcast</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                  When you broadcast, your request immediately triggers the <span className="text-primary font-black">LIVE PULSE</span> bar for all verified donors in your region.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-primary mb-8">
                <span className="material-icons text-xl">verified_user</span>
                <span className="text-xs font-black uppercase tracking-[0.2em]">Safe Donor Network</span>
              </div>
              <h4 className="text-3xl font-black mb-8 leading-tight tracking-tighter">Nationwide Safety & Protocol</h4>
              <ul className="space-y-6">
                {[
                  'Real-time location matching accuracy',
                  'Encrypted patient & contact identity',
                  'Verified badge for all active donors',
                  '24/7 moderation for false alerts'
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-4 text-slate-400 group">
                    <span className="material-icons text-primary text-xl group-hover:scale-125 transition-transform">check_circle</span>
                    <span className="font-medium text-base group-hover:text-white transition-colors">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 text-center shadow-sm">
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Urgent Help?</p>
             <a href="tel:18005556666" className="text-3xl font-black text-slate-900 dark:text-white hover:text-primary transition-colors block mb-2 tracking-tighter">1800-BLOOD-HELP</a>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Toll-free nationwide support center</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestBlood;