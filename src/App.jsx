import React, { useState, useEffect } from 'react';
import { Milk, DollarSign, Users, Activity, Trash2, Plus, ChevronLeft, Edit2, Share2, X, Wheat, TrendingUp, TrendingDown, MapPin, Calendar, Heart, AlertCircle, Syringe, Stethoscope, Package, MinusCircle, AlertTriangle } from 'lucide-react';

// --- أدوات مساعدة (Helpers) ---
const calculateAge = (dateString) => {
  if (!dateString) return "غير محدد";
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age + " سنة";
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString('ar-EG');
};

const addDays = (date, days) => {
    if (!date) return null;
    const result = new Date(date);
    result.setDate(result.getDate() + parseInt(days));
    return result.toISOString().split('T')[0];
};

const getDaysDifference = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    const target = new Date(dateString);
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
};

// --- مكونات الواجهة (UI Components) ---

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-scale-up overflow-hidden my-auto">
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full"><X size={20}/></button>
        </div>
        <div className="p-4 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white p-5 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-50 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = "" }) => {
  const variants = {
    primary: "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700",
    success: "bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700",
    danger: "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100",
    ghost: "bg-gray-50 text-gray-600 hover:bg-gray-100",
    warning: "bg-amber-500 text-white hover:bg-amber-600",
    outline: "border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
  };
  return (
    <button onClick={onClick} className={`px-4 py-3 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}>
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

// --- التطبيق الرئيسي ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', onConfirm: () => {} });

  // Data States
  const [cows, setCows] = useState(() => JSON.parse(localStorage.getItem('cows')) || []);
  const [milkRecords, setMilkRecords] = useState(() => JSON.parse(localStorage.getItem('milkRecords')) || []);
  const [sales, setSales] = useState(() => JSON.parse(localStorage.getItem('sales')) || []);
  const [customers, setCustomers] = useState(() => JSON.parse(localStorage.getItem('customers')) || []);
  const [feedRecords, setFeedRecords] = useState(() => JSON.parse(localStorage.getItem('feedRecords')) || []); // مشتريات
  const [feedConsumption, setFeedConsumption] = useState(() => JSON.parse(localStorage.getItem('feedConsumption')) || []); // استهلاك
  const [healthRecords, setHealthRecords] = useState(() => JSON.parse(localStorage.getItem('healthRecords')) || []); // علاجات

  useEffect(() => {
    localStorage.setItem('cows', JSON.stringify(cows));
    localStorage.setItem('milkRecords', JSON.stringify(milkRecords));
    localStorage.setItem('customers', JSON.stringify(customers));
    localStorage.setItem('sales', JSON.stringify(sales));
    localStorage.setItem('feedRecords', JSON.stringify(feedRecords));
    localStorage.setItem('feedConsumption', JSON.stringify(feedConsumption));
    localStorage.setItem('healthRecords', JSON.stringify(healthRecords));
  }, [cows, milkRecords, customers, sales, feedRecords, feedConsumption, healthRecords]);

  const showNotify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = (title, action) => {
    setConfirmDialog({
      isOpen: true,
      title: `هل أنت متأكد من حذف ${title}؟`,
      onConfirm: () => {
        action();
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        showNotify("تم الحذف بنجاح 🗑️");
      }
    });
  };

  const shareViaWhatsapp = (text) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // --- Views ---

  const Dashboard = () => {
    const totalMilk = milkRecords.reduce((sum, r) => sum + Number(r.amount), 0);
    const totalSales = sales.reduce((sum, s) => sum + Number(s.total), 0);
    const totalFeedCost = feedRecords.reduce((sum, f) => sum + Number(f.totalCost), 0);
    const totalHealthCost = healthRecords.reduce((sum, h) => sum + Number(h.cost || 0), 0);
    const netProfit = totalSales - (totalFeedCost + totalHealthCost);
    
    // Alerts Logic
    const getAlerts = () => {
      const alerts = [];
      // 1. تنبيهات التناسل
      cows.forEach(cow => {
        if (cow.inseminationDate) {
           const checkDate = addDays(cow.inseminationDate, 45);
           const birthDate = addDays(cow.inseminationDate, 283);
           const daysToCheck = getDaysDifference(checkDate);
           const daysToBirth = getDaysDifference(birthDate);

           if (daysToCheck >= 0 && daysToCheck <= 7) alerts.push({ type: 'check', msg: `جس حمل للبقرة #${cow.tag}`, days: daysToCheck });
           if (daysToBirth >= 0 && daysToBirth <= 14) alerts.push({ type: 'birth', msg: `ولادة قريبة للبقرة #${cow.tag}`, days: daysToBirth });
        }
      });
      // 2. تنبيهات المخزون
      const stock = {};
      feedRecords.forEach(r => stock[r.type] = (stock[r.type] || 0) + Number(r.quantity));
      feedConsumption.forEach(r => stock[r.type] = (stock[r.type] || 0) - Number(r.quantity));
      Object.entries(stock).forEach(([type, qty]) => {
          if (qty <= 5) alerts.push({ type: 'stock', msg: `مخزون ${type} منخفض جداً!`, qty });
      });

      return alerts;
    };
    const alerts = getAlerts();

    const generateReport = () => {
      const text = `📊 *تقرير المزرعة الشامل*\n\n💰 *صافي الربح:* ${netProfit.toLocaleString()} ج.س\n🥛 *الإنتاج:* ${totalMilk} رطل\n💊 *تكاليف العلاج:* ${totalHealthCost.toLocaleString()} ج.س\n🌾 *تكاليف العلف:* ${totalFeedCost.toLocaleString()} ج.س\n\n⚠️ *تنبيهات:* ${alerts.length} مهام عاجلة.`;
      shareViaWhatsapp(text);
    };

    return (
      <div className="space-y-4 pb-20 animate-fade-in">
        {alerts.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-bold text-gray-700 text-sm px-1">⚠️ تنبيهات هامة</h3>
            {alerts.map((alert, idx) => (
              <div key={idx} className={`p-3 rounded-xl border-r-4 shadow-sm flex items-center justify-between text-sm ${
                alert.type === 'stock' ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'
              }`}>
                <div className="flex items-center gap-2">
                   {alert.type === 'stock' ? <AlertTriangle size={16} className="text-red-500"/> : <Activity size={16} className="text-blue-500"/>}
                   <span className="font-bold text-gray-800">{alert.msg}</span>
                </div>
                {alert.qty !== undefined && <span className="font-bold text-red-600">{alert.qty} متبقي</span>}
              </div>
            ))}
          </div>
        )}

        <div className="bg-gray-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
           <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 text-sm font-bold">صافي الربح</span>
              {netProfit >= 0 ? <TrendingUp className="text-emerald-400"/> : <TrendingDown className="text-rose-400"/>}
           </div>
           <p className={`text-4xl font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
             {netProfit.toLocaleString()} <span className="text-sm text-white opacity-60 font-normal">ج.س</span>
           </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-amber-50 border-amber-100 p-3">
            <p className="text-xs text-amber-800 font-bold mb-1">مصروفات العلف</p>
            <p className="text-lg font-bold text-amber-700">{totalFeedCost.toLocaleString()}</p>
          </Card>
          <Card className="bg-rose-50 border-rose-100 p-3">
            <p className="text-xs text-rose-800 font-bold mb-1">مصروفات العلاج</p>
            <p className="text-lg font-bold text-rose-700">{totalHealthCost.toLocaleString()}</p>
          </Card>
        </div>
        <Button onClick={generateReport} className="w-full bg-green-600 hover:bg-green-700"><Share2 size={18} /> مشاركة التقرير</Button>
      </div>
    );
  };

  const CowsView = () => {
    // ... (Cows logic remains mostly same, adding Health Modal)
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ id: null, name: '', tag: '', status: 'milking', birthDate: '', calvings: 0, inseminationDate: '' });
    const [showHealthModal, setShowHealthModal] = useState(false);
    const [selectedCowForHealth, setSelectedCowForHealth] = useState(null);
    const [newHealthRecord, setNewHealthRecord] = useState({ type: 'treatment', description: '', cost: '', withdrawalDays: 0, date: new Date().toISOString().split('T')[0] });

    // Cow Handlers
    const handleSubmit = () => {
      if (!form.tag) return showNotify("رقم البقرة مطلوب!");
      if (isEditing) { setCows(cows.map(c => c.id === form.id ? { ...form } : c)); setIsEditing(false); } 
      else { setCows([...cows, { ...form, id: Date.now() }]); }
      setForm({ id: null, name: '', tag: '', status: 'milking', birthDate: '', calvings: 0, inseminationDate: '' });
      showNotify(isEditing ? "تم التعديل" : "تمت الإضافة");
    };
    const handleEdit = (cow) => { setForm(cow); setIsEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    
    // Health Handlers
    const openHealth = (cow) => { setSelectedCowForHealth(cow); setShowHealthModal(true); };
    const addHealthRecord = () => {
        if(!newHealthRecord.description) return;
        setHealthRecords([...healthRecords, { ...newHealthRecord, id: Date.now(), cowId: selectedCowForHealth.id }]);
        setNewHealthRecord({ type: 'treatment', description: '', cost: '', withdrawalDays: 0, date: new Date().toISOString().split('T')[0] });
        showNotify("تم تسجيل الحالة الصحية");
    };

    // Check withdrawal
    const checkWithdrawal = (cowId) => {
        const records = healthRecords.filter(r => r.cowId === cowId && Number(r.withdrawalDays) > 0);
        for(let r of records) {
            const endDate = addDays(r.date, r.withdrawalDays);
            const daysLeft = getDaysDifference(endDate);
            if(daysLeft > 0) return { isUnsafe: true, daysLeft };
        }
        return { isUnsafe: false };
    };

    return (
      <div className="space-y-4 pb-20">
        {/* Cow Form Card (Collapsed for brevity in this view, same as before) */}
        <Card className={isEditing ? "border-2 border-blue-400" : ""}>
          <div className="flex justify-between items-center mb-3">
             <h3 className="font-bold text-gray-700">{isEditing ? 'تعديل بقرة' : 'إضافة بقرة'}</h3>
             {isEditing && <button onClick={() => {setIsEditing(false); setForm({ id: null, name: '', tag: '', status: 'milking', birthDate: '', calvings: 0, inseminationDate: '' })}} className="text-xs text-red-500 font-bold">إلغاء</button>}
          </div>
          <div className="flex gap-2"> <Input placeholder="الرقم" value={form.tag} onChange={e => setForm({...form, tag: e.target.value})} /> <Input placeholder="الاسم" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /> </div>
          <div className="flex gap-2 mb-2"> <input type="date" className="flex-1 p-3 bg-gray-50 rounded-xl" value={form.birthDate} onChange={e => setForm({...form, birthDate: e.target.value})} /> </div>
          <Input placeholder="تاريخ آخر تلقيح" type="date" label="التلقيح (اختياري)" value={form.inseminationDate} onChange={e => setForm({...form, inseminationDate: e.target.value})} />
          <Button onClick={handleSubmit} className="w-full">{isEditing ? 'حفظ' : 'إضافة'}</Button>
        </Card>

        <div className="space-y-2">
          {cows.map(cow => {
             const { isUnsafe, daysLeft } = checkWithdrawal(cow.id);
             return (
            <div key={cow.id} className={`bg-white p-4 rounded-xl shadow-sm border relative ${isUnsafe ? 'border-red-500 bg-red-50' : 'border-gray-100'}`}>
              <div className="flex justify-between items-start">
                 <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${cow.status === 'milking' ? 'bg-emerald-500' : 'bg-gray-400'}`}>{cow.tag}</div>
                    <div>
                      <p className="font-bold text-gray-800">#{cow.tag} {cow.name}</p>
                      {isUnsafe && <p className="text-xs font-bold text-red-600 flex items-center gap-1"><AlertTriangle size={12}/> حليب غير صالح ({daysLeft} يوم)</p>}
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => openHealth(cow)} className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Stethoscope size={16}/></button>
                    <button onClick={() => handleEdit(cow)} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(`البقرة ${cow.tag}`, () => setCows(cows.filter(c => c.id !== cow.id)))} className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Trash2 size={16}/></button>
                 </div>
              </div>
            </div>
          )})}
        </div>

        {/* Health Modal */}
        <Modal isOpen={showHealthModal} onClose={() => setShowHealthModal(false)} title={`السجل الصحي - بقرة ${selectedCowForHealth?.tag}`}>
            <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-xl space-y-2">
                    <div className="flex gap-2">
                        <select className="p-2 rounded-lg border flex-1" value={newHealthRecord.type} onChange={e => setNewHealthRecord({...newHealthRecord, type: e.target.value})}>
                            <option value="treatment">علاج / دواء</option>
                            <option value="vaccine">تطعيم</option>
                        </select>
                        <input type="date" className="p-2 rounded-lg border" value={newHealthRecord.date} onChange={e => setNewHealthRecord({...newHealthRecord, date: e.target.value})} />
                    </div>
                    <Input placeholder="اسم المرض / الدواء" value={newHealthRecord.description} onChange={e => setNewHealthRecord({...newHealthRecord, description: e.target.value})} />
                    <div className="flex gap-2">
                        <Input placeholder="التكلفة" type="number" value={newHealthRecord.cost} onChange={e => setNewHealthRecord({...newHealthRecord, cost: e.target.value})} />
                        <div className="flex-1">
                             <Input placeholder="فترة السحب (أيام)" type="number" value={newHealthRecord.withdrawalDays} onChange={e => setNewHealthRecord({...newHealthRecord, withdrawalDays: e.target.value})} />
                        </div>
                    </div>
                    <Button onClick={addHealthRecord} className="w-full py-2 bg-purple-600 hover:bg-purple-700">تسجيل</Button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                    <h4 className="font-bold text-xs text-gray-500">السجل السابق</h4>
                    {healthRecords.filter(r => r.cowId === selectedCowForHealth?.id).map(r => (
                        <div key={r.id} className="text-sm p-2 border rounded-lg bg-white">
                            <div className="flex justify-between font-bold">
                                <span className={r.type === 'vaccine' ? 'text-green-600' : 'text-blue-600'}>{r.description}</span>
                                <span>{r.cost} ج.س</span>
                            </div>
                            <p className="text-xs text-gray-400">{formatDate(r.date)} {Number(r.withdrawalDays) > 0 && <span className="text-red-500">• سحب {r.withdrawalDays} يوم</span>}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
      </div>
    );
  };

  const FeedManager = () => {
    const [view, setView] = useState('stock'); // stock, buy, use
    const [newFeed, setNewFeed] = useState({ id: null, type: '', quantity: '', unit: 'جوال', price: '', date: new Date().toISOString().split('T')[0] });
    const [consumption, setConsumption] = useState({ type: '', quantity: '', date: new Date().toISOString().split('T')[0] });

    // Stock Calculation
    const getStock = () => {
        const stock = {};
        feedRecords.forEach(r => stock[r.type] = (stock[r.type] || 0) + Number(r.quantity));
        feedConsumption.forEach(r => stock[r.type] = (stock[r.type] || 0) - Number(r.quantity));
        return Object.entries(stock).map(([type, qty]) => ({ type, qty }));
    };

    const handleBuy = () => {
        if (!newFeed.type || !newFeed.quantity) return;
        setFeedRecords([...feedRecords, { ...newFeed, id: Date.now(), totalCost: Number(newFeed.price) * Number(newFeed.quantity) }]);
        setNewFeed({ id: null, type: '', quantity: '', unit: 'جوال', price: '', date: new Date().toISOString().split('T')[0] });
        showNotify("تم تسجيل الشراء ✅");
        setView('stock');
    };

    const handleConsume = () => {
        if (!consumption.type || !consumption.quantity) return;
        setFeedConsumption([...feedConsumption, { ...consumption, id: Date.now() }]);
        setConsumption({ type: '', quantity: '', date: new Date().toISOString().split('T')[0] });
        showNotify("تم تسجيل الاستهلاك 📉");
        setView('stock');
    };

    return (
        <div className="space-y-4 pb-20">
            {/* Tabs */}
            <div className="flex bg-gray-200 p-1 rounded-xl">
                <button onClick={() => setView('stock')} className={`flex-1 py-2 text-sm font-bold rounded-lg ${view === 'stock' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>المخزون</button>
                <button onClick={() => setView('buy')} className={`flex-1 py-2 text-sm font-bold rounded-lg ${view === 'buy' ? 'bg-white shadow text-green-600' : 'text-gray-500'}`}>شراء</button>
                <button onClick={() => setView('use')} className={`flex-1 py-2 text-sm font-bold rounded-lg ${view === 'use' ? 'bg-white shadow text-orange-600' : 'text-gray-500'}`}>استهلاك</button>
            </div>

            {view === 'stock' && (
                <div className="grid grid-cols-2 gap-3">
                    {getStock().map((item, idx) => (
                        <Card key={idx} className="text-center py-4 border-t-4 border-t-blue-500">
                            <Wheat size={24} className="mx-auto text-amber-500 mb-2"/>
                            <h3 className="font-bold text-gray-800">{item.type}</h3>
                            <p className={`text-2xl font-bold ${item.qty < 5 ? 'text-red-500' : 'text-blue-600'}`}>{item.qty}</p>
                            <span className="text-xs text-gray-400">وحدة متوفرة</span>
                        </Card>
                    ))}
                    {getStock().length === 0 && <p className="col-span-2 text-center text-gray-400 py-10">المخزن فارغ</p>}
                </div>
            )}

            {view === 'buy' && (
                <Card className="animate-slide-up">
                    <h3 className="font-bold mb-3 flex items-center gap-2 text-green-700"><Plus size={18}/> شراء علف جديد</h3>
                    <Input placeholder="النوع (ردة، مركزات...)" value={newFeed.type} onChange={e => setNewFeed({...newFeed, type: e.target.value})} />
                    <div className="flex gap-2">
                        <Input placeholder="الكمية" type="number" value={newFeed.quantity} onChange={e => setNewFeed({...newFeed, quantity: e.target.value})} />
                        <Input placeholder="سعر الوحدة" type="number" value={newFeed.price} onChange={e => setNewFeed({...newFeed, price: e.target.value})} />
                    </div>
                    <Button onClick={handleBuy} variant="success" className="w-full">إضافة للمخزون</Button>
                </Card>
            )}

            {view === 'use' && (
                <Card className="animate-slide-up">
                    <h3 className="font-bold mb-3 flex items-center gap-2 text-orange-700"><MinusCircle size={18}/> تسجيل استهلاك يومي</h3>
                    <div className="mb-3">
                        <label className="block text-xs font-bold text-gray-400 mb-1">نوع العلف</label>
                        <select className="w-full p-3 bg-gray-50 rounded-xl border" value={consumption.type} onChange={e => setConsumption({...consumption, type: e.target.value})}>
                            <option value="">اختر النوع...</option>
                            {getStock().map(s => <option key={s.type} value={s.type}>{s.type} (متوفر: {s.qty})</option>)}
                        </select>
                    </div>
                    <Input placeholder="الكمية المستهلكة" type="number" value={consumption.quantity} onChange={e => setConsumption({...consumption, quantity: e.target.value})} />
                    <Button onClick={handleConsume} className="w-full bg-orange-600 hover:bg-orange-700">خصم من المخزون</Button>
                </Card>
            )}
        </div>
    );
  };
  
  // Milk & Sales logic remains the same...
  const MilkView = () => {
    const [record, setRecord] = useState({ id: null, amount: '', session: 'morning', date: new Date().toISOString().split('T')[0] });
    const [isEditing, setIsEditing] = useState(false);
    const handleSubmit = () => { if (!record.amount) return; if (isEditing) { setMilkRecords(milkRecords.map(r => r.id === record.id ? record : r)); setIsEditing(false); } else { setMilkRecords([{ ...record, id: Date.now() }, ...milkRecords]); } setRecord({ id: null, amount: '', session: 'morning', date: new Date().toISOString().split('T')[0] }); showNotify("تم الحفظ"); };
    const handleEdit = (rec) => { setRecord(rec); setIsEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    return (
      <div className="space-y-4 pb-20">
         <Card className="border-t-4 border-t-indigo-500">
           <div className="flex gap-2 mb-3"> <input type="date" value={record.date} onChange={e => setRecord({...record, date: e.target.value})} className="bg-gray-100 rounded-xl px-3 py-2 text-sm font-bold flex-1"/> <div className="flex bg-gray-100 p-1 rounded-xl flex-1"> <button onClick={() => setRecord({...record, session: 'morning'})} className={`flex-1 rounded-lg text-xs font-bold ${record.session === 'morning' ? 'bg-white shadow text-amber-600' : 'text-gray-400'}`}>صباح</button> <button onClick={() => setRecord({...record, session: 'evening'})} className={`flex-1 rounded-lg text-xs font-bold ${record.session === 'evening' ? 'bg-white shadow text-indigo-900' : 'text-gray-400'}`}>مساء</button> </div> </div>
           <div className="relative mb-4"> <input type="number" placeholder="0" className="w-full text-center text-4xl font-bold text-indigo-900 bg-transparent outline-none" value={record.amount} onChange={e => setRecord({...record, amount: e.target.value})} /> <span className="block text-center text-gray-400 text-xs font-bold mt-1">الكمية (رطل)</span> </div>
          <Button onClick={handleSubmit} className="w-full bg-indigo-600">{isEditing ? 'تحديث' : 'تسجيل'}</Button>
        </Card>
        <div className="space-y-2"> {milkRecords.slice(0, 10).map(rec => ( <div key={rec.id} className="bg-white px-4 py-3 rounded-xl shadow-sm flex justify-between items-center"> <div className="flex items-center gap-3"> <div className={`p-2 rounded-full ${rec.session === 'morning' ? 'bg-amber-50 text-amber-500' : 'bg-indigo-50 text-indigo-500'}`}> <Milk size={18} /> </div> <div> <p className="font-bold text-gray-800 text-lg">{rec.amount} رطل</p> <p className="text-[10px] text-gray-400">{formatDate(rec.date)} • {rec.session === 'morning' ? 'صباح' : 'مساء'}</p> </div> </div> <div className="flex gap-2"> <button onClick={() => handleEdit(rec)} className="text-blue-400"><Edit2 size={16}/></button> <button onClick={() => handleDelete('سجل حلب', () => setMilkRecords(milkRecords.filter(r => r.id !== rec.id)))} className="text-red-400"><Trash2 size={16}/></button> </div> </div> ))} </div>
      </div>
    );
  };

  const SalesManager = () => {
    const [view, setView] = useState('list'); 
    const [newSale, setNewSale] = useState({ id: null, customerId: '', amount: '', price: '500', paid: '', date: new Date().toISOString().split('T')[0] });
    const handleSaveSale = () => { if (!newSale.customerId || !newSale.amount) return showNotify("بيانات ناقصة!"); const total = Number(newSale.amount) * Number(newSale.price); const paid = newSale.paid === '' ? total : Number(newSale.paid); const saleData = { ...newSale, total, paid, debt: total - paid }; if (newSale.id) { setSales(sales.map(s => s.id === newSale.id ? saleData : s)); showNotify("تم تحديث البيع"); } else { setSales([{ ...saleData, id: Date.now() }, ...sales]); showNotify("تم البيع بنجاح 💰"); } setNewSale({ id: null, customerId: '', amount: '', price: '500', paid: '', date: new Date().toISOString().split('T')[0] }); setView('list'); };
    return (
      <div className="space-y-4 pb-20">
        <div className="flex p-1 bg-gray-200 rounded-xl"> <button onClick={() => setView('list')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${view === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>السجل</button> <button onClick={() => setView('debts')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${view === 'debts' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>الديون</button> </div>
        {view === 'list' && ( <> <Button onClick={() => {setNewSale({ id: null, customerId: '', amount: '', price: '500', paid: '', date: new Date().toISOString().split('T')[0] }); setView('new')}} className="w-full"><Plus size={18} /> عملية بيع جديدة</Button> 
            {view === 'new' && <Card className="mt-4 animate-slide-up"> <div className="flex gap-2 mb-3"> <select className="w-full p-3 bg-gray-50 border rounded-xl" value={newSale.customerId} onChange={e => setNewSale({...newSale, customerId: e.target.value})}> <option value="">اختر العميل...</option> {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)} </select> <button onClick={() => {const n = prompt("اسم العميل:"); if(n) setCustomers([...customers, {id:Date.now(), name:n}])}} className="bg-blue-100 p-3 rounded-xl"><Plus/></button> </div> <Input placeholder="الكمية" type="number" value={newSale.amount} onChange={e => setNewSale({...newSale, amount: e.target.value})} /> <Input placeholder="السعر" type="number" value={newSale.price} onChange={e => setNewSale({...newSale, price: e.target.value})} /> <Input placeholder="المدفوع" type="number" value={newSale.paid} onChange={e => setNewSale({...newSale, paid: e.target.value})} /> <Button onClick={handleSaveSale} className="w-full">حفظ</Button> </Card>}
            <div className="space-y-3 mt-4"> {sales.slice(0, 10).map(sale => ( <div key={sale.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between"> <div> <p className="font-bold text-gray-800">{customers.find(c => c.id == sale.customerId)?.name}</p> <p className="text-xs text-gray-400">{formatDate(sale.date)} • {sale.amount} رطل</p> </div> <div className="text-left"> <p className="font-bold text-blue-900">{sale.total.toLocaleString()}</p> {sale.debt > 0 && <span className="text-xs bg-red-100 text-red-600 px-1 rounded">باقي: {sale.debt}</span>} </div> </div> ))} </div> </> )}
        {view === 'debts' && <Card> {customers.map(c => { const debt = sales.filter(s => s.customerId == c.id).reduce((sum, s) => sum + s.debt, 0); return debt > 0 ? <div key={c.id} className="flex justify-between py-3 border-b"> <span>{c.name}</span> <span className="font-bold text-red-600">{debt.toLocaleString()}</span> </div> : null })} </Card>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans text-gray-900" dir="rtl">
      <Modal isOpen={confirmDialog.isOpen} onClose={() => setConfirmDialog({...confirmDialog, isOpen: false})} title="تأكيد الحذف ⚠️"> <p className="text-gray-600 mb-6">{confirmDialog.title}</p> <div className="flex gap-3"> <Button onClick={confirmDialog.onConfirm} variant="danger" className="flex-1">نعم، احذف</Button> <Button onClick={() => setConfirmDialog({...confirmDialog, isOpen: false})} variant="ghost" className="flex-1">إلغاء</Button> </div> </Modal>
      {notification && ( <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-2 animate-bounce"> <span className="text-sm font-bold">{notification}</span> </div> )}
      <div className="bg-white pt-safe-top pb-4 px-6 sticky top-0 z-20 shadow-sm bg-white/95 backdrop-blur-sm"> <div className="flex justify-between items-center max-w-md mx-auto pt-4"> <div> <h1 className="text-xl font-black text-gray-800 tracking-tight">مزرعتي 🐄</h1> <p className="text-xs text-gray-400 font-medium">نظام الإدارة الذكي</p> </div> <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"> <Activity size={20} /> </div> </div> </div>
      <div className="p-4 max-w-md mx-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'cows' && <CowsView />}
        {activeTab === 'milk' && <MilkView />}
        {activeTab === 'sales' && <SalesManager />}
        {activeTab === 'feed' && <FeedManager />}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-30"> <div className="flex justify-around items-center p-2 max-w-md mx-auto"> {[ {id: 'dashboard', icon: Activity, label: 'الرئيسية'}, {id: 'cows', icon: Users, label: 'القطيع'}, {id: 'milk', icon: Milk, label: 'الحلبات'}, {id: 'sales', icon: DollarSign, label: 'المالية'}, {id: 'feed', icon: Wheat, label: 'الأعلاف'} ].map(tab => { const isActive = activeTab === tab.id; return ( <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center justify-center w-14 h-16 rounded-2xl transition-all duration-300 ${isActive ? 'bg-blue-50 text-blue-600 -translate-y-2 shadow-lg shadow-blue-100' : 'text-gray-400 hover:bg-gray-50'}`}> <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} /> <span className={`text-[9px] font-bold mt-1 transition-all ${isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0 h-0'}`}>{tab.label}</span> </button> )})} </div> </div>
    </div>
  );
}
