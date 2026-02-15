import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { INDIAN_STATES_DISTRICTS } from '../data/locations';
import { BloodGroup } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | ''>('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const states = Object.keys(INDIAN_STATES_DISTRICTS).sort();
  const districts = selectedState ? INDIAN_STATES_DISTRICTS[selectedState].sort() : [];

  const handleQuickSearch = () => {
    const params = new URLSearchParams();
    if (selectedGroup) params.append('group', selectedGroup);
    if (selectedState) params.append('state', selectedState);
    if (selectedDistrict) params.append('district', selectedDistrict);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <header className="relative pt-12 pb-16 md:pt-20 md:pb-28 lg:pt-36 lg:pb-48 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"></div>
          <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl opacity-50"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-black tracking-wider uppercase mb-8 border border-primary/20 animate-fade-in-up">
              Every Drop Counts • Nationwide Network
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1] animate-fade-in-up delay-100">
              Your Blood Can <br className="hidden sm:block"/> <span className="text-primary italic">Save a Life</span> Today
            </h1>
            <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              India's most trusted real-time platform connecting donors and recipients instantly. Secure, verified, and always free.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-20 animate-fade-in-up delay-300">
              <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:bg-red-700 hover:shadow-primary/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95">
                <span className="material-icons">volunteer_activism</span>
                I Want to Donate
              </Link>
              <Link to="/request" className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-slate-800 text-primary border-2 border-primary/20 rounded-2xl font-black text-lg hover:border-primary hover:bg-primary/5 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95">
                <span className="material-icons">emergency</span>
                I Need Blood
              </Link>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="max-w-5xl mx-auto px-2 animate-scale-in delay-500">
            <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[3rem] shadow-2xl shadow-primary/10 border border-primary/5">
              <div className="mb-8 flex items-center justify-center gap-3">
                <span className="material-icons text-primary text-2xl">person_search</span>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Find Donors Near You</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-end text-left">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Blood Group</label>
                  <select 
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value as BloodGroup)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary h-14 text-sm font-bold outline-none"
                  >
                    <option value="">Select Group</option>
                    <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                    <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">State</label>
                  <select 
                    value={selectedState}
                    onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary h-14 text-sm font-bold outline-none"
                  >
                    <option value="">Select State</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">District</label>
                  <select 
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={!selectedState}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary h-14 text-sm font-bold disabled:opacity-50 outline-none"
                  >
                    <option value="">Select District</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <button 
                  onClick={handleQuickSearch}
                  className="w-full h-14 bg-primary text-white font-black rounded-2xl hover:bg-red-700 hover:shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-95 shadow-md"
                >
                  <span className="material-icons text-xl group-hover:scale-110 transition-transform">search</span>
                  Search Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Trust Badges */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900/30">
         <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-8 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all">
            <span className="text-xl font-black tracking-widest uppercase">Verified Donors</span>
            <span className="text-xl font-black tracking-widest uppercase">Live Alerts</span>
            <span className="text-xl font-black tracking-widest uppercase">24/7 Support</span>
            <span className="text-xl font-black tracking-widest uppercase">Nationwide</span>
         </div>
      </section>

      {/* How It Works */}
      <section className="py-24 md:py-36 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 dark:text-white">Connecting Lives</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-8"></div>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">Our streamlined process connects you with help in minutes, not hours.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            {[
              { title: '1. Register', icon: 'person_add_alt_1', desc: 'Securely register as a donor or request blood in seconds. Your data is encrypted and safe.' },
              { title: '2. Broadcast', icon: 'rss_feed', desc: 'Priority alerts are instantly sent to verified donors in your exact district and state.' },
              { title: '3. Act Fast', icon: 'flash_on', desc: 'Connect directly via call or WhatsApp. Every second matters during an emergency.' }
            ].map((step, idx) => (
              <div key={idx} className="group text-center">
                <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:bg-primary group-hover:text-white group-hover:rotate-6 transition-all duration-500">
                  <span className="material-icons text-5xl group-hover:scale-110 transition-transform">{step.icon}</span>
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-primary relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-6xl font-black mb-10 leading-tight">Join the Nationwide Life-Saving Revolution</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/register" className="bg-white text-primary px-12 py-5 rounded-2xl font-black text-xl hover:bg-slate-100 transition-all active:scale-95 shadow-2xl">
              Register as Donor
            </Link>
            <div className="flex items-center justify-center gap-4 text-white/80">
               <span className="material-icons text-3xl">verified</span>
               <span className="text-sm font-bold uppercase tracking-widest">50,000+ Verified Donors</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;