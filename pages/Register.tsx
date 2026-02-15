import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { INDIAN_STATES_DISTRICTS } from '../data/locations';
import { UserRole, BloodGroup, StockLevel } from '../types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('donor');
  const [step, setStep] = useState(1);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showToast, setShowToast] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: '' as BloodGroup,
    gender: '',
    state: '',
    district: '',
    city: '',
    lastDonation: 'never',
    weight: '',
    category: 'Private',
    licenseNumber: '',
    address: '',
    hours: '24/7 Available'
  });

  const states = Object.keys(INDIAN_STATES_DISTRICTS).sort();
  const districts = formData.state ? INDIAN_STATES_DISTRICTS[formData.state].sort() : [];

  const handleSendOtp = () => {
    if (mobileNumber.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setIsOtpSent(true);
      setTimer(30);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }, 1200);
  };

  useEffect(() => {
    let interval: any;
    if (timer > 0) interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpInput = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    if (val && index < 3) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || (role === 'donor' && !formData.bloodGroup)) {
        alert("Please complete the required information.");
        return;
      }
    } else if (step === 2) {
      if (!isOtpSent || otp.some(o => !o)) {
        alert("Please verify your mobile number.");
        return;
      }
      if (!formData.state || !formData.district || !formData.city) {
        alert("Please provide location details.");
        return;
      }
    }
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteRegistration = async () => {
    setIsCompleting(true);
    const userId = (role === 'donor' ? 'IBC-' : 'BB-') + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    if (role === 'donor') {
      const userData = {
        id: userId,
        role: 'donor',
        name: formData.name,
        bloodGroup: formData.bloodGroup,
        gender: formData.gender,
        state: formData.state,
        district: formData.district,
        city: formData.city,
        lastDonated: formData.lastDonation,
        weight: formData.weight,
        mobile: mobileNumber,
        location: `${formData.city}, ${formData.district}`,
        verified: true,
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/147/147144.png'
      };

      const { error } = await supabase.from('donors').insert([userData]);
      
      if (error) {
        alert("Registration failed: " + error.message);
        setIsCompleting(false);
        return;
      }

      localStorage.setItem('indiaBloodConnect_user', JSON.stringify(userData));
    } else {
      const defaultStock: Record<BloodGroup, StockLevel> = {
        'A+': 'MED', 'A-': 'LOW', 'B+': 'MED', 'B-': 'LOW',
        'O+': 'HIGH', 'O-': 'LOW', 'AB+': 'LOW', 'AB-': 'LOW'
      };

      const bankData = {
        id: userId,
        role: 'bank',
        name: formData.name,
        mobile: mobileNumber,
        phone: '+91 ' + mobileNumber,
        state: formData.state,
        district: formData.district,
        city: formData.city,
        address: formData.address || `${formData.city}, ${formData.district}, ${formData.state}`,
        hours: formData.hours,
        verified: true,
        category: formData.category,
        licenseNumber: formData.licenseNumber,
        stock: defaultStock
      };

      const { error } = await supabase.from('blood_banks').insert([bankData]);
      
      if (error) {
        alert("Registration failed: " + error.message);
        setIsCompleting(false);
        return;
      }

      localStorage.setItem('indiaBloodConnect_user', JSON.stringify(bankData));
    }
    
    setIsCompleting(false);
    window.dispatchEvent(new Event('storage'));
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className={`fixed top-24 right-4 z-50 transition-all duration-500 transform ${showToast ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0 pointer-events-none'}`}>
        <div className="bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border-l-4 border-primary">
          <span className="material-icons text-primary">sms</span>
          <div>
            <p className="font-bold text-sm text-left">SIMULATED SMS</p>
            <p className="text-xs opacity-80">Verification OTP: <span className="font-black text-primary">1 2 3 4</span></p>
          </div>
        </div>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">
          {role === 'donor' ? 'Join as a Lifesaver' : 'Register Your Organization'}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">Already registered? <Link to="/login" className="text-primary font-bold hover:underline">Login here</Link></p>
      </div>

      {step === 1 && (
        <div className="max-w-md mx-auto mb-10 bg-slate-100 dark:bg-zinc-800 p-1.5 rounded-2xl flex shadow-inner">
          <button onClick={() => setRole('donor')} className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === 'donor' ? 'bg-white dark:bg-zinc-700 shadow-lg text-primary scale-100' : 'text-zinc-400 scale-95 opacity-70'}`}>Donor Profile</button>
          <button onClick={() => setRole('bank')} className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === 'bank' ? 'bg-white dark:bg-zinc-700 shadow-lg text-primary scale-100' : 'text-zinc-400 scale-95 opacity-70'}`}>Blood Bank / Hospital</button>
        </div>
      )}

      <div className="mb-10 relative px-4">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-10"></div>
        <div className="flex justify-between items-start">
          {[{ s: 1, label: role === 'donor' ? 'Personal' : 'Org Details' }, { s: 2, label: 'Contact' }, { s: 3, label: role === 'donor' ? 'Medical' : 'License' }].map((item) => (
            <div key={item.s} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white dark:border-zinc-900 shadow-md transition-all duration-300 ${step >= item.s ? 'bg-primary text-white scale-110' : 'bg-white dark:bg-zinc-800 text-zinc-400'}`}>
                {step > item.s ? <span className="material-icons text-sm">check</span> : <span className="text-sm font-bold">{item.s}</span>}
              </div>
              <span className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${step >= item.s ? 'text-primary' : 'text-zinc-400'}`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
        <div className="bg-primary/5 px-8 py-6 border-b border-primary/10 text-left">
          <h2 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
               <span className="material-icons text-primary leading-none">
                {step === 1 ? (role === 'donor' ? 'person' : 'apartment') : step === 2 ? 'location_on' : 'verified'}
              </span>
            </div>
            {step === 1 ? (role === 'donor' ? 'Personal Details' : 'Organization Identity') : step === 2 ? 'Contact & Location' : 'Security & Verification'}
          </h2>
        </div>

        <div className="p-8 space-y-8 text-left">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">{role === 'donor' ? 'Full Legal Name' : 'Blood Bank / Hospital Name'}</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 focus:ring-primary font-medium" placeholder={role === 'donor' ? "e.g. Rahul Sharma" : "e.g. LifeCare Blood Bank"} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {role === 'donor' ? (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Blood Group</label>
                      <select value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value as BloodGroup})} className="w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 font-medium">
                        <option value="">Select Group</option>
                        <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Gender</label>
                      <div className="flex gap-4">
                        {['Male', 'Female'].map(g => (
                          <button key={g} type="button" onClick={() => setFormData({...formData, gender: g})} className={`flex-1 h-14 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${formData.gender === g ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'border-zinc-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-zinc-400'}`}>{g}</button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Organization Category</label>
                      <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 font-medium">
                        <option>Government</option>
                        <option>Private</option>
                        <option>NGO / Charitable</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Service Hours</label>
                      <select value={formData.hours} onChange={(e) => setFormData({...formData, hours: e.target.value})} className="w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 font-medium">
                        <option>24/7 Available</option>
                        <option>09:00 AM - 09:00 PM</option>
                        <option>08:00 AM - 10:00 PM</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Admin Mobile Verification</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">+91</span>
                    <input className="w-full h-14 pl-14 pr-5 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 focus:ring-primary font-bold text-lg" maxLength={10} value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))} disabled={isOtpSent} placeholder="Mobile Number" />
                  </div>
                  <button type="button" onClick={handleSendOtp} disabled={isSendingOtp || isOtpSent || mobileNumber.length !== 10} className="px-8 h-14 bg-primary text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl disabled:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-primary/20">
                    {isOtpSent ? 'Sent' : (isSendingOtp ? '...' : 'Send OTP')}
                  </button>
                </div>
                {isOtpSent && (
                  <div className="flex gap-3 pt-2">
                    {[0, 1, 2, 3].map(i => (
                      <input key={i} id={`otp-${i}`} className="w-14 h-16 text-center text-2xl font-black border-2 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 focus:border-primary focus:bg-white transition-all outline-none" maxLength={1} value={otp[i]} onChange={(e) => handleOtpInput(i, e.target.value)} />
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2"><label className="block text-sm font-bold ml-1">State</label>
                <select value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value, district: ''})} className="w-full h-14 px-4 rounded-2xl dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 font-medium">
                  <option value="">Select State</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select></div>
                <div className="space-y-2"><label className="block text-sm font-bold ml-1">District</label>
                <select value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} disabled={!formData.state} className="w-full h-14 px-4 rounded-2xl dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 font-medium">
                  <option value="">Select District</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select></div>
                <div className="space-y-2"><label className="block text-sm font-bold ml-1">City</label>
                <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full h-14 px-5 rounded-2xl dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 font-medium" placeholder="City name" /></div>
              </div>
              {role === 'bank' && (
                <div className="space-y-2">
                  <label className="block text-sm font-bold ml-1">Detailed Physical Address</label>
                  <textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-5 py-4 rounded-2xl dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 font-medium min-h-[100px]" placeholder="Full building/street address for the directory"></textarea>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              {role === 'donor' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2"><label className="block text-sm font-bold ml-1">Last Blood Donation</label>
                  <select className="w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 font-medium" value={formData.lastDonation} onChange={(e) => setFormData({...formData, lastDonation: e.target.value})}>
                    <option value="never">Never Donated Before</option>
                    <option value="1month">Within last 30 days</option>
                    <option value="3months">More than 3 months ago</option>
                  </select></div>
                  <div className="space-y-2"><label className="block text-sm font-bold ml-1">Current Weight (kg)</label>
                  <input type="number" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} placeholder="Must be >45kg" className="w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 font-medium" /></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex items-start gap-4">
                    <span className="material-icons text-primary mt-1">info</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">By registering as a Blood Bank, you agree to keep your stock status updated. You will be assigned a "Verified" badge after license verification.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold ml-1">Govt. Registration / License Number</label>
                    <input type="text" value={formData.licenseNumber} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} className="w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 font-bold uppercase" placeholder="e.g. MH/BLB/2024/001" />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-10 border-t border-zinc-100 dark:border-zinc-800">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="flex items-center gap-2 px-8 py-4 font-black text-xs uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors">
                <span className="material-icons text-sm">arrow_back</span>
                Back
              </button>
            ) : <div />}
            {step < 3 ? (
              <button type="button" onClick={nextStep} className="px-12 py-4 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl active:scale-95 shadow-xl shadow-primary/20 transition-all">Next Step</button>
            ) : (
              <button type="button" onClick={handleCompleteRegistration} disabled={isCompleting} className="px-12 py-4 bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl active:scale-95 shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-3">
                {isCompleting && <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>}
                {isCompleting ? 'Processing...' : 'Finish Registration'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;