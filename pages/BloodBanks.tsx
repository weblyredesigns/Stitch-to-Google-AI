import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_BANKS } from '../constants';
import { BloodGroup, BloodBank } from '../types';

const BloodBanks: React.FC = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [bloodFilter, setBloodFilter] = useState<string>('All');
  const [triggerSearch, setTriggerSearch] = useState(0);
  const [allBanks, setAllBanks] = useState<BloodBank[]>([]);

  useEffect(() => {
    const loadBanks = () => {
      const registeredBanks = JSON.parse(localStorage.getItem('indiaBloodConnect_all_banks') || '[]');
      // Cast MOCK_BANKS to include role if missing for consistency
      const mockWithRoles = MOCK_BANKS.map(b => ({ ...b, role: 'bank' as const }));
      setAllBanks([...mockWithRoles, ...registeredBanks]);
    };
    loadBanks();
    window.addEventListener('storage', loadBanks);
    return () => window.removeEventListener('storage', loadBanks);
  }, []);

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const filteredBanks = useMemo(() => {
    return allBanks.filter(bank => {
      const searchStr = searchLocation.toLowerCase();
      const locationMatch = !searchLocation || 
                           bank.address.toLowerCase().includes(searchStr) || 
                           bank.name.toLowerCase().includes(searchStr) ||
                           bank.city?.toLowerCase().includes(searchStr) ||
                           bank.district?.toLowerCase().includes(searchStr);
      
      let stockMatch = true;
      if (bloodFilter !== 'All') {
        const group = bloodFilter as BloodGroup;
        stockMatch = bank.stock[group] === 'HIGH' || bank.stock[group] === 'MED';
      }

      return locationMatch && stockMatch;
    });
  }, [triggerSearch, searchLocation === '' && bloodFilter === 'All' ? searchLocation : null, allBanks]);

  const handleSearch = () => {
    setTriggerSearch(prev => prev + 1);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <header className="pt-12 pb-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 font-display">Blood Bank Directory & Stock Status</h1>
            <p className="text-slate-500 dark:text-slate-400">Find verified blood banks and real-time stock availability across India.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 relative">
                <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none">location_on</span>
                <input 
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary h-14 outline-none transition-all placeholder:text-slate-400 font-medium" 
                  placeholder="Search City, Area or Zip Code" 
                  type="text" 
                />
              </div>
              <div className="md:col-span-4 relative">
                <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none">bloodtype</span>
                <select 
                  value={bloodFilter}
                  onChange={(e) => setBloodFilter(e.target.value)}
                  className="w-full pl-14 pr-10 py-3 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary h-14 outline-none transition-all text-slate-600 dark:text-slate-300 font-medium appearance-none cursor-pointer"
                >
                  <option value="All">Filter by Stock (All Groups)</option>
                  {bloodGroups.map(bg => (
                    <option key={bg} value={bg}>{bg} Available</option>
                  ))}
                </select>
                <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
              <div className="md:col-span-3">
                <button 
                  onClick={handleSearch}
                  className="w-full h-14 bg-primary text-white font-black rounded-xl hover:bg-red-700 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  <span className="material-icons">search</span>
                  Search Directory
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredBanks.length > 0 ? (
          <div className="flex flex-col gap-6">
            {filteredBanks.map((bank) => (
              <div key={bank.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                  <div className="lg:col-span-5">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{bank.name}</h3>
                          {bank.verified && <span className="material-icons text-blue-500 text-sm">verified</span>}
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm flex items-start gap-1">
                          <span className="material-icons text-base mt-0.5 text-primary">location_on</span>
                          <span className="leading-relaxed">{bank.address}</span>
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Contact</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <span className="material-icons text-primary text-base">call</span>
                          {bank.phone}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Hours</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <span className="material-icons text-primary text-base">schedule</span>
                          {bank.hours}
                        </p>
                      </div>
                    </div>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bank.name + ' ' + bank.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full md:w-auto px-8 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <span className="material-icons text-xl">directions</span>
                      Get Directions
                    </a>
                  </div>
                  
                  <div className="lg:col-span-7">
                    <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-[1.5rem] border border-slate-100/50 dark:border-slate-700/50 h-full flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-5">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Live Stock Inventory</h4>
                        <span className="flex items-center gap-1.5 text-[10px] text-green-600 font-black bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Updated Real-time
                        </span>
                      </div>
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                        {(Object.entries(bank.stock) as [BloodGroup, string][]).map(([group, level]) => (
                          <div key={group} className={`flex flex-col items-center justify-center py-3 rounded-2xl border transition-all ${
                            level === 'HIGH' ? 'bg-green-50/50 text-green-700 border-green-100' :
                            level === 'MED' ? 'bg-yellow-50/50 text-yellow-700 border-yellow-100' :
                            'bg-red-50/50 text-red-700 border-red-100'
                          } ${bloodFilter === group ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                            <span className="text-sm font-black mb-0.5">{group}</span>
                            <span className="text-[9px] font-black uppercase tracking-tighter opacity-70">{level}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-20 border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
            <span className="material-icons text-6xl text-slate-300 mb-6">search_off</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">No Blood Banks Found</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Try adjusting your search location or blood group filter.</p>
            <button 
              onClick={() => { setSearchLocation(''); setBloodFilter('All'); }}
              className="mt-8 px-8 py-3 bg-primary text-white font-bold rounded-xl active:scale-95 transition-all shadow-md"
            >
              Reset Search
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default BloodBanks;