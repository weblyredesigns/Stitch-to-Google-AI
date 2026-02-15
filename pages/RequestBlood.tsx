import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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

  const loadMyRequests = async () => {
    const userStr = localStorage.getItem('indiaBloodConnect_user');
    if (!userStr) return;
    
    const user = JSON.parse(userStr);
    const { data, error } = await supabase
      .from('blood_requests')
      .select('*')
      .eq('contactMobile', user.mobile);
    
    if (!error && data) {
      setMyRequests(data);
    }
  };

  useEffect(() => {
    loadMyRequests();
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    const userStr = localStorage.getItem('indiaBloodConnect_user');
    if (!userStr) {
      alert("Please login to request blood support.");
      return;
    }
    
    const user = JSON.parse(userStr);
    setIsBroadcasting(true);
    
    const newRequest = {
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

    const { error } = await supabase.from('blood_requests').insert([newRequest]);
    
    if (error) {
      alert("Broadcast failed: " + error.message);
    } else {
      setShowSuccess(true);
      loadMyRequests();
      setTimeout(() => setShowSuccess(false), 5000);
      setPatientData({ name: '', bloodGroup: '' as BloodGroup, location: '' });
      setSelectedState('');
      setSelectedDistrict('');
      setCity('');
    }
    setIsBroadcasting(false);
  };

  const handleCancelRequest = async (requestId: string) => {
    if (window.confirm("Confirm cancellation? This will remove the live alert for donors.")) {
      const { error } = await supabase
        .from('blood_requests')
        .delete()
        .eq('id', requestId);
      
      if (!error) {
        setMyRequests(prev => prev.filter(req => req.id !== requestId));
        window.dispatchEvent(new Event('storage'));
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className={`fixed top-24 right-4 z-50 transition-all duration-500 transform ${showSuccess ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0 pointer-events-none'}`}>
        <div className="bg-emerald-600 text-white px-6 py-5 rounded-2xl shadow-2xl flex items-center gap-4 border-l-8 border-emerald-400">
          <span className="material-icons text-3xl">check_circle</span>
          <div className="text-left"><p className="font-black text-sm uppercase tracking-widest">Broadcast Live!</p><p className="text-xs opacity-90">Priority alerts sent to all nearby donors.</p></div>
        </div>
      </div>

      <div className="mb-12 text-left animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Request Support</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Broadcast a priority emergency request to the verified donor network.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
        <div className="lg:col-span-7 space-y-12">
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800">
            <form className="space-y-8" onSubmit={handleBroadcast}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Name</label><input value={patientData.name} onChange={(e) => setPatientData({...patientData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl h-14 px-5 text-lg font-bold outline-none" placeholder="Full Patient Name" required /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blood Group</label><select value={patientData.bloodGroup} onChange={(e) => setPatientData({...patientData, bloodGroup: e.target.value as BloodGroup})} className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl h-14 px-5 font-black text-lg outline-none" required><option value="">Select Group</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option></select></div>
              </div>
              <div className="space-y-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">State</label>
                    <select value={selectedState} onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); }} className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl h-14 px-5 font-bold outline-none" required><option value="">Select State</option>{states.map(s => <option key={s} value={s}>{s}</option>)}</select>
                  </div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">District</label>
                    <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={!selectedState} className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl h-14 px-5 font-bold outline-none disabled:opacity-50" required><option value="">Select District</option>{districts.map(d => <option key={d} value={d}>{d}</option>)}</select>
                  </div>
                </div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">City / Town</label><input value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl h-14 px-5 font-bold outline-none" required placeholder="City name" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hospital Details</label><input value={patientData.location} onChange={(e) => setPatientData({...patientData, location: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl h-14 px-5 font-bold outline-none" required placeholder="Hospital name, area" /></div>
              </div>
              <button disabled={isBroadcasting} className="w-full bg-primary hover:bg-red-700 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-xl" type="submit">{isBroadcasting ? <><div className="w-6 h-6 border-3 border-white border-t-transparent animate-spin rounded-full"></div>Broadcasting...</> : <><span className="material-icons">rss_feed</span> Broadcast Emergency</>}</button>
            </form>
          </div>

          {myRequests.length > 0 && (
            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm animate-fade-in-up delay-200">
              <h3 className="text-2xl font-black mb-10">Manage Your Active Broadcasts</h3>
              <div className="space-y-6">
                {myRequests.map((req) => (
                  <div key={req.id} className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6 w-full sm:w-auto">
                      <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-primary font-black text-2xl shrink-0 shadow-sm">{req.bloodGroup}</div>
                      <div className="text-left">
                        <p className="font-black text-lg">{req.patientName}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{req.district}, {req.city}</p>
                      </div>
                    </div>
                    <button onClick={() => handleCancelRequest(req.id)} className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-slate-800 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-red-600 transition-all active:scale-95 shadow-sm">Cancel Alert</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="lg:col-span-5 space-y-8">
           <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
            <h4 className="text-3xl font-black mb-8 leading-tight tracking-tighter">Emergency Network</h4>
            <ul className="space-y-6">
              {['Real-time location matching accuracy', 'Verified badge for active donors', '24/7 moderation center'].map((text, i) => (
                <li key={i} className="flex items-start gap-4 text-slate-400"><span className="material-icons text-primary">check_circle</span><span>{text}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestBlood;