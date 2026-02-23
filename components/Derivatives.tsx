import React from 'react';
import { Layers } from 'lucide-react';

interface DerivativesProps {
  derivatives?: {
    base: string;
    noun: string;
    verb: string;
    adjective: string;
    adverb: string;
  };
}

const Derivatives: React.FC<DerivativesProps> = ({ derivatives }) => {
  if (!derivatives) return null;

  const forms = [
    { label: 'Base', value: derivatives.base },
    { label: 'Noun', value: derivatives.noun },
    { label: 'Verb', value: derivatives.verb },
    { label: 'Adjective', value: derivatives.adjective },
    { label: 'Adverb', value: derivatives.adverb },
  ];

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Word Forms</h3>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Part of Speech
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Form
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {forms.map((form) => (
                <tr key={form.label} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {form.label}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">
                    {form.value !== 'N/A' ? (
                      form.value
                    ) : (
                      <span className="text-slate-400 italic">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Derivatives;
