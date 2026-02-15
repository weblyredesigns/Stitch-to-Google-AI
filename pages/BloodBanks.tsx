
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
  }, [triggerSearch, searchLocation, bloodFilter, allBanks]);

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
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Location Input - Fixed padding to prevent overlap */}
              <div className="md:col-span-5 relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 z-10 pointer-events-none">
                  <span className="material-icons text-slate-400 group-focus-within:text-primary transition-colors">location_on</span>
                </div>
                <input 
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary/20 focus:bg-white dark:focus:bg-slate-950 rounded-2xl h-16 outline-none transition-all placeholder:text-slate-400 font-bold text-slate-700 dark:text-slate-200" 
                  placeholder="City, Area or Zip Code" 
                  type="text" 
                />
              </div>

              {/* Blood Filter Select - Fixed padding to prevent overlap */}
              <div className="md:col-span-4 relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 z-10 pointer-events-none">
                  <span className="material-icons text-slate-400 group-focus-within:text-primary transition-colors">bloodtype</span>
                </div>
                <select 
                  value={bloodFilter}
                  onChange={(e) => setBloodFilter(e.target.value)}
                  className="w-full pl-14 pr-10 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary/20 focus:bg-white dark:focus:bg-slate-950 rounded-2xl h-16 appearance-none outline-none transition-all font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <option value="All">All Blood Groups</option>
                  {bloodGroups.map(g => <option key={g} value={g}>{g} Available</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="material-icons text-slate-400">expand_more</span>
                </div>
              </div>

              {/* Search Button */}
              <div className="md:col-span-3">
                <button 
                  onClick={handleSearch}
                  className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-icons">search</span>
                  Search Banks
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          {filteredBanks.map((bank) => (
            <div key={bank.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white truncate">{bank.name}</h3>
                    {bank.verified && <span className="material-icons text-blue-500 text-sm">verified</span>}
                  </div>
                  <div className="flex items-start gap-2 text-slate-500 text-sm">
                    <span className="material-icons text-lg mt-0.5 shrink-0">location_on</span>
                    <p className="leading-relaxed">{bank.address}</p>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-2xl shrink-0 text-center border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hours</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{bank.hours}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-8">
                {bloodGroups.map((group) => (
                  <div key={group} className="flex flex-col items-center">
                    <div className={`w-full aspect-square rounded-xl flex items-center justify-center mb-1 text-xs font-black transition-all ${
                      bank.stock[group] === 'HIGH' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      bank.stock[group] === 'MED' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {group}
                    </div>
                    <span className="text-[8px] font-black text-slate-400 uppercase">{bank.stock[group]}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-50 dark:border-slate-800">
                <a 
                  href={`tel:${bank.phone}`} 
                  className="flex-1 h-14 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg"
                >
                  <span className="material-icons text-lg">call</span>
                  Call Now
                </a>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bank.name + ' ' + bank.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 h-14 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
                >
                  <span className="material-icons text-lg">directions</span>
                  Directions
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredBanks.length === 0 && (
          <div className="py-24 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
            <span className="material-icons text-6xl text-slate-300 mb-6">local_hospital</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No Blood Banks Found</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Try searching in a different city or broaden your search criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BloodBanks;
