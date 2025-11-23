import React, { useState, useEffect } from 'react';
import { Milk, DollarSign, Users, Activity, Trash2 } from 'lucide-react';

const Button = ({ children, onClick, className = "" }) => (
  <button onClick={onClick} className={`px-4 py-3 rounded-xl font-bold text-white transition active:scale-95 shadow-md ${className}`}>
    {children}
  </button>
);

const Input = ({ ...props }) => (
  <input {...props} className="w-full p-3 border-2 border-gray-200 rounded-xl mb-3 focus:border-blue-500 focus:outline-none" />
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [cows, setCows] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cows')) || [] } catch { return [] }
  });
  const [milkRecords, setMilkRecords] = useState(() => {
    try { return JSON.parse(localStorage.getItem('milkRecords')) || [] } catch { return [] }
  });
  const [sales, setSales] = useState(() => []);

  useEffect(() => {
    localStorage.setItem('cows', JSON.stringify(cows));
    localStorage.setItem('milkRecords', JSON.stringify(milkRecords));
  }, [cows, milkRecords]);

  // Dashboard Component
  const Dashboard = () => {
    const totalMilk = milkRecords.reduce((sum, r) => sum + Number(r.amount), 0);
    
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-2xl text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm opacity-90">إنتاج الحليب</h3>
              <Milk size={20} />
            </div>
            <p className="text-3xl font-bold">{totalMilk} <span className="text-sm">لتر</span></p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-2xl text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm opacity-90">عدد الأبقار</h3>
              <Users size={20} />
            </div>
            <p className="text-3xl font-bold">{cows.length} <span className="text-sm">رأس</span></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4 text-gray-700 border-b pb-2">حالة القطيع</h3>
          <div className="flex justify-between text-center">
             <div>
               <p className="text-green-600 font-bold text-xl">{cows.filter(c => c.status === 'milking').length}</p>
               <p className="text-xs text-gray-500 mt-1">حلابة</p>
             </div>
             <div className="w-px bg-gray-200"></div>
             <div>
               <p className="text-red-500 font-bold text-xl">{cows.filter(c => c.status !== 'milking').length}</p>
               <p className="text-xs text-gray-500 mt-1">جافة/مريضة</p>
             </div>
          </div>
        </div>
      </div>
    );
  };

  // Cows Component
  const CowsManager = () => {
    const [newCow, setNewCow] = useState({ name: '', tag: '', status: 'milking' });
    
    const addCow = () => {
      if (!newCow.tag) return alert("أدخل رقم البقرة");
      setCows([...cows, { ...newCow, id: Date.now() }]);
      setNewCow({ name: '', tag: '', status: 'milking' });
    };

    return (
      <div className="space-y-4 pb-20">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3">إضافة بقرة جديدة</h3>
          <div className="flex gap-2">
            <Input placeholder="رقم البقرة (Tag)" value={newCow.tag} onChange={e => setNewCow({...newCow, tag: e.target.value})} />
            <Input placeholder="الاسم" value={newCow.name} onChange={e => setNewCow({...newCow, name: e.target.value})} />
          </div>
          <select 
            className="w-full p-3 border-2 border-gray-200 rounded-xl mb-3 bg-white"
            value={newCow.status}
            onChange={e => setNewCow({...newCow, status: e.target.value})}
          >
            <option value="milking">🟢 حلابة</option>
            <option value="dry">🔴 جافة</option>
            <option value="sick">⚠️ مريضة</option>
          </select>
          <Button onClick={addCow} className="w-full bg-blue-600 hover:bg-blue-700">حفظ البقرة</Button>
        </div>

        <div className="space-y-3">
          {cows.map(cow => (
            <div key={cow.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-10 rounded-full ${cow.status === 'milking' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <p className="font-bold text-gray-800">#{cow.tag} {cow.name}</p>
                  <p className="text-xs text-gray-500">{cow.status === 'milking' ? 'حلابة' : 'خارج الإنتاج'}</p>
                </div>
              </div>
              <button onClick={() => setCows(cows.filter(c => c.id !== cow.id))} className="p-2 text-red-400 hover:text-red-600 bg-red-50 rounded-lg">
                <Trash2 size={18}/>
              </button>
            </div>
          ))}
          {cows.length === 0 && <p className="text-center text-gray-400 mt-10">لا توجد أبقار مسجلة</p>}
        </div>
      </div>
    );
  };

  // Milk Component
  const MilkProduction = () => {
    const [record, setRecord] = useState({ amount: '', session: 'morning', date: new Date().toISOString().split('T')[0] });

    const addRecord = () => {
      if (!record.amount) return;
      setMilkRecords([ { ...record, id: Date.now() }, ...milkRecords ]);
      setRecord({ ...record, amount: '' });
    };

    return (
      <div className="space-y-4 pb-20">
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3">تسجيل حلبة اليوم</h3>
          <Input type="date" value={record.date} onChange={e => setRecord({...record, date: e.target.value})} />
          <div className="flex gap-3 mb-3">
            <button 
              onClick={() => setRecord({...record, session: 'morning'})}
              className={`flex-1 py-3 rounded-xl border-2 font-bold transition ${record.session === 'morning' ? 'bg-yellow-50 border-yellow-400 text-yellow-700' : 'border-gray-200 text-gray-400'}`}
            >☀️ صباح</button>
            <button 
               onClick={() => setRecord({...record, session: 'evening'})}
               className={`flex-1 py-3 rounded-xl border-2 font-bold transition ${record.session === 'evening' ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'border-gray-200 text-gray-400'}`}
            >🌙 مساء</button>
          </div>
          <div className="relative">
            <Input type="number" placeholder="0" value={record.amount} onChange={e => setRecord({...record, amount: e.target.value})} style={{fontSize: '1.2rem'}} />
            <span className="absolute left-4 top-4 text-gray-400 font-bold">لتر</span>
          </div>
          <Button onClick={addRecord} className="w-full bg-indigo-600 hover:bg-indigo-700">تسجيل</Button>
        </div>

        <div className="space-y-2">
          {milkRecords.slice(0, 10).map(rec => (
            <div key={rec.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border-r-4 border-indigo-500">
              <span className="text-gray-500 text-sm">{rec.date}</span>
              <span className={`px-2 py-1 rounded text-xs font-bold ${rec.session === 'morning' ? 'bg-yellow-100 text-yellow-700' : 'bg-indigo-100 text-indigo-700'}`}>
                {rec.session === 'morning' ? 'صباحية' : 'مسائية'}
              </span>
              <span className="font-bold text-lg">{rec.amount} <span className="text-xs font-normal">لتر</span></span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Header */}
      <div className="bg-blue-900 text-white p-4 pb-6 rounded-b-[2rem] shadow-lg mb-[-1rem] sticky top-0 z-10">
        <div className="flex justify-between items-center max-w-md mx-auto">
           <h1 className="text-xl font-bold">🐮 مزرعتي</h1>
           <div className="bg-blue-800 p-2 rounded-lg"><Activity size={20} /></div>
        </div>
      </div>

      <div className="p-4 pt-8 max-w-md mx-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'cows' && <CowsManager />}
        {activeTab === 'milk' && <MilkProduction />}
        {activeTab === 'sales' && <div className="flex flex-col items-center justify-center mt-20 text-gray-400"><DollarSign size={48} className="mb-2 opacity-50"/> <p>قسم المبيعات قيد التطوير</p></div>}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around p-2 max-w-md mx-auto">
          {[{id: 'dashboard', icon: Activity, label: 'الرئيسية'}, {id: 'cows', icon: Users, label: 'القطيع'}, {id: 'milk', icon: Milk, label: 'الحلبات'}, {id: 'sales', icon: DollarSign, label: 'مالية'}].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)} 
              className={`flex flex-col items-center p-2 rounded-xl transition ${activeTab === tab.id ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}
            >
              <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
              <span className="text-[10px] font-bold mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
