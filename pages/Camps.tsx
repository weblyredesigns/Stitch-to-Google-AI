import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { DonationCamp } from '../types';
import { INDIAN_STATES_DISTRICTS } from '../data/locations';

const Camps: React.FC = () => {
  const navigate = useNavigate();
  const [allCamps, setAllCamps] = useState<DonationCamp[]>([]);
  const [registrations, setRegistrations] = useState<Record<string, string[]>>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [searchCity, setSearchCity] = useState('');

  const states = Object.keys(INDIAN_STATES_DISTRICTS).sort();
  const districts = selectedState ? INDIAN_STATES_DISTRICTS[selectedState].sort() : [];

  const loadData = async () => {
    setLoading(true);
    const savedUser = localStorage.getItem('indiaBloodConnect_user');
    setCurrentUser(savedUser ? JSON.parse(savedUser) : null);

    const { data: campsData } = await supabase.from('donation_camps').select('*');
    if (campsData) setAllCamps(campsData);

    const { data: regData } = await supabase.from('camp_registrations').select('*');
    if (regData) {
      const regMap: Record<string, string[]> = {};
      regData.forEach(reg => {
        if (!regMap[reg.camp_id]) regMap[reg.camp_id] = [];
        regMap[reg.camp_id].push(reg.user_id);
      });
      setRegistrations(regMap);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRegister = async (campId: string) => {
    if (!currentUser) {
      alert("Please login as a donor to register for donation camps.");
      return;
    }

    if (currentUser.role !== 'donor') {
      alert("Registration is only open to individual donors.");
      return;
    }

    const campRegs = registrations[campId] || [];
    if (campRegs.includes(currentUser.id)) {
      alert("You are already registered for this camp.");
      return;
    }

    const { error } = await supabase
      .from('camp_registrations')
      .insert([{ camp_id: campId, user_id: currentUser.id }]);

    if (error) {
      alert("Registration failed: " + error.message);
      return;
    }

    setRegistrations({
      ...registrations,
      [campId]: [...campRegs, currentUser.id]
    });
    alert("You have successfully registered for this blood donation camp!");
  };

  const getRegisteredCount = (camp: DonationCamp) => {
    const fromDB = registrations[camp.id]?.length || 0;
    return (camp.registeredCount || 0) + fromDB;
  };

  const filteredCamps = useMemo(() => {
    return allCamps.filter(camp => {
      const stateMatch = !selectedState || camp.state === selectedState;
      const districtMatch = !selectedDistrict || camp.district === selectedDistrict;
      const cityMatch = !searchCity || (camp.city && camp.city.toLowerCase().includes(searchCity.toLowerCase())) || (camp.location && camp.location.toLowerCase().includes(searchCity.toLowerCase()));
      return stateMatch && districtMatch && cityMatch;
    });
  }, [allCamps, selectedState, selectedDistrict, searchCity]);

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-4">Community Drives</span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Upcoming Blood Donation Camps</h1>
              <p className="text-slate-600 dark:text-slate-400">Join a life-saving mission near you. Find, register, and contribute to nationwide donation drives organized by certified hospitals and NGOs.</p>
            </div>
            
            <div className="w-full lg:w-auto bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">State</label>
                  <select value={selectedState} onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); }} className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl h-12 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">All States</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">District</label>
                  <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={!selectedState} className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl h-12 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50">
                    <option value="">All Districts</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">City / Keyword</label>
                  <div className="relative">
                    <input type="text" placeholder="Enter City" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl h-12 px-3 pr-10 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20" />
                    <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button onClick={() => { setSelectedState(''); setSelectedDistrict(''); setSearchCity(''); }} className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">Reset Filters</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
          </div>
        ) : filteredCamps.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
            {filteredCamps.map((camp) => {
              const isUserRegistered = currentUser && registrations[camp.id]?.includes(currentUser.id);
              return (
                <div key={camp.id} className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all flex flex-col md:flex-row">
                  <div className="relative w-full md:w-64 h-48 md:h-auto">
                    <img alt={camp.name} className="w-full h-full object-cover" src={camp.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop'} />
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold text-primary shadow-sm uppercase tracking-wider">{camp.tag}</div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-primary mb-3">
                        <span className="material-icons text-sm">calendar_today</span>
                        <span className="text-sm font-bold">{camp.date} • {camp.time}</span>
                      </div>
                      <h3 className="text-xl font-black mb-3 text-slate-900 dark:text-white leading-tight">{camp.name}</h3>
                      <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                        <span className="material-icons text-primary/40 text-lg">location_on</span>
                        <span className="text-sm font-medium">{camp.location}, {camp.city}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800 mt-6">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-700 dark:text-slate-300">+{getRegisteredCount(camp)}</div>
                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Registered</span>
                      </div>
                      {isUserRegistered ? (
                        <button className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-xl text-xs font-black flex items-center gap-2 cursor-default">
                          <span className="material-icons text-sm">check_circle</span> Registered
                        </button>
                      ) : (
                        <button onClick={() => handleRegister(camp.id)} className="bg-primary text-white px-8 py-3 rounded-xl text-xs font-black hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-primary/20">Register Now</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
             <span className="material-icons text-6xl text-slate-300 mb-4">event_busy</span>
             <h3 className="text-2xl font-black mb-2">No Camps Found</h3>
             <p className="text-slate-500">Try adjusting your filters to find more donation drives.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Camps;