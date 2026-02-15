
import React from 'react';

const Terms: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-16 text-left">
    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Terms & Conditions of Service</h1>
    <p className="text-slate-600 dark:text-slate-400 mb-12">Last updated: May 24, 2024</p>

    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="space-y-12">
        <section className="flex gap-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl">1</div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold uppercase tracking-tight">User Eligibility</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To use India Blood Connect, you must be at least 18 years of age. By registering, you represent that you meet the medical criteria for blood donation as prescribed by the Government of India.</p>
          </div>
        </section>

        <section className="flex gap-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl">2</div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold uppercase tracking-tight">Code of Conduct</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">India Blood Connect is built on trust. Commercialization of blood is strictly prohibited and is a criminal offense.</p>
          </div>
        </section>

        <div className="mt-20 pt-12 border-t border-slate-100 dark:border-slate-800 text-center">
          <button className="px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-primary/20">I Accept the Terms</button>
        </div>
      </div>
    </div>
  </div>
);

export default Terms;
