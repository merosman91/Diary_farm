import React, { useState, useEffect } from 'react';
import { Milk, DollarSign, Users, Activity, Trash2, Plus, ChevronLeft, Edit2, Share2, X, Wheat, TrendingUp, TrendingDown, MapPin, Calendar, Heart, AlertCircle, Stethoscope, Package, MinusCircle, AlertTriangle, Download, History, BarChart3, PieChart } from 'lucide-react';

// --- أدوات مساعدة (Helpers) ---
const calculateAge = (dateString) => {
  if (!dateString) return "غير محدد";
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
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

// --- مكونات الواجهة والرسوم البيانية (UI & Charts) ---

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

// مكون رسم بياني بسيط (CSS Bar Chart)
const SimpleBarChart = ({ data, labelKey, valueKey, color = "bg-blue-500" }) => {
    if(!data || data.length === 0) return <p className="text-center text-gray-400 text-xs py-4">لا توجد بيانات للرسم</p>;
    const maxVal = Math.max(...data.map(d => Number(d[valueKey])));
    return (
        <div className="flex items-end gap-2 h-32 mt-4 pb-2 border-b border-gray-100">
            {data.slice(-7).map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="relative w-full flex justify-end flex-col h-full">
                        <div 
                            style={{ height: `${(Number(item[valueKey]) / maxVal) * 100}%` }} 
                            className={`w-full ${color} rounded-t-md opacity-80 group-hover:opacity-100 transition-all relative`}
                        >
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-gray-800 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {item[valueKey]}
                            </span>
                        </div>
                    </div>
                    <span className="text-[9px] text-gray-400 font-bold rotate-0 truncate w-full text-center">{item[labelKey]}</span>
                </div>
            ))}
        </div>
    );
};

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
  const [feedRecords, setFeedRecords] = useState(() => JSON.parse(localStorage.getItem('feedRecords')) || []); 
  const [feedConsumption, setFeedConsumption] = useState(() => JSON.parse(localStorage.getItem('feedConsumption')) || []); 
  const [healthRecords, setHealthRecords] = useState(() => JSON.parse(localStorage.getItem('healthRecords')) || []); 

  useEffect(() => {
    localStorage.setItem('cows', JSON.stringify(cows));
    localStorage.setItem('milkRecords', JSON.stringify(milkRecords));
    localStorage.setItem('customers', JSON.stringify(customers));
    localStorage.setItem('sales', JSON.stringify(sales));
    localStorage.setItem('feedRecords', JSON.stringify(feedRecords));
    localStorage.setItem('feedConsumption', JSON.stringify(feedConsumption));
    localStorage.setItem('healthRecords', JSON.stringify(healthRecords));
  }, [cows, milkRecords, customers, sales, feedRecords, feedConsumption, healthRecords]);

  const showNotify = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };
  const handleDelete = (title, action) => { setConfirmDialog({ isOpen: true, title: `هل أنت متأكد من حذف ${title}؟`, onConfirm: () => { action(); setConfirmDialog({ ...confirmDialog, isOpen: false }); showNotify("تم الحذف بنجاح 🗑️"); } }); };
  const shareViaWhatsapp = (text) => { window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank'); };

  // وظيفة النسخ الاحتياطي
  const downloadBackup = () => {
    const data = { cows, milkRecords, sales, customers, feedRecords, feedConsumption, healthRecords };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `farm_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showNotify("تم تحميل ملف النسخة الاحتياطية 📥");
  };

  // --- Views ---

  const Dashboard = () => {
    // 1. Financials
    const totalMilk = milkRecords.reduce((sum, r) => sum + Number(r.amount), 0);
    const totalSales = sales.reduce((sum, s) => sum + Number(s.total), 0);
    const totalFeedCost = feedRecords.reduce((sum, f) => sum + Number(f.totalCost), 0);
    const totalHealthCost = healthRecords.reduce((sum, h) => sum + Number(h.cost || 0), 0);
    const totalExpenses = totalFeedCost + totalHealthCost;
    const netProfit = totalSales - totalExpenses;
    
    // 2. Production Chart Data (Last 7 entries grouped by date)
    const milkByDate = milkRecords.reduce((acc, curr) => {
        acc[curr.date] = (acc[curr.date] || 0) + Number(curr.amount);
        return acc;
    }, {});
    const chartData = Object.keys(milkByDate).sort().slice(-7).map(date => ({ date: date.slice(5), amount: milkByDate[date] }));

    // 3. Reproduction Stats
    const pregnantCount = cows.filter(c => c.inseminationDate).length;
    const totalCows = cows.length;

    // 4. Alerts
    const getAlerts = () => {
      const alerts = [];
      cows.forEach(cow => {
        if (cow.inseminationDate) {
           const daysToBirth = getDaysDifference(addDays(cow.inseminationDate, 283));
           if (daysToBirth >= 0 && daysToBirth <= 14) alerts.push({ type: 'birth', msg: `ولادة قريبة: بقرة #${cow.tag}`, days: daysToBirth });
        }
      });
      // Stock Alerts
      const stock = {};
      feedRecords.forEach(r => stock[r.type] = (stock[r.type] || 0) + Number(r.quantity));
      feedConsumption.forEach(r => stock[r.type] = (stock[r.type] || 0) - Number(r.quantity));
      Object.entries(stock).forEach(([type, qty]) => { if (qty <= 5) alerts.push({ type: 'stock', msg: `مخزون منخفض: ${type}`, qty }); });
      return alerts;
    };
    const alerts = getAlerts();

    return (
      <div className="space-y-4 pb-20 animate-fade-in">
        {/* التنبيهات */}
        {alerts.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
             <h3 className="text-orange-800 font-bold text-sm mb-2 flex items-center gap-1"><AlertTriangle size={16}/> إجراءات مطلوبة</h3>
             <div className="space-y-1">
                {alerts.map((alert, idx) => (
                    <div key={idx} className="flex justify-between text-xs bg-white p-2 rounded shadow-sm">
                        <span className="font-bold text-gray-700">{alert.msg}</span>
                        <span className="text-orange-600 font-bold">{alert.days ? `بعد ${alert.days} يوم` : `متبقي ${alert.qty}`}</span>
                    </div>
                ))}
             </div>
          </div>
        )}

        {/* صافي الربح */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
           <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300 text-sm font-bold">صافي الأرباح</span>
              {netProfit >= 0 ? <TrendingUp className="text-emerald-400"/> : <TrendingDown className="text-rose-400"/>}
           </div>
           <p className={`text-4xl font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
             {netProfit.toLocaleString()} <span className="text-sm text-white opacity-60 font-normal">ج.س</span>
           </p>
           <div className="mt-4 flex gap-2 text-xs opacity-80">
                <span className="flex items-center gap-1"><DollarSign size={12}/> مبيعات: {totalSales.toLocaleString()}</span>
                <span className="text-rose-300 flex items-center gap-1"><MinusCircle size={12}/> مصاريف: {totalExpenses.toLocaleString()}</span>
           </div>
        </div>

        {/* رسم بياني للإنتاج */}
        <Card>
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2"><BarChart3 size={16} className="text-blue-500"/> إنتاج آخر 7 أيام (رطل)</h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">المجموع: {totalMilk}</span>
            </div>
            <SimpleBarChart data={chartData} labelKey="date" valueKey="amount" color="bg-blue-500" />
        </Card>

        {/* تحليل المصروفات والتناسل */}
        <div className="grid grid-cols-2 gap-3">
            <Card className="p-4">
                <h3 className="font-bold text-gray-700 text-xs mb-3 flex items-center gap-1"><PieChart size={14}/> توزيع المصاريف</h3>
                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1"><span>علف</span><span>{Math.round((totalFeedCost/totalExpenses)*100 || 0)}%</span></div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div style={{width: `${(totalFeedCost/totalExpenses)*100}%`}} className="h-full bg-amber-500"></div></div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1"><span>علاج</span><span>{Math.round((totalHealthCost/totalExpenses)*100 || 0)}%</span></div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div style={{width: `${(totalHealthCost/totalExpenses)*100}%`}} className="h-full bg-rose-500"></div></div>
                    </div>
                </div>
            </Card>

            <Card className="p-4 flex flex-col justify-center items-center text-center">
                <h3 className="font-bold text-gray-700 text-xs mb-2 flex items-center gap-1"><Heart size={14} className="text-purple-500"/> حالة القطيع</h3>
                <div className="relative w-20 h-20 flex items-center justify-center rounded-full border-4 border-purple-100">
                     <span className="text-xl font-bold text-purple-600">{pregnantCount}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 font-bold">{pregnantCount} عشار من أصل {totalCows}</p>
            </Card>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex gap-2">
            <button onClick={() => shareViaWhatsapp(`تقرير المزرعة:\nالأرباح: ${netProfit}\nالإنتاج: ${totalMilk}`)} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"><Share2 size={16}/> مشاركة التقرير</button>
            <button onClick={downloadBackup} className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"><Download size={16}/> نسخ احتياطي</button>
        </div>
      </div>
    );
  };

  const FeedManager = () => {
    const [view, setView] = useState('stock'); // stock, buy, use, history
    const [newFeed, setNewFeed] = useState({ id: null, type: '', quantity: '', unit: 'جوال', price: '', merchant: '', date: new Date().toISOString().split('T')[0] });
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
        setNewFeed({ id: null, type: '', quantity: '', unit: 'جوال', price: '', merchant: '', date: new Date().toISOString().split('T')[0] });
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
            <div className="flex bg-gray-200 p-1 rounded-xl overflow-x-auto">
                {[{id:'stock', l:'المخزون'}, {id:'buy', l:'شراء'}, {id:'use', l:'استهلاك'}, {id:'history', l:'سجل الشراء'}].map(t => (
                    <button key={t.id} onClick={() => setView(t.id)} className={`flex-1 py-2 px-1 text-xs font-bold rounded-lg whitespace-nowrap ${view === t.id ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>{t.l}</button>
                ))}
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
                    <Input placeholder="اسم التاجر (اختياري)" value={newFeed.merchant} onChange={e => setNewFeed({...newFeed, merchant: e.target.value})} />
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

            {view === 'history' && (
                <div className="space-y-3 animate-slide-up">
                     <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2 mb-2"><History size={16}/> سجل المشتريات السابق</h3>
                     {feedRecords.length === 0 && <p className="text-center text-gray-400 py-10">لا توجد سجلات</p>}
                     {feedRecords.slice().reverse().map(rec => (
                         <div key={rec.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                             <div>
                                 <p className="font-bold text-gray-800">{rec.type} <span className="text-xs font-normal text-gray-500">({rec.quantity} {rec.unit})</span></p>
                                 <p className="text-[10px] text-gray-400">{formatDate(rec.date)} {rec.merchant && `• ${rec.merchant}`}</p>
                             </div>
                             <div className="text-left">
                                 <p className="font-bold text-amber-700">{rec.totalCost.toLocaleString()}</p>
                                 <button onClick={() => handleDelete('سجل شراء', () => setFeedRecords(feedRecords.filter(r => r.id !== rec.id)))} className="text-red-400 p-1"><Trash2 size={14}/></button>
                             </div>
                         </div>
                     ))}
                </div>
            )}
        </div>
    );
  };
  
  // Cows, Milk, Sales Logic (Kept concise)
  const CowsView = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ id: null, name: '', tag: '', status: 'milking', birthDate: '', calvings: 0, inseminationDate: '' });
    const [showHealthModal, setShowHealthModal] = useState(false);
    const [selectedCow, setSelectedCow] = useState(null);
    const [healthForm, setHealthForm] = useState({ type: 'treatment', description: '', cost: '', withdrawalDays: 0, date: new Date().toISOString().split('T')[0] });

    const saveCow = () => { if (!form.tag) return showNotify("رقم البقرة مطلوب!"); if(isEditing) setCows(cows.map(c=>c.id===form.id?form:c)); else setCows([...cows, {...form, id:Date.now()}]); setIsEditing(false); setForm({id:null, name:'', tag:'', status:'milking', birthDate:'', calvings:0, inseminationDate:''}); };
    const saveHealth = () => { if(!healthForm.description) return; setHealthRecords([...healthRecords, {...healthForm, id:Date.now(), cowId:selectedCow.id}]); setHealthForm({ type: 'treatment', description: '', cost: '', withdrawalDays: 0, date: new Date().toISOString().split('T')[0] }); showNotify("تم حفظ السجل الطبي"); };
    
    return (
      <div className="space-y-4 pb-20">
         <Card className={isEditing ? "border-blue-400 border-2" : ""}>
            <div className="flex gap-2 mb-2"><Input placeholder="الرقم" value={form.tag} onChange={e=>setForm({...form, tag:e.target.value})}/><Input placeholder="الاسم" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/></div>
            <Input type="date" label="تاريخ آخر تلقيح (للحساب التلقائي)" value={form.inseminationDate} onChange={e=>setForm({...form, inseminationDate:e.target.value})}/>
            <Button onClick={saveCow} className="w-full">{isEditing ? 'تحديث' : 'إضافة بقرة'}</Button>
         </Card>
         <div className="space-y-2">{cows.map(cow => {
             const isPregnant = !!cow.inseminationDate;
             return (
             <div key={cow.id} className="bg-white p-4 rounded-xl shadow-sm border relative flex justify-between">
                 <div>
                     <p className="font-bold">#{cow.tag} {cow.name} {isPregnant && <span className="text-[10px] bg-purple-100 text-purple-700 px-1 rounded">عشار</span>}</p>
                     <p className="text-xs text-gray-400">{cow.status === 'milking' ? 'حلابة' : 'جافة'} • {isPregnant ? `ولادة: ${formatDate(addDays(cow.inseminationDate, 283))}` : 'غير ملقحة'}</p>
                 </div>
                 <div className="flex gap-2">
                     <button onClick={()=>{setSelectedCow(cow); setShowHealthModal(true)}} className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Stethoscope size={16}/></button>
                     <button onClick={()=>{setForm(cow); setIsEditing(true); window.scrollTo({top:0, behavior:'smooth'})}} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Edit2 size={16}/></button>
                     <button onClick={()=>handleDelete('البقرة', ()=>setCows(cows.filter(c=>c.id!==cow.id)))} className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 size={16}/></button>
                 </div>
             </div>
         )})}</div>
         <Modal isOpen={showHealthModal} onClose={()=>setShowHealthModal(false)} title={`السجل الطبي #${selectedCow?.tag}`}>
             <div className="space-y-3">
                 <div className="bg-gray-50 p-3 rounded-xl space-y-2">
                     <select className="w-full p-2 rounded border" value={healthForm.type} onChange={e=>setHealthForm({...healthForm, type:e.target.value})}><option value="treatment">علاج</option><option value="vaccine">تطعيم</option></select>
                     <Input placeholder="وصف العلاج" value={healthForm.description} onChange={e=>setHealthForm({...healthForm, description:e.target.value})}/>
                     <div className="flex gap-2"><Input placeholder="التكلفة" type="number" value={healthForm.cost} onChange={e=>setHealthForm({...healthForm, cost:e.target.value})}/><Input placeholder="فترة السحب (أيام)" type="number" value={healthForm.withdrawalDays} onChange={e=>setHealthForm({...healthForm, withdrawalDays:e.target.value})}/></div>
                     <Button onClick={saveHealth} className="w-full">حفظ</Button>
                 </div>
                 <div className="max-h-40 overflow-y-auto space-y-2">
                     {healthRecords.filter(h=>h.cowId===selectedCow?.id).map(h=>(<div key={h.id} className="text-xs bg-white border p-2 rounded flex justify-between"><span>{h.description}</span><span className="font-bold">{h.cost} ج.س</span></div>))}
                 </div>
             </div>
         </Modal>
      </div>
    );
  };

  const MilkView = () => {
    const [record, setRecord] = useState({ id: null, amount: '', session: 'morning', date: new Date().toISOString().split('T')[0] });
    const save = () => { if(!record.amount) return; setMilkRecords([{...record, id:Date.now()}, ...milkRecords]); setRecord({...record, amount:''}); showNotify("تم الحفظ"); };
    return (
      <div className="space-y-4 pb-20">
         <Card className="border-t-4 border-indigo-500">
             <div className="flex gap-2 mb-2"><input type="date" className="bg-gray-100 rounded-lg p-2 flex-1 font-bold text-sm" value={record.date} onChange={e=>setRecord({...record, date:e.target.value})}/>
             <div className="flex bg-gray-100 rounded-lg p-1 flex-1"><button onClick={()=>setRecord({...record, session:'morning'})} className={`flex-1 rounded text-xs font-bold ${record.session==='morning'?'bg-white shadow text-amber-600':'text-gray-400'}`}>صباح</button><button onClick={()=>setRecord({...record, session:'evening'})} className={`flex-1 rounded text-xs font-bold ${record.session==='evening'?'bg-white shadow text-indigo-900':'text-gray-400'}`}>مساء</button></div></div>
             <input type="number" placeholder="0" className="w-full text-center text-4xl font-bold text-indigo-900 bg-transparent outline-none" value={record.amount} onChange={e=>setRecord({...record, amount:e.target.value})}/><span className="block text-center text-gray-400 text-xs mt-1 font-bold">رطل</span>
             <Button onClick={save} className="w-full mt-3 bg-indigo-600">تسجيل</Button>
         </Card>
         <div className="space-y-2">{milkRecords.slice(0,10).map(r=>(<div key={r.id} className="bg-white p-3 rounded-xl shadow-sm flex justify-between items-center"><span className="font-bold text-indigo-900">{r.amount} رطل</span><span className="text-xs text-gray-400">{formatDate(r.date)} • {r.session==='morning'?'☀️':'🌙'}</span><button onClick={()=>handleDelete('سجل', ()=>setMilkRecords(milkRecords.filter(x=>x.id!==r.id)))} className="text-red-400"><Trash2 size={14}/></button></div>))}</div>
      </div>
    );
  };

  const SalesManager = () => {
    const [newSale, setNewSale] = useState({ customerId: '', amount: '', price: '500', paid: '', date: new Date().toISOString().split('T')[0] });
    const save = () => { if(!newSale.customerId || !newSale.amount) return; const total = newSale.amount * newSale.price; const paid = newSale.paid===''?total:newSale.paid; setSales([{...newSale, total, paid, debt:total-paid, id:Date.now()}, ...sales]); setNewSale({...newSale, amount:'', paid:''}); showNotify("تم البيع"); };
    return (
      <div className="space-y-4 pb-20">
         <Card>
             <div className="flex gap-2 mb-2"><select className="flex-1 p-3 bg-gray-50 rounded-xl" value={newSale.customerId} onChange={e=>setNewSale({...newSale, customerId:e.target.value})}><option value="">اختر عميل...</option>{customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><button onClick={()=>{const n=prompt("اسم العميل"); if(n) setCustomers([...customers, {id:Date.now(), name:n}])}} className="bg-blue-100 p-3 rounded-xl"><Plus/></button></div>
             <div className="flex gap-2"><Input placeholder="الكمية" type="number" value={newSale.amount} onChange={e=>setNewSale({...newSale, amount:e.target.value})}/><Input placeholder="السعر" type="number" value={newSale.price} onChange={e=>setNewSale({...newSale, price:e.target.value})}/></div>
             <Input placeholder="المدفوع (اتركه فارغاً إذا دفع بالكامل)" type="number" value={newSale.paid} onChange={e=>setNewSale({...newSale, paid:e.target.value})}/>
             <Button onClick={save} className="w-full">إتمام البيع</Button>
         </Card>
         <div className="space-y-2">{sales.slice(0,10).map(s=>(<div key={s.id} className="bg-white p-3 rounded-xl shadow-sm flex justify-between"><div><span className="font-bold">{customers.find(c=>c.id==s.customerId)?.name}</span><span className="text-xs block text-gray-400">{s.amount} رطل • {formatDate(s.date)}</span></div><div className="text-left"><span className="block font-bold text-blue-900">{s.total}</span>{s.debt>0 && <span className="text-xs text-red-500 bg-red-50 px-1 rounded">باقي: {s.debt}</span>}</div></div>))}</div>
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
