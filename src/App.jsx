import React, { useState, useEffect } from 'react';
import { Milk, DollarSign, Users, Activity, Trash2, Download, Plus, Save, UserPlus, FileText, ChevronLeft } from 'lucide-react';

// --- مكونات الواجهة المحسنة (UI Components) ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white p-5 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-50 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = "" }) => {
  const variants = {
    primary: "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700",
    success: "bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700",
    danger: "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100",
    ghost: "bg-gray-50 text-gray-600 hover:bg-gray-100"
  };
  return (
    <button onClick={onClick} className={`px-4 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-transparent ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ label, ...props }) => (
  <div className="mb-3">
    {label && <label className="block text-xs font-bold text-gray-400 mb-1 mr-1">{label}</label>}
    <input {...props} className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-colors text-gray-800 font-medium placeholder-gray-300" />
  </div>
);

const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-rose-50 text-rose-700",
    yellow: "bg-amber-50 text-amber-700"
  };
  return <span className={`px-2 py-1 rounded-lg text-xs font-bold ${colors[color]}`}>{children}</span>;
};

// --- التطبيق الرئيسي ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notification, setNotification] = useState(null);

  // --- إدارة البيانات (State) ---
  const [cows, setCows] = useState(() => JSON.parse(localStorage.getItem('cows')) || []);
  const [milkRecords, setMilkRecords] = useState(() => JSON.parse(localStorage.getItem('milkRecords')) || []);
  const [customers, setCustomers] = useState(() => JSON.parse(localStorage.getItem('customers')) || []);
  const [sales, setSales] = useState(() => JSON.parse(localStorage.getItem('sales')) || []);

  // الحفظ التلقائي
  useEffect(() => {
    localStorage.setItem('cows', JSON.stringify(cows));
    localStorage.setItem('milkRecords', JSON.stringify(milkRecords));
    localStorage.setItem('customers', JSON.stringify(customers));
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [cows, milkRecords, customers, sales]);

  // دالة الإشعارات
  const showNotify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- الشاشات (Views) ---

  const Dashboard = () => {
    const totalMilk = milkRecords.reduce((sum, r) => sum + Number(r.amount), 0);
    const totalSales = sales.reduce((sum, s) => sum + Number(s.total), 0);
    const totalDebts = sales.reduce((sum, s) => sum + (Number(s.total) - Number(s.paid)), 0);

    return (
      <div className="space-y-4 animate-fade-in pb-20">
        {/* البطاقات العلوية */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl text-white shadow-xl shadow-blue-200/50">
            <div className="flex items-center justify-between mb-3 opacity-80">
              <span className="text-xs font-medium">الإنتاج الكلي</span>
              <Milk size={16} />
            </div>
            <p className="text-2xl font-bold">{totalMilk} <span className="text-sm font-normal opacity-80">رطل</span></p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-700 p-4 rounded-2xl text-white shadow-xl shadow-emerald-200/50">
            <div className="flex items-center justify-between mb-3 opacity-80">
              <span className="text-xs font-medium">المبيعات</span>
              <DollarSign size={16} />
            </div>
            <p className="text-2xl font-bold">{totalSales.toLocaleString()} <span className="text-sm font-normal opacity-80">ج.س</span></p>
          </div>
        </div>

        {/* بطاقة الديون */}
        <Card className="flex items-center justify-between border-r-4 border-r-rose-500">
          <div>
            <p className="text-gray-400 text-xs font-bold mb-1">الديون المستحقة (لي)</p>
            <p className="text-xl font-bold text-rose-600">{totalDebts.toLocaleString()} ج.س</p>
          </div>
          <div className="bg-rose-50 p-2 rounded-full text-rose-500">
            <FileText size={20} />
          </div>
        </Card>

        {/* ملخص القطيع */}
        <Card>
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-gray-700">ملخص القطيع</h3>
             <Badge color="blue">{cows.length} رأس</Badge>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 bg-emerald-50 p-3 rounded-xl text-center">
              <p className="text-emerald-700 font-bold text-lg">{cows.filter(c => c.status === 'milking').length}</p>
              <p className="text-xs text-emerald-600">حلابة</p>
            </div>
            <div className="flex-1 bg-gray-50 p-3 rounded-xl text-center">
              <p className="text-gray-700 font-bold text-lg">{cows.filter(c => c.status !== 'milking').length}</p>
              <p className="text-xs text-gray-500">جافة/أخرى</p>
            </div>
          </div>
        </Card>

        {/* زر النسخ الاحتياطي */}
        <button 
          onClick={() => {
             const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ cows, milkRecords, customers, sales }));
             const a = document.createElement('a'); a.href = dataStr; a.download = `backup_${new Date().toLocaleDateString()}.json`; a.click();
          }}
          className="w-full py-3 text-sm text-gray-400 border border-dashed border-gray-300 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <Download size={16} /> حفظ نسخة احتياطية
        </button>
      </div>
    );
  };

  const SalesManager = () => {
    const [view, setView] = useState('list'); // list, new, debts
    const [newSale, setNewSale] = useState({ customerId: '', amount: '', price: '500', paid: '', date: new Date().toISOString().split('T')[0] });
    const [newCustomer, setNewCustomer] = useState('');

    const handleAddSale = () => {
      if (!newSale.customerId || !newSale.amount || !newSale.price) return alert("الرجاء إكمال البيانات");
      const total = Number(newSale.amount) * Number(newSale.price);
      const paid = newSale.paid === '' ? total : Number(newSale.paid); // لو ما كتب المدفوع نعتبره دفع كامل
      
      const saleRecord = { ...newSale, id: Date.now(), total, paid, debt: total - paid };
      setSales([saleRecord, ...sales]);
      setNewSale({ ...newSale, amount: '', paid: '' }); // تصفير الحقول
      setView('list');
      showNotify("تم تسجيل البيع بنجاح 💰");
    };

    const handleAddCustomer = () => {
      if(!newCustomer) return;
      setCustomers([...customers, { id: Date.now(), name: newCustomer }]);
      setNewCustomer('');
      showNotify("تمت إضافة العميل ✅");
    };

    // حساب الديون لكل عميل
    const getCustomerDebts = () => {
      const debts = {};
      sales.forEach(s => {
        if(s.debt > 0) {
          debts[s.customerId] = (debts[s.customerId] || 0) + s.debt;
        }
      });
      return Object.entries(debts).map(([id, amount]) => ({
        id, amount, name: customers.find(c => c.id == id)?.name || 'غير معروف'
      }));
    };

    if (view === 'new') return (
      <div className="space-y-4 pb-20 animate-slide-up">
        <div className="flex items-center gap-2 mb-2">
          <button onClick={() => setView('list')} className="p-2 bg-gray-100 rounded-lg"><ChevronLeft size={20}/></button>
          <h2 className="font-bold text-xl text-gray-800">بيع جديد</h2>
        </div>
        
        <Card className="space-y-4">
           {/* إضافة عميل سريع */}
           <div className="flex gap-2 items-end">
             <div className="flex-1">
               <label className="text-xs font-bold text-gray-400 mb-1 block">العميل</label>
               <select 
                  className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl"
                  value={newSale.customerId}
                  onChange={e => setNewSale({...newSale, customerId: e.target.value})}
               >
                 <option value="">اختر العميل...</option>
                 {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
             </div>
             {/* زر إضافة عميل */}
             <button onClick={() => {
                const name = prompt("اسم العميل الجديد:");
                if(name) {
                  const newC = { id: Date.now(), name };
                  setCustomers([...customers, newC]);
                  setNewSale({...newSale, customerId: newC.id});
                }
             }} className="p-3 bg-blue-100 text-blue-600 rounded-xl mb-[2px]"><UserPlus size={20}/></button>
           </div>

           <div className="flex gap-3">
             <div className="flex-1">
               <Input label="الكمية (رطل)" type="number" value={newSale.amount} onChange={e => setNewSale({...newSale, amount: e.target.value})} />
             </div>
             <div className="flex-1">
               <Input label="السعر" type="number" value={newSale.price} onChange={e => setNewSale({...newSale, price: e.target.value})} />
             </div>
           </div>

           <div className="p-3 bg-blue-50 rounded-xl flex justify-between items-center">
             <span className="text-blue-800 font-bold">الإجمالي:</span>
             <span className="text-xl font-bold text-blue-900">{(Number(newSale.amount) * Number(newSale.price)).toLocaleString()} ج.س</span>
           </div>

           <Input label="المبلغ المدفوع (اتركه فارغاً إذا دفع بالكامل)" type="number" placeholder="كم دفع العميل؟" value={newSale.paid} onChange={e => setNewSale({...newSale, paid: e.target.value})} />

           <Button onClick={handleAddSale} className="w-full">إتمام البيع ✅</Button>
        </Card>
      </div>
    );

    return (
      <div className="space-y-4 pb-20">
        {/* تبويبات فرعية */}
        <div className="flex p-1 bg-gray-200 rounded-xl">
          <button onClick={() => setView('list')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${view === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>السجل</button>
          <button onClick={() => setView('debts')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${view === 'debts' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>الديون</button>
        </div>

        {view === 'list' && (
          <>
            <Button onClick={() => setView('new')} className="w-full flex justify-center items-center gap-2">
              <Plus size={18} /> عملية بيع جديدة
            </Button>
            <div className="space-y-3 mt-4">
              {sales.length === 0 && <p className="text-center text-gray-400 py-10">لا توجد مبيعات مسجلة</p>}
              {sales.map(sale => {
                const customerName = customers.find(c => c.id == sale.customerId)?.name || 'غير معروف';
                return (
                  <div key={sale.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-gray-800">{customerName}</p>
                        <p className="text-xs text-gray-400">{sale.date}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-lg text-gray-900">{sale.total.toLocaleString()} ج.س</p>
                        {sale.debt > 0 ? 
                          <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded">عليه: {sale.debt.toLocaleString()}</span> : 
                          <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded">خالص</span>
                        }
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 flex gap-2">
                       <span>🥛 {sale.amount} رطل</span>
                       <span>•</span>
                       <span>سعر: {sale.price}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {view === 'debts' && (
           <div className="space-y-3">
             {getCustomerDebts().length === 0 && <p className="text-center text-gray-400 py-10">لا توجد ديون 🎉</p>}
             {getCustomerDebts().map(d => (
               <Card key={d.id} className="flex justify-between items-center border-r-4 border-r-rose-500">
                 <span className="font-bold text-gray-700">{d.name}</span>
                 <span className="font-bold text-rose-600 text-lg">{d.amount.toLocaleString()} ج.س</span>
               </Card>
             ))}
           </div>
        )}
      </div>
    );
  };

  const CowsView = () => {
    const [newCow, setNewCow] = useState({ name: '', tag: '', status: 'milking' });
    const addCow = () => {
      if (!newCow.tag) return showNotify("أدخل رقم البقرة!");
      setCows([...cows, { ...newCow, id: Date.now() }]);
      setNewCow({ name: '', tag: '', status: 'milking' });
      showNotify("تمت الإضافة بنجاح");
    };

    return (
      <div className="space-y-4 pb-20">
        <Card>
          <h3 className="font-bold text-gray-700 mb-3">إضافة بقرة</h3>
          <div className="flex gap-2">
            <Input placeholder="الرقم (Tag)" value={newCow.tag} onChange={e => setNewCow({...newCow, tag: e.target.value})} />
            <Input placeholder="الاسم" value={newCow.name} onChange={e => setNewCow({...newCow, name: e.target.value})} />
          </div>
          <div className="flex gap-2 mb-3">
            {['milking', 'dry', 'sick'].map(st => (
              <button key={st} onClick={() => setNewCow({...newCow, status: st})}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition-all ${newCow.status === st 
                  ? (st === 'milking' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : st === 'dry' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-rose-50 border-rose-500 text-rose-700')
                  : 'bg-white border-gray-100 text-gray-400'
                }`}>
                {st === 'milking' ? 'حلابة' : st === 'dry' ? 'جافة' : 'مريضة'}
              </button>
            ))}
          </div>
          <Button onClick={addCow} className="w-full py-2">حفظ</Button>
        </Card>

        <div className="space-y-2">
          {cows.map(cow => (
            <div key={cow.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-12 rounded-lg ${cow.status === 'milking' ? 'bg-emerald-500' : cow.status === 'dry' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                <div>
                  <p className="font-bold text-gray-800">#{cow.tag} <span className="text-gray-500 font-normal text-sm">{cow.name}</span></p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {cow.status === 'milking' ? '🟢 تنتج حليب' : cow.status === 'dry' ? '🟠 جافة (فترة راحة)' : '🔴 مريضة/استبعاد'}
                  </p>
                </div>
              </div>
              <button onClick={() => setCows(cows.filter(c => c.id !== cow.id))} className="w-8 h-8 flex items-center justify-center text-rose-300 hover:text-rose-600 bg-rose-50 rounded-full">
                <Trash2 size={16}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const MilkView = () => {
    const [record, setRecord] = useState({ amount: '', session: 'morning', date: new Date().toISOString().split('T')[0] });
    const addRecord = () => {
      if (!record.amount) return;
      setMilkRecords([ { ...record, id: Date.now() }, ...milkRecords ]);
      setRecord({ ...record, amount: '' });
      showNotify("تم تسجيل الحلبة 🥛");
    };

    return (
      <div className="space-y-4 pb-20">
         <Card className="border-t-4 border-t-indigo-500">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-gray-800">سجل حلب اليوم</h3>
             <input type="date" value={record.date} onChange={e => setRecord({...record, date: e.target.value})} className="bg-gray-100 rounded-lg px-2 py-1 text-xs font-bold text-gray-600 outline-none"/>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
             <button onClick={() => setRecord({...record, session: 'morning'})} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${record.session === 'morning' ? 'bg-white shadow text-amber-600' : 'text-gray-400'}`}>☀️ صباح</button>
             <button onClick={() => setRecord({...record, session: 'evening'})} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${record.session === 'evening' ? 'bg-white shadow text-indigo-900' : 'text-gray-400'}`}>🌙 مساء</button>
          </div>

          <div className="relative mb-4">
             <input type="number" placeholder="0" className="w-full text-center text-4xl font-bold text-indigo-900 bg-transparent outline-none placeholder-gray-200" value={record.amount} onChange={e => setRecord({...record, amount: e.target.value})} />
             <span className="block text-center text-gray-400 text-xs font-bold mt-1">الكمية (رطل)</span>
          </div>
          
          <Button onClick={addRecord} className="w-full bg-indigo-600">تسجيل</Button>
        </Card>

        <div className="space-y-2">
          {milkRecords.slice(0, 15).map(rec => (
            <div key={rec.id} className="bg-white px-4 py-3 rounded-xl shadow-sm flex justify-between items-center border-l-4 border-gray-100 hover:border-indigo-400 transition-colors">
              <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-full ${rec.session === 'morning' ? 'bg-amber-50 text-amber-500' : 'bg-indigo-50 text-indigo-500'}`}>
                    <Milk size={18} />
                 </div>
                 <div>
                    <p className="font-bold text-gray-800 text-lg">{rec.amount} <span className="text-xs text-gray-400 font-normal">رطل</span></p>
                    <p className="text-[10px] text-gray-400">{rec.date}</p>
                 </div>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${rec.session === 'morning' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                {rec.session === 'morning' ? 'صباح' : 'مساء'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans text-gray-900" dir="rtl">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <span className="text-sm font-bold">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white pt-safe-top pb-4 px-6 sticky top-0 z-20 shadow-sm/50 backdrop-blur-md bg-white/90">
        <div className="flex justify-between items-center max-w-md mx-auto pt-4">
           <div>
             <h1 className="text-xl font-black text-gray-800 tracking-tight">مزرعتي 🐄</h1>
             <p className="text-xs text-gray-400 font-medium">نظام الإدارة الذكي</p>
           </div>
           <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
             <Activity size={20} />
           </div>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'cows' && <CowsView />}
        {activeTab === 'milk' && <MilkView />}
        {activeTab === 'sales' && <SalesManager />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-30">
        <div className="flex justify-around items-center p-2 max-w-md mx-auto">
          {[
            {id: 'dashboard', icon: Activity, label: 'الرئيسية'}, 
            {id: 'cows', icon: Users, label: 'القطيع'}, 
            {id: 'milk', icon: Milk, label: 'الحلبات'}, 
            {id: 'sales', icon: DollarSign, label: 'المالية'}
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 ${isActive ? 'bg-blue-50 text-blue-600 -translate-y-2 shadow-lg shadow-blue-100' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <tab.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] font-bold mt-1 transition-all ${isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0 h-0'}`}>{tab.label}</span>
              </button>
          )})}
        </div>
      </div>
    </div>
  );
}
