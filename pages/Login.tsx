
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('donor');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    let interval: any;
    if (timer > 0) interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = () => {
    if (mobileNumber.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsOtpSent(true);
      setTimer(30);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }, 1000);
  };

  const handleOtpInput = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    if (val && index < 3) document.getElementById(`login-otp-${index + 1}`)?.focus();
  };

  const handleLogin = () => {
    if (otp.some(o => !o)) {
      alert("Please enter the complete OTP.");
      return;
    }

    if (role === 'donor') {
      const allDonors = JSON.parse(localStorage.getItem('indiaBloodConnect_all_donors') || '[]');
      const existingUser = allDonors.find((u: any) => u.mobile === mobileNumber);
      if (existingUser) {
        localStorage.setItem('indiaBloodConnect_user', JSON.stringify({ ...existingUser, role: 'donor' }));
        window.dispatchEvent(new Event('storage'));
        navigate('/dashboard');
      } else {
        alert("No donor account found with this mobile number.");
      }
    } else {
      const allBanks = JSON.parse(localStorage.getItem('indiaBloodConnect_all_banks') || '[]');
      const existingBank = allBanks.find((b: any) => b.mobile === mobileNumber);
      if (existingBank) {
        localStorage.setItem('indiaBloodConnect_user', JSON.stringify({ ...existingBank, role: 'bank' }));
        window.dispatchEvent(new Event('storage'));
        navigate('/dashboard');
      } else {
        alert("No blood bank account found with this mobile number.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-left">
      <div className={`fixed top-24 right-4 z-50 transition-all duration-500 transform ${showToast ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0 pointer-events-none'}`}>
        <div className="bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border-l-4 border-primary">
          <span className="material-icons text-primary">sms</span>
          <div>
            <p className="font-bold text-sm text-left">SIMULATED SMS</p>
            <p className="text-xs opacity-80">Login OTP: <span className="font-black text-primary">1 2 3 4</span></p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-10 rounded-3xl shadow-2xl border border-zinc-100 dark:border-zinc-800">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Welcome Back</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">Access your {role === 'donor' ? 'donor' : 'organization'} portal.</p>

        {/* Role Toggle */}
        <div className="bg-slate-100 dark:bg-zinc-800 p-1 rounded-2xl flex mb-8">
          <button 
            onClick={() => setRole('donor')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === 'donor' ? 'bg-white dark:bg-zinc-700 shadow-sm text-primary' : 'text-zinc-400'}`}
          >
            Individual Donor
          </button>
          <button 
            onClick={() => setRole('bank')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === 'bank' ? 'bg-white dark:bg-zinc-700 shadow-sm text-primary' : 'text-zinc-400'}`}
          >
            Blood Bank
          </button>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Registered Mobile</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">+91</span>
              <input 
                type="tel" 
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                disabled={isOtpSent}
                className="w-full pl-14 pr-4 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:ring-primary focus:border-primary disabled:opacity-50 transition-all outline-none font-bold"
                placeholder="00000 00000"
              />
            </div>
          </div>

          {!isOtpSent ? (
            <button 
              onClick={handleSendOtp}
              disabled={isVerifying || mobileNumber.length !== 10}
              className="w-full py-5 bg-primary text-white font-bold rounded-2xl hover:bg-red-700 shadow-xl shadow-primary/20 disabled:bg-zinc-300 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isVerifying ? <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div> : 'Send Login OTP'}
            </button>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-top-4 duration-300">
              <div className="space-y-4">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Enter OTP</label>
                <div className="flex gap-3">
                  {[0, 1, 2, 3].map(i => (
                    <input 
                      key={i} id={`login-otp-${i}`}
                      type="text" maxLength={1}
                      value={otp[i]}
                      onChange={(e) => handleOtpInput(i, e.target.value)}
                      className="w-full h-16 text-center text-2xl font-black rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 focus:border-primary outline-none transition-all"
                    />
                  ))}
                </div>
                <div className="text-right">
                  {timer > 0 ? (
                    <span className="text-xs text-zinc-400 font-bold">Resend in {timer}s</span>
                  ) : (
                    <button onClick={handleSendOtp} className="text-xs text-primary font-black uppercase tracking-widest hover:underline">Resend OTP</button>
                  )}
                </div>
              </div>
              <button 
                onClick={handleLogin}
                className="w-full py-5 bg-primary text-white font-bold rounded-2xl hover:bg-red-700 shadow-xl shadow-primary/20 transition-all active:scale-95"
              >
                Verify & Login
              </button>
            </div>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800 text-center">
          <p className="text-sm text-zinc-500">
            Don't have an account? <Link to="/register" className="text-primary font-black hover:underline">Register Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
