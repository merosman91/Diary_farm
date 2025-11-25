import React, { useState, useEffect } from 'react';
import { Milk, DollarSign, Users, Activity, Trash2, Plus, Edit2, Share2, X, Wheat, TrendingUp, TrendingDown, Calendar, Heart, AlertTriangle, Download, History, BarChart3, PieChart, BellRing, Phone } from 'lucide-react';

// --- أدوات مساعدة ---
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

// --- المكونات ---

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

// رسم بياني محسن (يضمن ظهور آخر 7 أيام)
const ProductionChart = ({ milkRecords }) => {
    // 1. إنشاء مصفوفة بآخر 7 أيام
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last7Days.push(d.toISOString().split('T')[0]);
    }

    // 2. دمج البيانات
    const data = last7Days.map(date => {
        const amount = milkRecords
            .filter(r => r.date === date)
            .reduce((sum, r) => sum + Number(r.amount), 0);
        return { date, amount };
    });

    const maxVal = Math.max(...data.map(d => d.amount)) || 100; // تجنب القسمة على صفر

    return (
        <div className="flex items-end gap-2 h-40 mt-6 pb-2 border-b border-gray-200 px-2">
            {data.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="relative w-full flex justify-end flex-col h-full items-center">
                         {/* القيمة تظهر عند التحويم أو إذا كانت العمود كبيراً */}
                         <span className="mb-1 text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">{item.amount}</span>
                        <div 
                            style={{ height: `${(item.amount / maxVal) * 100}%` }} 
                            className={`w-full max-w-[30px] rounded-t-md transition-all duration-500 ${item.amount > 0 ? 'bg-blue-500 group-hover:bg-blue-600' : 'bg-gray-100 h-[2px]'}`}
                        ></div>
                    </div>
                    <span className="text-[9px] text-gray-500 font-bold rotate-0 truncate w-full text-center">
                        {new Date(item.date).toLocaleDateString('ar-EG', { weekday: 'short' })}
                    </span>
                </div>
            ))}
        </div>
    );
};

