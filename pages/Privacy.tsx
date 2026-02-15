
import React from 'react';

const Privacy: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-16 text-left">
    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Privacy Policy & Data Security</h1>
    <p className="text-slate-500 mb-12">Last Updated: October 24, 2024</p>
    
    <div className="space-y-12 prose dark:prose-invert max-w-none">
      <section>
        <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
        <p>At India Blood Connect, your privacy and the security of your personal data are our top priorities. This Privacy Policy explains how we collect, use, and protect your information when you use our nationwide blood donation platform.</p>
      </section>

      <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
            <span className="material-icons text-green-600">lock</span>
          </div>
          <h2 className="text-2xl font-bold m-0">Data Encryption</h2>
        </div>
        <p>We employ state-of-the-art security measures to ensure your personal information remains private. All data is encrypted using 256-bit SSL technology.</p>
        <ul className="list-disc pl-5 mt-4 space-y-2">
          <li>End-to-end encryption for all personal identification data.</li>
          <li>Secure database storage with restricted access protocols.</li>
          <li>Regular security audits and vulnerability assessments.</li>
        </ul>
      </section>
    </div>
  </div>
);

export default Privacy;
