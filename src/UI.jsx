import React from 'react';
import { X } from 'lucide-react';

// --- 1. دوال مساعدة (Helpers) ---
export const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString('ar-EG');
};

export const addDays = (date, days) => {
    if (!date) return null;
    const result = new Date(date);
    result.setDate(result.getDate() + parseInt(days));
    return result.toISOString().split('T')[0];
};

export const getDaysDifference = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    const target = new Date(dateString);
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
};

// --- 2. مكونات الواجهة (Components) ---

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden my-auto relative animate-scale-up">
        <button onClick={onClose} className="absolute top-3 left-3 p-1 bg-gray-100 rounded-full hover:bg-gray-200"><X size={20}/></button>
        <div className="p-4 border-b bg-gray-50"><h3 className="font-bold text-gray-800 text-center">{title}</h3></div>
        <div className="p-4 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-100 ${className}`}>{children}</div>
);

export const Button = ({ children, onClick, variant = 'primary', className = "" }) => {
  const variants = {
    primary: "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700",
    success: "bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700",
    danger: "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100",
    ghost: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    warning: "bg-amber-500 text-white hover:bg-amber-600",
    outline: "border-2 border-gray-200 text-gray-600"
  };
  return (
    <button onClick={onClick} className={`px-4 py-3 rounded-xl font-bold active:scale-95 flex items-center justify-center gap-2 transition-all ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const Input = ({ label, ...props }) => (
  <div className="mb-3">
    {label && <label className="block text-xs font-bold text-gray-400 mb-1 mr-1">{label}</label>}
    <input {...props} className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none transition-colors" />
  </div>
);

// --- 3. الرسوم البيانية (Charts) ---
export const ProductionChart = ({ milkRecords }) => {
    // ننشئ هيكل لآخر 7 أيام حتى لو لم يكن فيها إنتاج
    const last7Days = Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6-i));
        return d.toISOString().split('T')[0];
    });

    const data = last7Days.map(date => {
        const amount = milkRecords
            .filter(r => r.date === date)
            .reduce((sum, r) => sum + Number(r.amount), 0);
        return { date, amount };
    });

    const maxVal = Math.max(...data.map(d => d.amount)) || 10;

    return (
        <div className="flex items-end gap-2 h-40 mt-4 pb-2 border-b border-gray-200 px-2">
            {data.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-1 group h-full">
                    <div className="relative w-full flex flex-col justify-end h-full items-center">
                        <span className="text-[10px] font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">{item.amount}</span>
                        <div 
                            style={{height: `${(item.amount/maxVal)*100}%`}} 
                            className={`w-full rounded-t-md transition-all duration-500 ${item.amount>0 ? 'bg-blue-500 group-hover:bg-blue-600' : 'bg-gray-100 h-1'}`}
                        ></div>
                    </div>
                    <span className="text-[9px] text-gray-400 font-bold whitespace-nowrap">
                        {new Date(item.date).toLocaleDateString('ar-EG',{weekday:'short'})}
                    </span>
                </div>
            ))}
        </div>
    );
};