// --- التطبيق ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', onConfirm: () => {} });

  // إدارة البيانات
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

  const downloadBackup = () => {
    const data = { cows, milkRecords, sales, customers, feedRecords, feedConsumption, healthRecords };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `farm_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    showNotify("تم تحميل النسخة الاحتياطية 📥");
  };

  // --- الشاشات ---

  const Dashboard = () => {
    const totalMilk = milkRecords.reduce((sum, r) => sum + Number(r.amount), 0);
    const totalSales = sales.reduce((sum, s) => sum + Number(s.total), 0);
    const totalFeedCost = feedRecords.reduce((sum, f) => sum + Number(f.totalCost), 0);
    const totalHealthCost = healthRecords.reduce((sum, h) => sum + Number(h.cost || 0), 0);
    const totalExpenses = totalFeedCost + totalHealthCost;
    const netProfit = totalSales - totalExpenses;
    const pregnantCount = cows.filter(c => c.inseminationDate).length;

    // تنبيهات
    const getAlerts = () => {
      const arr = [];
      cows.forEach(cow => {
        if (cow.inseminationDate) {
           const daysToBirth = getDaysDifference(addDays(cow.inseminationDate, 283));
           if (daysToBirth >= 0 && daysToBirth <= 14) arr.push({ msg: `ولادة وشيكة: بقرة #${cow.tag}`, val: `${daysToBirth} يوم` });
        }
      });
      // فحص المخزون
      const stock = {};
      feedRecords.forEach(r => stock[r.type] = (stock[r.type] || 0) + Number(r.quantity));
      feedConsumption.forEach(r => stock[r.type] = (stock[r.type] || 0) - Number(r.quantity));
      Object.entries(stock).forEach(([type, qty]) => { if (qty <= 5) arr.push({ msg: `نفاد مخزون: ${type}`, val: `${qty} متبقي` }); });
      return arr;
    };
    const alerts = getAlerts();

    const generateFullReport = () => {
        const text = `📊 *تقرير المزرعة الشامل*
📅 التاريخ: ${new Date().toLocaleDateString('ar-EG')}

💵 *الملخص المالي:*
• المبيعات: ${totalSales.toLocaleString()} ج.س
• المصاريف (علف وعلاج): ${totalExpenses.toLocaleString()} ج.س
• *صافي الربح: ${netProfit.toLocaleString()} ج.س*

🥛 *الإنتاج:*
• إجمالي الحليب: ${totalMilk} رطل
• عدد القطيع: ${cows.length} رأس (${pregnantCount} عشار)

⚠️ *تنبيهات:*
${alerts.map(a => `- ${a.msg} (${a.val})`).join('\n') || 'لا توجد تنبيهات عاجلة'}

_تم الإنشاء عبر تطبيق مزرعتي_`;
        shareViaWhatsapp(text);
    };

    return (
      <div className="space-y-4 pb-20 animate-fade-in">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
           <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300 text-sm font-bold">صافي الأرباح</span>
              {netProfit >= 0 ? <TrendingUp className="text-emerald-400"/> : <TrendingDown className="text-rose-400"/>}
           </div>
           <p className={`text-4xl font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
             {netProfit.toLocaleString()} <span className="text-sm text-white opacity-60 font-normal">ج.س</span>
           </p>
           <div className="mt-4 flex gap-4 text-xs opacity-80 border-t border-gray-700 pt-3">
                <span className="flex items-center gap-1"><DollarSign size={12} className="text-green-400"/> دخل: {totalSales.toLocaleString()}</span>
                <span className="text-rose-300 flex items-center gap-1"><Wheat size={12}/> مصاريف: {totalExpenses.toLocaleString()}</span>
           </div>
        </div>

        {/* الرسم البياني الجديد */}
        <Card>
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2"><BarChart3 size={16} className="text-blue-500"/> إنتاج آخر 7 أيام</h3>
            </div>
            <ProductionChart milkRecords={milkRecords} />
        </Card>

        {alerts.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
             <h3 className="text-amber-800 font-bold text-sm mb-2 flex items-center gap-1"><AlertTriangle size={16}/> تنبيهات</h3>
             {alerts.map((a, i) => <div key={i} className="flex justify-between text-xs bg-white p-2 rounded mb-1 last:mb-0"><span className="font-bold">{a.msg}</span><span className="text-red-500 font-bold">{a.val}</span></div>)}
          </div>
        )}

        <div className="flex gap-2">
            <button onClick={generateFullReport} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-200"><Share2 size={16}/> تقرير واتساب شامل</button>
            <button onClick={downloadBackup} className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg"><Download size={16}/> نسخ احتياطي</button>
        </div>
      </div>
    );
  };

  const SalesManager = () => {
    const [view, setView] = useState('list'); 
    const [newSale, setNewSale] = useState({ customerId: '', amount: '', price: '500', paid: '', date: new Date().toISOString().split('T')[0] });
    
    // إصلاح منطق حفظ البيع
    const saveSale = () => { 
        if (!newSale.customerId || !newSale.amount) return showNotify("الرجاء إدخال البيانات");
        
        const amountNum = Number(newSale.amount);
        const priceNum = Number(newSale.price);
        const total = amountNum * priceNum;
        
        // إذا كان حقل المدفوع فارغاً، نعتبره دفع كامل المبلغ. إذا كان 0 نعتبره دين كامل.
        const paidNum = newSale.paid === '' ? total : Number(newSale.paid);
        const debt = total - paidNum;

        const record = {
            ...newSale, 
            id: Date.now(),
            amount: amountNum,
            price: priceNum,
            total: total,
            paid: paidNum,
            debt: debt
        };

        setSales([record, ...sales]); 
        setNewSale({ ...newSale, amount: '', paid: '' }); // تصفير الحقول المتغيرة فقط
        showNotify("تم تسجيل العملية وحساب الدين ✅");
        setView('list');
    };

    // إرسال تذكير واتساب
    const sendDebtReminder = (customerName, amount) => {
        const text = `مرحباً عزيزي *${customerName}*، 
نود تذكيركم بأن إجمالي المبلغ المتبقي عليكم لمزرعتنا هو: *${amount.toLocaleString()} ج.س*.
نرجو التكرم بالسداد في أقرب وقت. شكراً.`;
        shareViaWhatsapp(text);
    };

    return (
      <div className="space-y-4 pb-20">
        <div className="flex p-1 bg-gray-200 rounded-xl"> 
            <button onClick={() => setView('list')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${view === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>السجل</button> 
            <button onClick={() => setView('debts')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${view === 'debts' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>الديون ({sales.reduce((sum, s)=>sum+s.debt,0).toLocaleString()})</button> 
        </div>

        {view === 'list' && ( 
            <> 
            <Button onClick={() => setView('new')} className="w-full"><Plus size={18} /> بيع جديد</Button> 
            {view === 'new' && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                 <Card className="w-full max-w-sm animate-scale-up relative">
                    <button onClick={()=>setView('list')} className="absolute left-4 top-4 p-1 bg-gray-100 rounded-full"><X size={20}/></button>
                    <h3 className="font-bold mb-4 text-lg">عملية بيع جديدة</h3>
                    <div className="flex gap-2 mb-3"> 
                        <select className="w-full p-3 bg-gray-50 border rounded-xl" value={newSale.customerId} onChange={e => setNewSale({...newSale, customerId: e.target.value})}> 
                            <option value="">اختر العميل...</option> 
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)} 
                        </select> 
                        <button onClick={() => {const n = prompt("اسم العميل الجديد:"); if(n) setCustomers([...customers, {id:Date.now(), name:n}])}} className="bg-blue-100 text-blue-600 p-3 rounded-xl"><Plus/></button> 
                    </div> 
                    <div className="flex gap-2">
                        <Input label="الكمية" type="number" value={newSale.amount} onChange={e => setNewSale({...newSale, amount: e.target.value})} /> 
                        <Input label="السعر" type="number" value={newSale.price} onChange={e => setNewSale({...newSale, price: e.target.value})} /> 
                    </div>
                    <div className="bg-blue-50 p-2 rounded mb-2 text-center text-blue-800 font-bold text-sm">الإجمالي: {(Number(newSale.amount)*Number(newSale.price)).toLocaleString()} ج.س</div>
                    <Input label="المبلغ المدفوع (اتركه فارغاً إذا سدد بالكامل)" type="number" value={newSale.paid} onChange={e => setNewSale({...newSale, paid: e.target.value})} /> 
                    <Button onClick={saveSale} className="w-full">حفظ</Button> 
                 </Card>
                </div>
            )}
            
            <div className="space-y-3 mt-4"> 
                {sales.length === 0 && <p className="text-center text-gray-400 py-10">لا توجد مبيعات</p>}
                {sales.slice(0, 15).map(sale => ( 
                    <div key={sale.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start"> 
                        <div> 
                            <p className="font-bold text-gray-800">{customers.find(c => c.id == sale.customerId)?.name}</p> 
                            <p className="text-xs text-gray-400 mt-1">{formatDate(sale.date)} • {sale.amount} رطل</p> 
                        </div> 
                        <div className="text-left"> 
                            <p className="font-bold text-blue-900">{sale.total.toLocaleString()}</p> 
                            {sale.debt > 0 ? 
                                <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded font-bold mt-1 inline-block">عليه: {sale.debt}</span> : 
                                <span className="text-[10px] bg-green-100 text-green-600 px-2 py-1 rounded font-bold mt-1 inline-block">خالص</span>
                            } 
                        </div> 
                    </div> 
                ))} 
            </div> 
            </> 
        )}

        {view === 'debts' && (
           <Card> 
               <h3 className="font-bold mb-4 border-b pb-2">قائمة المديونيات</h3>
               {customers.map(c => { 
                   const debt = sales.filter(s => s.customerId == c.id).reduce((sum, s) => sum + s.debt, 0); 
                   if (debt <= 0) return null;
                   return (
                       <div key={c.id} className="flex justify-between items-center py-3 border-b last:border-0"> 
                           <div>
                               <p className="font-bold text-gray-800">{c.name}</p>
                               <p className="text-sm font-bold text-rose-600">{debt.toLocaleString()} ج.س</p>
                           </div>
                           <div className="flex gap-2">
                               <button onClick={() => window.open(`tel:`)} className="p-2 bg-gray-100 text-gray-600 rounded-lg"><Phone size={18}/></button>
                               <button onClick={() => sendDebtReminder(c.name, debt)} className="p-2 bg-green-100 text-green-600 rounded-lg flex items-center gap-1 font-bold text-xs"><BellRing size={16}/> تذكير</button>
                           </div>
                       </div> 
                   ) 
               })} 
               {customers.every(c => sales.filter(s => s.customerId == c.id).reduce((sum, s) => sum + s.debt, 0) <= 0) && <p className="text-center text-gray-400">لا توجد ديون مستحقة 🎉</p>}
           </Card>
        )}
      </div>
    );
  };

  const FeedManager = () => {
    const [view, setView] = useState('stock'); 
    const [newFeed, setNewFeed] = useState({ id: null, type: '', quantity: '', unit: 'جوال', price: '', merchant: '', date: new Date().toISOString().split('T')[0] });
    const [consumption, setConsumption] = useState({ type: '', quantity: '', date: new Date().toISOString().split('T')[0] });

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
            <div className="flex bg-gray-200 p-1 rounded-xl overflow-x-auto">
                {[{id:'stock', l:'المخزون'}, {id:'buy', l:'شراء'}, {id:'use', l:'استهلاك'}, {id:'history', l:'السجل'}].map(t => (
                    <button key={t.id} onClick={() => setView(t.id)} className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg whitespace-nowrap ${view === t.id ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>{t.l}</button>
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
                    <h3 className="font-bold mb-3 flex items-center gap-2 text-orange-700"><Users size={18}/> تسجيل استهلاك يومي</h3>
                    <div className="mb-3">
                        <label className="block text-xs font-bold text-gray-400 mb-1">نوع العلف</label>
                        <select className="w-full p-3 bg-gray-50 rounded-xl border" value={consumption.type} onChange={e => setConsumption({...consumption, type: e.target.value})}>
                            <option value="">اختر النوع...</option>
                            {getStock().map(s => <option key={s.type} value={s.type}>{s.type} (متوفر: {s.qty})</option>)}
                        </select>
                    </div>
                    <Input placeholder="الكمية المستهلكة" type="number" value={consumption.quantity} onChange={e => setConsumption({...consumption, quantity: e.target.value})} />
                    <Button onClick={handleConsume} className="w-full bg-orange-600 hover:bg-orange-700 text-white">خصم من المخزون</Button>
                </Card>
            )}

            {view === 'history' && (
                 <div className="space-y-3 animate-slide-up">
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
  
  // Cows & Milk (مختصرة للحفاظ على الحجم)
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
            <Input type="date" label="تاريخ آخر تلقيح" value={form.inseminationDate} onChange={e=>setForm({...form, inseminationDate:e.target.value})}/>
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
                     <button onClick={()=>{setSelectedCow(cow); setShowHealthModal(true)}} className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Heart size={16}/></button>
                     <button onClick={()=>{setForm(cow); setIsEditing(true); window.scrollTo({top:0, behavior:'smooth'})}} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Edit2 size={16}/></button>
                     <button onClick={()=>handleDelete('البقرة', ()=>setCows(cows.filter(c=>c.id!==cow.id)))} className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 size={16}/></button>
                 </div>
             </div>
         )})}</div>
         <Modal isOpen={showHealthModal} onClose={()=>setShowHealthModal(false)} title={`السجل الطبي #${selectedCow?.tag}`}>
             <div className="space-y-3">
                 <div className="bg-gray-50 p-3 rounded-xl space-y-2">
                     <select className="w-full p-2 rounded border" value={healthForm.type} onChange={e=>setHealthForm({...healthForm, type:e.target.value})}><option value="treatment">علاج</option><option value="vaccine">تطعيم</option></select>
                     <Input placeholder="الوصف" value={healthForm.description} onChange={e=>setHealthForm({...healthForm, description:e.target.value})}/>
                     <div className="flex gap-2"><Input placeholder="التكلفة" type="number" value={healthForm.cost} onChange={e=>setHealthForm({...healthForm, cost:e.target.value})}/><Input placeholder="سحب (أيام)" type="number" value={healthForm.withdrawalDays} onChange={e=>setHealthForm({...healthForm, withdrawalDays:e.target.value})}/></div>
                     <Button onClick={saveHealth} className="w-full">حفظ</Button>
                 </div>
                 <div className="max-h-40 overflow-y-auto space-y-2">
                     {healthRecords.filter(h=>h.cowId===selectedCow?.id).map(h=>(<div key={h.id} className="text-xs bg-white border p-2 rounded flex justify-between"><span>{h.description}</span><span className="font-bold">{h.cost}</span></div>))}
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
