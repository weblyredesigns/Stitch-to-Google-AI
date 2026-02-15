
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
      <header className="relative pt-8 pb-16 md:pt-12 md:pb-20 lg:pt-28 lg:pb-36 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"></div>
          <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl opacity-50"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-6 border border-primary/20">
              Verified Nationwide Donor Network
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 md:mb-8 leading-[1.2] md:leading-[1.1]">
              Connecting Blood Donors <br className="hidden sm:block"/> Across India <span className="text-primary inline-block hover:scale-110 transition-transform cursor-default">❤️</span>
            </h1>
            <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
              A secure and rapid platform to find life-saving blood donors in your city. Join thousands of heroes today and help save a life.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-12 md:mb-16">
              <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:bg-red-700 hover:shadow-primary/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95">
                <span className="material-icons">volunteer_activism</span>
                <span>I Want to Donate</span>
              </Link>
              <Link to="/request" className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-slate-800 text-primary border-2 border-primary/20 rounded-xl font-bold text-lg hover:border-primary hover:bg-primary/5 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95">
                <span className="material-icons">emergency</span>
                <span>I Need Blood</span>
              </Link>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="max-w-5xl mx-auto px-2">
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-2xl shadow-primary/10 border border-primary/5">
              <div className="mb-6 flex items-center gap-2">
                <span className="material-icons text-primary text-xl">search</span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Quick Donor Search</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-end text-left">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Blood Group</label>
                  <select 
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value as BloodGroup)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all h-12 text-sm font-medium outline-none"
                  >
                    <option value="">Select Group</option>
                    <option>A+</option><option>A-</option>
                    <option>B+</option><option>B-</option>
                    <option>O+</option><option>O-</option>
                    <option>AB+</option><option>AB-</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">State</label>
                  <select 
                    value={selectedState}
                    onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all h-12 text-sm font-medium outline-none"
                  >
                    <option value="">Select State</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">District</label>
                  <select 
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={!selectedState}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all h-12 text-sm font-medium disabled:opacity-50 outline-none"
                  >
                    <option value="">Select District</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <button 
                  onClick={handleQuickSearch}
                  className="w-full h-12 bg-primary text-white font-bold rounded-xl hover:bg-red-700 hover:shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-95 shadow-md"
                >
                  <span className="material-icons text-xl group-hover:scale-110 transition-transform">person_search</span>
                  Search Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Saving lives is just a few clicks away. Our streamlined process connects donors and recipients instantly.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 lg:gap-20">
            {[
              { title: '1. Register', icon: 'person_add_alt_1', desc: 'Create your secure profile as a donor or request blood by providing essential medical details.' },
              { title: '2. Connect', icon: 'location_searching', desc: 'Our smart matching system finds the nearest available donors or verified blood banks in real-time.' },
              { title: '3. Save Lives', icon: 'favorite', desc: 'Coordinate via our secure messaging system and complete the life-saving donation process.' }
            ].map((step, idx) => (
              <div key={idx} className="group text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 group-hover:bg-primary group-hover:text-white group-hover:shadow-2xl group-hover:shadow-primary/30 transition-all duration-500 rotate-3 group-hover:rotate-0">
                  <span className="material-icons text-4xl sm:text-5xl group-hover:scale-110 transition-transform">{step.icon}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed px-4 text-sm sm:text-base">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-10 -top-10 w-48 h-48 md:w-64 md:h-64 border-4 border-white rounded-full"></div>
          <div className="absolute -right-20 -bottom-20 w-72 h-72 md:w-96 md:h-96 border-4 border-white rounded-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-white text-center">
            {[
              { val: '50K+', label: 'Active Donors' },
              { val: '28', label: 'States Covered' },
              { val: '120K+', label: 'Lives Impacted' },
              { val: '95%', label: 'Success Rate' }
            ].map((stat, idx) => (
              <div key={idx} className="group">
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 group-hover:scale-110 transition-transform">{stat.val}</div>
                <div className="text-[10px] md:text-xs font-bold opacity-90 uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Support Section */}
      <section className="py-16 md:py-24 px-4 sm:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 dark:bg-slate-800 rounded-[2rem] overflow-hidden relative shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
              <div className="p-8 sm:p-12 lg:p-20 relative z-10 text-left">
                <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 md:mb-8 leading-tight">Real-time Emergency Support</h2>
                <p className="text-slate-400 text-base md:text-lg mb-8 md:mb-10 leading-relaxed">
                  In an emergency, every second counts. Our platform ensures that donor requests are broadcasted immediately to matched donors nearby, ensuring a response within minutes.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {[
                    { icon: 'verified', label: 'Verified Records' },
                    { icon: 'security', label: 'Secure & Private' },
                    { icon: 'location_on', label: 'Geo-Targeting' },
                    { icon: 'history', label: '24/7 Support' }
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-white group">
                      <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary transition-colors shrink-0">
                        <span className="material-icons text-primary group-hover:text-white">{feat.icon}</span>
                      </div>
                      <span className="font-semibold text-sm sm:text-base">{feat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-64 sm:h-80 lg:h-full min-h-[400px]">
                <img 
                  alt="Healthcare professional" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 lg:opacity-70" 
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop" 
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
