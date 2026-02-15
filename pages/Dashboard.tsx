import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BloodGroup, StockLevel, DonationCamp } from '../types';
import { INDIAN_STATES_DISTRICTS } from '../data/locations';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isCampModalOpen, setIsCampModalOpen] = useState(false);
  
  const [campForm, setCampForm] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    state: '',
    district: '',
    city: '',
    tag: 'REGISTRATION OPEN' as const
  });

  const states = Object.keys(INDIAN_STATES_DISTRICTS).sort();
  const districts = campForm.state ? INDIAN_STATES_DISTRICTS[campForm.state].sort() : [];

  useEffect(() => {
    const savedUser = localStorage.getItem('indiaBloodConnect_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleUpdateStock = async (group: BloodGroup, level: StockLevel) => {
    if (!user || user.role !== 'bank') return;
    
    setLoading(true);
    const updatedStock = {
      ...user.stock,
      [group]: level
    };

    const { error } = await supabase
      .from('blood_banks')
      .update({ stock: updatedStock })
      .eq('id', user.id);

    if (error) {
      alert("Stock update failed: " + error.message);
    } else {
      const updatedUser = { ...user, stock: updatedStock };
      localStorage.setItem('indiaBloodConnect_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      window.dispatchEvent(new Event('storage'));
    }
    setLoading(false);
  };

  const handleCreateCamp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== 'bank') return;

    const newCamp = {
      id: 'CAMP-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      organizer_id: user.id,
      name: campForm.name,
      date: campForm.date,
      time: campForm.time,
      location: campForm.location,
      state: campForm.state,
      district: campForm.district,
      city: campForm.city,
      tag: campForm.tag,
      registered_count: 0,
      image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop'
    };

    const { error } = await supabase.from('donation_camps').insert([newCamp]);
    
    if (error) {
      alert("Camp creation failed: " + error.message);
      return;
    }

    setIsCampModalOpen(false);
    setCampForm({ name: '', date: '', time: '', location: '', state: '', district: '', city: '', tag: 'REGISTRATION OPEN' });
    window.dispatchEvent(new Event('storage'));
    alert("Donation camp successfully scheduled!");
  };

  if (!user) return null;

  if (user.role === 'donor') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 text-left">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Donor Dashboard</h1>
            <p className="text-slate-500 mt-1 truncate">Welcome back, {user.name.split(' ')[0]}! Ready to save another life?</p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button className="relative p-3 text-slate-500 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors">
              <span className="material-icons text-xl">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white dark:border-slate-800"></span>
            </button>
            <button onClick={() => navigate('/search')} className="flex-1 sm:flex-none bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-primary/20 active:scale-95">
              <span className="material-icons">search</span> Find Requests
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-gradient-to-br from-primary to-red-800 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden h-64 flex flex-col justify-between">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black opacity-70 uppercase tracking-widest mb-1">India Blood Connect</p>
                  <h2 className="text-2xl font-black">DONOR IDENTITY</h2>
                </div>
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md"><span className="material-icons">contactless</span></div>
              </div>
              <div className="relative z-10 flex justify-between items-end">
                <div className="flex gap-8">
                  <div><p className="text-[10px] opacity-70 uppercase font-bold">Group</p><p className="text-4xl font-black">{user.bloodGroup}</p></div>
                  <div><p className="text-[10px] opacity-70 uppercase font-bold">Holder Name</p><p className="text-xl font-bold uppercase truncate max-w-[200px]">{user.name}</p></div>
                </div>
                <div className="bg-white p-2 rounded-xl shrink-0"><span className="material-icons text-slate-300 text-4xl">qr_code_2</span></div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2"><span className="material-icons text-primary">account_circle</span> Profile Details</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {[
                  { label: 'State', value: user.state },
                  { label: 'District', value: user.district },
                  { label: 'City', value: user.city },
                  { label: 'Gender', value: user.gender || 'Not Set' },
                  { label: 'Weight', value: user.weight ? `${user.weight}kg` : 'Not Set' },
                  { label: 'Mobile', value: `+91 ${user.mobile}` }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-widest">{item.label}</p>
                    <p className="font-bold text-slate-900 dark:text-white truncate">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-4">
             <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  <span className="material-icons text-4xl">military_tech</span>
                </div>
                <h4 className="text-lg font-black uppercase tracking-tight">Verified Donor</h4>
                <p className="text-sm text-slate-500 mt-2">Your contribution helps save lives every day.</p>
                <button className="w-full py-4 mt-8 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black rounded-2xl active:scale-95 transition-all">View History</button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 text-left">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">{user.name}</h1>
            <span className="material-icons text-blue-500 text-xl">verified</span>
          </div>
          <p className="text-slate-500 font-medium">Organization Dashboard • {user.category} Category • {user.city}</p>
        </div>
        <button onClick={() => setIsCampModalOpen(true)} className="px-8 py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:bg-red-700 transition-all active:scale-95 flex items-center gap-2">
          <span className="material-icons text-sm">event</span> Host Donation Drive
        </button>
      </header>

      {isCampModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h3 className="text-xl font-black">Schedule Donation Camp</h3>
              <button onClick={() => setIsCampModalOpen(false)} className="text-slate-400 hover:text-primary transition-colors"><span className="material-icons">close</span></button>
            </div>
            <form onSubmit={handleCreateCamp} className="p-8 space-y-6 text-left">
              <div className="space-y-2"><label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Camp Name</label><input required value={campForm.name} onChange={e => setCampForm({...campForm, name: e.target.value})} className="w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-bold" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</label><input required type="date" value={campForm.date} onChange={e => setCampForm({...campForm, date: e.target.value})} className="w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-bold" /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Time</label><input required value={campForm.time} onChange={e => setCampForm({...campForm, time: e.target.value})} className="w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-bold" placeholder="09:00 AM - 05:00 PM" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-xs font-bold text-slate-400 uppercase tracking-widest">State</label>
                  <select required value={campForm.state} onChange={e => setCampForm({...campForm, state: e.target.value, district: ''})} className="w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-bold">
                    <option value="">Select State</option>{states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2"><label className="text-xs font-bold text-slate-400 uppercase tracking-widest">District</label>
                  <select required value={campForm.district} onChange={e => setCampForm({...campForm, district: e.target.value})} disabled={!campForm.state} className="w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-bold"><option value="">Select District</option>{districts.map(d => <option key={d} value={d}>{d}</option>)}</select>
                </div>
              </div>
              <div className="space-y-2"><label className="text-xs font-bold text-slate-400 uppercase tracking-widest">City</label><input required value={campForm.city} onChange={e => setCampForm({...campForm, city: e.target.value})} className="w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-bold" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Detailed Location</label><input required value={campForm.location} onChange={e => setCampForm({...campForm, location: e.target.value})} className="w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-bold" /></div>
              <button type="submit" className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-red-700 active:scale-95 transition-all uppercase tracking-widest text-xs">Schedule Drive</button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
            </div>
          )}
          <h2 className="text-2xl font-black flex items-center gap-3 mb-10"><span className="material-icons text-primary text-3xl">inventory_2</span> Inventory Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bloodGroups.map((group) => (
              <div key={group} className="p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-2xl font-black text-primary">{group}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${user.stock && user.stock[group] === 'HIGH' ? 'bg-green-100 text-green-700' : user.stock && user.stock[group] === 'MED' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>Current: {user.stock ? user.stock[group] : 'N/A'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['LOW', 'MED', 'HIGH'] as StockLevel[]).map((level) => (
                    <button key={level} onClick={() => handleUpdateStock(group, level)} className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-2 ${user.stock && user.stock[group] === level ? 'bg-primary border-primary text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'}`}>{level}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <h3 className="text-xl font-black mb-8">Facility Info</h3>
            <div className="space-y-6">
              {[
                { label: 'License No', val: user.licenseNumber || 'Verified' },
                { label: 'Category', val: user.category },
                { label: 'Service Hours', val: user.hours },
                { label: 'Admin Contact', val: `+91 ${user.mobile}` }
              ].map((item, i) => (
                <div key={i}><p className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-1">{item.label}</p><p className="font-bold">{item.val}</p></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;