import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { INDIAN_STATES_DISTRICTS } from '../data/locations';
import { BloodGroup } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | ''>('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      const userStr = localStorage.getItem('indiaBloodConnect_user');
      setIsLoggedIn(!!userStr);
    };
    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

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
    <div className="relative overflow-hidden bg-white dark:bg-background-dark">
      {/* Hero Section */}
      <header className="relative pt-16 pb-20 md:pt-28 md:pb-32 lg:pt-40 lg:pb-44 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(236,19,19,0.05)_0%,_transparent_70%)]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white mb-8 leading-[0.95] animate-fade-in-up">
              Your Blood Can <br />
              <span className="text-primary italic font-serif">Save a Life</span> Today
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-in-up delay-100">
              India's most trusted real-time platform connecting donors and recipients instantly. Secure, verified, and always free.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5 mb-24 animate-fade-in-up delay-200">
              <Link 
                to={isLoggedIn ? "/camps" : "/register"} 
                className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-[1.5rem] font-black text-lg shadow-2xl shadow-primary/30 hover:bg-red-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <span className="material-icons text-2xl">favorite</span>
                I Want to Donate
              </Link>
              <Link 
                to="/request" 
                className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-slate-800 text-primary border-2 border-primary/10 rounded-[1.5rem] font-black text-lg hover:border-primary hover:bg-primary/5 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <span className="material-icons text-2xl">emergency</span>
                I Need Blood
              </Link>
            </div>
          </div>

          {/* Search Bar - Refined to match image labels */}
          <div className="max-w-6xl mx-auto px-2 animate-scale-in delay-300">
            <div className="bg-white dark:bg-slate-900 p-2 rounded-[2.5rem] md:rounded-[4rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-800">
              <div className="flex flex-col lg:flex-row items-center">
                
                {/* Search Fields Area */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-0 w-full">
                  
                  {/* Blood Group */}
                  <div className="p-6 md:p-8 md:border-r border-slate-100 dark:border-slate-800">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 text-left pl-1">Blood Group</label>
                    <select 
                      value={selectedGroup}
                      onChange={(e) => setSelectedGroup(e.target.value as BloodGroup)}
                      className="w-full bg-transparent border-none text-xl font-black focus:ring-0 outline-none p-0 cursor-pointer text-slate-900 dark:text-white appearance-none"
                    >
                      <option value="">Select Group</option>
                      <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                      <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                    </select>
                  </div>

                  {/* State */}
                  <div className="p-6 md:p-8 md:border-r border-slate-100 dark:border-slate-800">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 text-left pl-1">State</label>
                    <select 
                      value={selectedState}
                      onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); }}
                      className="w-full bg-transparent border-none text-xl font-black focus:ring-0 outline-none p-0 cursor-pointer text-slate-900 dark:text-white appearance-none"
                    >
                      <option value="">Select State</option>
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* District */}
                  <div className="p-6 md:p-8">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 text-left pl-1">District</label>
                    <select 
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      disabled={!selectedState}
                      className="w-full bg-transparent border-none text-xl font-black focus:ring-0 outline-none p-0 cursor-pointer text-slate-900 dark:text-white appearance-none disabled:opacity-30"
                    >
                      <option value="">Select District</option>
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                </div>

                {/* Submit Button */}
                <div className="p-4 md:p-6 w-full lg:w-auto">
                  <button 
                    onClick={handleQuickSearch}
                    className="w-full lg:w-20 h-20 bg-primary text-white rounded-[2rem] md:rounded-[3rem] hover:bg-red-700 hover:scale-105 transition-all flex items-center justify-center shadow-xl shadow-primary/30 active:scale-95"
                  >
                    <span className="material-icons text-3xl">search</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-2">
              <span className="material-icons text-primary text-lg">person_search</span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Find Donors Near You</p>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Verified Donors', val: '50k+', icon: 'verified' },
            { label: 'Lives Impacted', val: '12k+', icon: 'volunteer_activism' },
            { label: 'Blood Banks', val: '800+', icon: 'local_hospital' },
            { label: 'Districts', val: '700+', icon: 'map' }
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm mb-4 text-primary group-hover:scale-110 transition-transform">
                <span className="material-icons text-xl">{stat.icon}</span>
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter">{stat.val}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">Simple Steps to Save Life</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">We've simplified the blood donation process to make it as quick as possible during emergencies.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { title: 'Register Account', icon: 'person_add', desc: 'Join our verified donor network in under 60 seconds.' },
              { title: 'Live Alerts', icon: 'notifications_active', desc: 'Get real-time emergency broadcast notifications near you.' },
              { title: 'Visit & Donate', icon: 'water_drop', desc: 'Visit the hospital or camp and complete your life-saving contribution.' }
            ].map((step, idx) => (
              <div key={idx} className="relative text-center group">
                {idx < 2 && <div className="hidden lg:block absolute top-12 left-[calc(50%+4rem)] w-[calc(100%-8rem)] border-t-2 border-dashed border-slate-100 dark:border-slate-800"></div>}
                <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 group-hover:bg-primary group-hover:text-white group-hover:rotate-6 transition-all duration-500">
                  <span className="material-icons text-4xl">{step.icon}</span>
                </div>
                <h3 className="text-xl font-black mb-4 text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 skew-x-12 translate-x-1/2"></div>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-12 leading-tight tracking-tighter">Ready to be someone's hero?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/register" className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-black text-lg hover:bg-primary hover:text-white transition-all active:scale-95">
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;