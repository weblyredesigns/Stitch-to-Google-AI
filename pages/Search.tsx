
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MOCK_DONORS } from '../constants';
import { BloodGroup, Donor } from '../types';
import { INDIAN_STATES_DISTRICTS } from '../data/locations';

const Search: React.FC = () => {
  const location = useLocation();
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | ''>('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [allDonors, setAllDonors] = useState<Donor[]>([]);
  
  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const states = Object.keys(INDIAN_STATES_DISTRICTS).sort();
  const districts = selectedState ? INDIAN_STATES_DISTRICTS[selectedState].sort() : [];

  // Init from URL and Storage
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const groupParam = searchParams.get('group') as BloodGroup;
    const stateParam = searchParams.get('state');
    const districtParam = searchParams.get('district');

    if (groupParam) setSelectedGroup(groupParam);
    if (stateParam) setSelectedState(stateParam);
    if (districtParam) setSelectedDistrict(districtParam);

    const loadDonors = () => {
      const registeredDonors = JSON.parse(localStorage.getItem('indiaBloodConnect_all_donors') || '[]');
      setAllDonors([...MOCK_DONORS, ...registeredDonors]);
    };

    loadDonors();
    window.addEventListener('storage', loadDonors);
    return () => window.removeEventListener('storage', loadDonors);
  }, [location.search]);

  const filteredDonors = useMemo(() => {
    return allDonors.filter(donor => {
      const groupMatch = !selectedGroup || donor.bloodGroup === selectedGroup;
      const stateMatch = !selectedState || donor.state === selectedState;
      const districtMatch = !selectedDistrict || donor.district === selectedDistrict;
      const cityMatch = !searchCity || 
        donor.city?.toLowerCase().includes(searchCity.toLowerCase()) || 
        donor.location.toLowerCase().includes(searchCity.toLowerCase());
      
      return groupMatch && stateMatch && districtMatch && cityMatch;
    });
  }, [selectedGroup, selectedState, selectedDistrict, searchCity, allDonors]);

  const resetFilters = () => {
    setSelectedGroup('');
    setSelectedState('');
    setSelectedDistrict('');
    setSearchCity('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white dark:bg-slate-900/50 p-6 sm:p-8 rounded-3xl border border-primary/10 shadow-sm text-left">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="material-icons text-primary">filter_list</span>
                <h2 className="text-xl font-bold">Filters</h2>
              </div>
              <button onClick={resetFilters} className="text-xs font-bold text-primary hover:underline lg:hidden">Reset All</button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">Blood Group</label>
                <div className="grid grid-cols-4 lg:grid-cols-2 gap-2">
                  {bloodGroups.map((group) => (
                    <button
                      key={group}
                      onClick={() => setSelectedGroup(group)}
                      className={`h-10 sm:h-12 text-sm font-bold rounded-xl border-2 transition-all ${
                        selectedGroup === group ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/20'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-1.5 uppercase tracking-wider">State</label>
                  <select value={selectedState} onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); }} className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium">
                    <option value="">All India</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-1.5 uppercase tracking-wider">District</label>
                  <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={!selectedState} className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 font-medium">
                    <option value="">All Districts</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-1.5 uppercase tracking-wider">City / Area</label>
                  <input value={searchCity} onChange={(e) => setSearchCity(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" placeholder="Search City" type="text" />
                </div>
              </div>
              <button onClick={resetFilters} className="hidden lg:block w-full py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors text-sm uppercase tracking-widest">Clear Filters</button>
            </div>
          </div>
        </aside>

        {/* Main Donor List */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 text-left">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {selectedDistrict ? `Donors in ${selectedDistrict}` : selectedState ? `Donors in ${selectedState}` : 'Verified Donors Across India'}
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Found {filteredDonors.length} matches {selectedGroup && `for ${selectedGroup}`}
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-400 uppercase">Sort:</span>
              <select className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs py-2 px-3 outline-none focus:ring-1 focus:ring-primary flex-1 sm:flex-none">
                <option>Nearest First</option>
                <option>Recently Active</option>
              </select>
            </div>
          </div>

          {filteredDonors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {filteredDonors.map((donor) => (
                <div key={donor.id} className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all text-left relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-primary/5 rounded-bl-[100px] -mr-8 -mt-8 transition-all group-hover:scale-110"></div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4">
                      <div className="relative shrink-0">
                        <img alt={donor.name} className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl object-cover ring-4 ring-slate-50 dark:ring-slate-800 shadow-sm" src={donor.imageUrl} />
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full"></span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg sm:text-xl font-black truncate">{donor.name}</h3>
                        <div className="flex items-center text-slate-500 text-xs mt-1">
                          <span className="material-icons text-sm mr-1 shrink-0">location_on</span>
                          <span className="truncate">{donor.location}</span>
                        </div>
                        <div className="flex items-center text-primary text-[10px] font-black mt-2 uppercase tracking-widest">
                          <span className="material-icons text-xs mr-1">{donor.elite ? 'stars' : 'verified_user'}</span>
                          {donor.elite ? 'Elite Donor' : 'Verified'}
                        </div>
                      </div>
                    </div>
                    <div className="bg-primary/10 text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl shrink-0">
                      <span className="text-xl sm:text-2xl font-black">{donor.bloodGroup}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 relative z-10">
                    <a 
                      href={`tel:+91${donor.mobile}`}
                      className="flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-2xl font-black text-sm active:scale-95 shadow-lg shadow-primary/20 transition-all hover:bg-red-700"
                    >
                      <span className="material-icons text-xl">call</span>
                      Call
                    </a>
                    <a 
                      href={`https://wa.me/91${donor.mobile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white rounded-2xl font-black text-sm active:scale-95 shadow-lg shadow-emerald-500/20 transition-all hover:bg-[#20ba5a]"
                    >
                      <span className="material-icons text-xl">chat</span>
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-12 sm:p-20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
              <span className="material-icons text-4xl text-slate-400 mb-6">search_off</span>
              <h3 className="text-2xl font-bold mb-2">No Donors Found</h3>
              <p className="text-slate-500 max-w-sm">Try expanding your search area or checking other blood groups.</p>
              <button onClick={resetFilters} className="mt-8 px-8 py-3 bg-primary text-white font-bold rounded-xl active:scale-95 transition-all shadow-md">Clear All Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
