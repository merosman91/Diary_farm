import React, { useState, useEffect } from 'react';
import { Milk, DollarSign, Users, Activity, Trash2, Plus, Edit2, Share2, Wheat, TrendingUp, TrendingDown, Heart, AlertTriangle, Download, BarChart3, Phone, Stethoscope, BellRing, User, MapPin, Calendar, FileText } from 'lucide-react';
// تأكد أن ملف UI.jsx موجود في نفس المجلد
import { Button, Card, Input, Modal, ProductionChart, formatDate, addDays, getDaysDifference } from './UI';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', onConfirm: () => {} });

  // --- تهيئة البيانات ---
  const [cows, setCows] = useState(() => JSON.parse(localStorage.getItem('cows')) || []);
  const [milkRecords, setMilkRecords] = useState(() => JSON.parse(localStorage.getItem('milkRecords')) || []);
  const [sales, setSales] = useState(() => JSON.parse(localStorage.getItem('sales')) || []);
  const [customers, setCustomers] = useState(() => JSON.parse(localStorage.getItem('customers')) || []);
  const [feedRecords, setFeedRecords] = useState(() => JSON.parse(localStorage.getItem('feedRecords')) || []); 
  const [feedConsumption, setFeedConsumption] = useState(() => JSON.parse(localStorage.getItem('feedConsumption')) || []); 
  const [healthRecords, setHealthRecords] = useState(() => JSON.parse(localStorage.getItem('healthRecords')) || []); 

  // --- الحفظ التلقائي ---
  useEffect(() => {
    localStorage.setItem('cows', JSON.stringify(cows));
    localStorage.setItem('milkRecords', JSON.stringify(milkRecords));
    localStorage.setItem('customers', JSON.stringify(customers));
    localStorage.setItem('sales', JSON.stringify(sales));
    localStorage.setItem('feedRecords', JSON.stringify(feedRecords));
    localStorage.setItem('feedConsumption', JSON.stringify(feedConsumption));
    localStorage.setItem('healthRecords', JSON.stringify(healthRecords));
  }, [cows, milkRecords, customers, sales, feedRecords, feedConsumption, healthRecords]);

  // --- وظائف عامة ---
  const showNotify = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };
  const handleDelete = (title, action) => { setConfirmDialog({ isOpen: true, title: `حذف ${title}؟`, onConfirm: () => { action(); setConfirmDialog({ ...confirmDialog, isOpen: false }); showNotify("تم الحذف"); } }); };
  const shareViaWhatsapp = (text) => window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  
  const downloadBackup = () => {
    const data = { cows, milkRecords, sales, customers, feedRecords, feedConsumption, healthRecords };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const a = document.createElement('a'); a.href = dataStr; a.download = `farm_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a); a.click(); a.remove(); showNotify("تم حفظ النسخة الاحتياطية");
  };

  // --- 1. Dashboard ---
  const Dashboard = () => {
    const totalMilk = milkRecords.reduce((sum, r) => sum + Number(r.amount), 0);
    const totalSales = sales.reduce((sum, s) => sum + Number(s.total), 0);
    const totalExpenses = feedRecords.reduce((sum, f) => sum + Number(f.totalCost), 0) + healthRecords.reduce((sum, h) => sum + Number(h.cost || 0), 0);
    const netProfit = totalSales - totalExpenses;
    
    const alerts = [];
    cows.forEach(cow => {
        if(cow.inseminationDate) {
            const daysToBirth = getDaysDifference(addDays(cow.inseminationDate, 283));
            if(daysToBirth >= 0 && daysToBirth <= 14) alerts.push({msg: `ولادة وشيكة: ${cow.tag}`, val: `${daysToBirth} يوم`});
        }
    });
    // Stock Alerts
    const stock = {}; 
    feedRecords.forEach(r => stock[r.type] = (stock[r.type]||0) + Number(r.quantity));
    feedConsumption.forEach(r => stock[r.type] = (stock[r.type]||0) - Number(r.quantity));
    Object.entries(stock).forEach(([t, q]) => { if(q<=5) alerts.push({msg:`نقص مخزون: ${t}`, val:`${q} متبقي`}) });

    return (
      <div className="space-y-4 pb-20 animate-fade-in">
        <div className="bg-gray-900 rounded-2xl p-5 text-white shadow-xl">
           <div className="flex justify-between items-center mb-2"><span className="text-gray-400 text-xs font-bold">صافي الربح</span>{netProfit>=0?<TrendingUp className="text-green-400"/>:<TrendingDown className="text-red-400"/>}</div>
           <p className={`text-4xl font-bold ${netProfit>=0?'text-green-400':'text-red-400'}`}>{netProfit.toLocaleString()}<span className="text-sm text-white opacity-50">ج.س</span></p>
           <div className="mt-4 flex gap-4 text-xs opacity-70 border-t border-gray-700 pt-3">
                <span>💰 مبيعات: {totalSales.toLocaleString()}</span><span>🌾 مصاريف: {totalExpenses.toLocaleString()}</span>
           </div>
        </div>

        {alerts.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
             <h3 className="text-amber-800 font-bold text-xs mb-2 flex items-center gap-1"><AlertTriangle size={14}/> تنبيهات عاجلة</h3>
             {alerts.map((a, i) => <div key={i} className="flex justify-between text-xs bg-white p-2 rounded mb-1 last:mb-0"><span className="font-bold">{a.msg}</span><span className="text-red-500 font-bold">{a.val}</span></div>)}
          </div>
        )}

        <Card>
            <h3 className="font-bold text-gray-700 text-xs flex items-center gap-2 mb-2"><BarChart3 size={16} className="text-blue-500"/> الإنتاج (آخر 7 أيام)</h3>
            <ProductionChart milkRecords={milkRecords} />
        </Card>

        <div className="flex gap-2">
            <button onClick={downloadBackup} className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1"><Download size={14}/> نسخ احتياطي</button>
            <button onClick={() => shareViaWhatsapp(`تقرير المزرعة:\nالربح: ${netProfit}\nالإنتاج: ${totalMilk}`)} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1"><Share2 size={14}/> واتساب</button>
        </div>
      </div>
    );
  };

  // --- 2. Cows Manager ---
  const CowsManager = () => {
    const [view, setView] = useState('list');
    const [form, setForm] = useState({ id: null, name: '', tag: '', status: 'milking', birthDate: '', calvings: 0, inseminationDate: '' });
    const [showHealth, setShowHealth] = useState(false);
    const [selectedCow, setSelectedCow] = useState(null);
    const [healthForm, setHealthForm] = useState({ type: 'treatment', description: '', cost: '', withdrawalDays: 0, date: new Date().toISOString().split('T')[0] });

    const saveCow = () => {
        if(!form.tag) return showNotify("الرقم مطلوب");
        if(form.id) setCows(cows.map(c => c.id === form.id ? form : c));
        else setCows([...cows, { ...form, id: Date.now() }]);
        setForm({ id: null, name: '', tag: '', status: 'milking', birthDate: '', calvings: 0, inseminationDate: '' });
        setView('list'); showNotify("تم الحفظ");
    };

    const saveHealth = () => {
        if(!healthForm.description) return;
        setHealthRecords([...healthRecords, { ...healthForm, id: Date.now(), cowId: selectedCow.id }]);
        setHealthForm({ type: 'treatment', description: '', cost: '', withdrawalDays: 0, date: new Date().toISOString().split('T')[0] });
        showNotify("تم تسجيل العلاج");
    };

    const checkWithdrawal = (cowId) => {
        const active = healthRecords.filter(r => r.cowId === cowId && Number(r.withdrawalDays) > 0);
        for(let r of active) {
            const left = getDaysDifference(addDays(r.date, r.withdrawalDays));
            if(left > 0) return left;
        }
        return 0;
    };

    return (
      <div className="space-y-4 pb-20">
        {view === 'list' && (
            <>
            <Button onClick={() => setView('form')} className="w-full"><Plus size={18}/> إضافة بقرة</Button>
            <div className="space-y-3 mt-4">
                {cows.map(cow => {
                    const isPregnant = !!cow.inseminationDate;
                    const withdrawal = checkWithdrawal(cow.id);
                    return (
                        <div key={cow.id} className={`bg-white p-4 rounded-xl shadow-sm border relative ${withdrawal > 0 ? 'border-red-500 bg-red-50' : 'border-gray-100'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-800">#{cow.tag} {cow.name}</p>
                                    <div className="text-xs text-gray-500 mt-1 flex flex-col gap-1">
                                        <span>{cow.status === 'milking' ? '🟢 حلابة' : '🔴 جافة'}</span>
                                        {isPregnant && <span className="text-purple-600 font-bold">🟣 عشار (ولادة: {formatDate(addDays(cow.inseminationDate, 283))})</span>}
                                        {withdrawal > 0 && <span className="text-red-600 font-bold">⚠️ فترة سحب: باقي {withdrawal} يوم</span>}
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => {setSelectedCow(cow); setShowHealth(true)}} className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Stethoscope size={16}/></button>
                                    <button onClick={() => {setForm(cow); setView('form')}} className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Edit2 size={16}/></button>
                                    <button onClick={() => handleDelete('البقرة', () => setCows(cows.filter(c => c.id !== cow.id)))} className="p-2 bg-red-100 text-red-600 rounded-lg"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            </>
        )}
        {view === 'form' && (
            <Card>
                <div className="flex justify-between mb-4"><h3 className="font-bold">بيانات البقرة</h3><button onClick={()=>setView('list')} className="text-red-500 text-xs">إلغاء</button></div>
                <div className="flex gap-2"><Input label="الرقم" value={form.tag} onChange={e=>setForm({...form, tag:e.target.value})}/><Input label="الاسم" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/></div>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 mb-3">
                    <label className="text-xs font-bold text-purple-800 mb-1 block">بيانات التناسل</label>
                    <Input type="date" label="تاريخ التلقيح" value={form.inseminationDate} onChange={e=>setForm({...form, inseminationDate:e.target.value})}/>
                </div>
                <div className="flex gap-2 mb-3">
                   {['milking','dry'].map(s=><button key={s} onClick={()=>setForm({...form, status:s})} className={`flex-1 py-2 text-xs font-bold rounded border ${form.status===s?'bg-blue-600 text-white':'bg-white text-gray-500'}`}>{s==='milking'?'حلابة':'جافة'}</button>)}
                </div>
                <Button onClick={saveCow} className="w-full">حفظ</Button>
            </Card>
        )}
        <Modal isOpen={showHealth} onClose={() => setShowHealth(false)} title={`السجل الطبي #${selectedCow?.tag}`}>
             <div className="space-y-3">
                 <div className="bg-gray-50 p-3 rounded-xl space-y-2">
                     <select className="w-full p-2 rounded border" value={healthForm.type} onChange={e=>setHealthForm({...healthForm, type:e.target.value})}><option value="treatment">علاج</option><option value="vaccine">تطعيم</option></select>
                     <Input placeholder="الاسم" value={healthForm.description} onChange={e=>setHealthForm({...healthForm, description:e.target.value})}/>
                     <div className="flex gap-2"><Input placeholder="التكلفة" type="number" value={healthForm.cost} onChange={e=>setHealthForm({...healthForm, cost:e.target.value})}/><Input placeholder="سحب (أيام)" type="number" value={healthForm.withdrawalDays} onChange={e=>setHealthForm({...healthForm, withdrawalDays:e.target.value})}/></div>
                     <Button onClick={saveHealth} className="w-full py-2">تسجيل</Button>
                 </div>
                 <div className="max-h-40 overflow-y-auto space-y-2">
                     {healthRecords.filter(h=>h.cowId===selectedCow?.id).map(h=>(<div key={h.id} className="text-xs bg-white border p-2 rounded flex justify-between"><span>{h.description}</span><span className="font-bold">{h.cost} ج.س</span></div>))}
                 </div>
             </div>
        </Modal>
      </div>
    );
  };

  // --- 3. Sales Manager ---
  const SalesManager = () => {
    const [view, setView] = useState('list');
    const [newSale, setNewSale] = useState({ customerId: '', amount: '', price: '500', paid: '', date: new Date().toISOString().split('T')[0] });
    
    const addCustomer = () => {
        const name = prompt("اسم العميل:"); if (!name) return;
        const phone = prompt("رقم الهاتف (اختياري):"); setCustomers([...customers, { id: Date.now(), name, phone }]);
    };

    const saveSale = () => {
        if(!newSale.customerId || !newSale.amount) return showNotify("البيانات ناقصة");
        const total = Number(newSale.amount) * Number(newSale.price);
        const paid = newSale.paid === '' ? total : Number(newSale.paid);
        const record = { ...newSale, total, paid, debt: total - paid, id: Date.now() };
        setSales([record, ...sales]); setNewSale({ ...newSale, amount: '', paid: '' }); setView('list'); showNotify("تم البيع");
    };

    return (
      <div className="space-y-4 pb-20">
         <div className="flex p-1 bg-gray-200 rounded-xl">
            {['list','new','debts'].map(t => <button key={t} onClick={() => setView(t)} className={`flex-1 py-2 text-xs font-bold rounded-lg ${view === t ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>{t==='list'?'السجل':t==='new'?'بيع':'الديون'}</button>)}
         </div>

         {view === 'new' && (
             <Card className="animate-slide-up">
                 <h3 className="font-bold mb-4">تسجيل بيع</h3>
                 <div className="flex gap-2 mb-3">
                     <select className="flex-1 p-3 bg-gray-50 border rounded-xl" value={newSale.customerId} onChange={e => setNewSale({...newSale, customerId: e.target.value})}>
                         <option value="">اختر العميل...</option>
                         {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                     </select>
                     <button onClick={addCustomer} className="bg-blue-100 text-blue-600 p-3 rounded-xl"><Plus/></button>
                 </div>
                 <div className="flex gap-2"><Input label="الكمية" type="number" value={newSale.amount} onChange={e => setNewSale({...newSale, amount: e.target.value})} /><Input label="السعر" type="number" value={newSale.price} onChange={e => setNewSale({...newSale, price: e.target.value})} /></div>
                 <div className="text-center font-bold text-blue-800 mb-2">الإجمالي: {(Number(newSale.amount) * Number(newSale.price)).toLocaleString()}</div>
                 <Input label="المدفوع" type="number" value={newSale.paid} onChange={e => setNewSale({...newSale, paid: e.target.value})} />
                 <Button onClick={saveSale} className="w-full">حفظ</Button>
             </Card>
         )}

         {view === 'list' && (
             <div className="space-y-3">
                 {sales.slice(0, 20).map(sale => (
                     <div key={sale.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                         <div><p className="font-bold text-gray-800">{customers.find(c => c.id == sale.customerId)?.name}</p><p className="text-xs text-gray-400">{formatDate(sale.date)} • {sale.amount} رطل</p></div>
                         <div className="text-left"><p className="font-bold text-blue-900">{sale.total.toLocaleString()}</p>{sale.debt > 0 && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded">عليه: {sale.debt}</span>}</div>
                     </div>
                 ))}
             </div>
         )}

         {view === 'debts' && (
             <Card>
                 <h3 className="font-bold mb-3 border-b pb-2">المتأخرات</h3>
                 {customers.map(c => {
                     const debt = sales.filter(s => s.customerId == c.id).reduce((sum, s) => sum + s.debt, 0);
                     if (debt <= 0) return null;
                     return (
                         <div key={c.id} className="flex justify-between items-center py-3 border-b last:border-0">
                             <div><p className="font-bold text-gray-800">{c.name}</p><p className="text-sm font-bold text-red-600">{debt.toLocaleString()} ج.س</p></div>
                             <div className="flex gap-2">
                                 {c.phone && <a href={`tel:${c.phone}`} className="p-2 bg-gray-100 text-gray-600 rounded-lg"><Phone size={16}/></a>}
                                 <button onClick={() => shareViaWhatsapp(`مرحباً ${c.name}، المتبقي عليكم: ${debt} ج.س`)} className="p-2 bg-green-100 text-green-600 rounded-lg"><BellRing size={16}/></button>
                             </div>
                         </div>
                     )
                 })}
             </Card>
         )}
      </div>
    );
  };

  // --- 4. Milk View ---
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

  // --- 5. Feed Manager (المعدل بالكامل) ---
  const FeedManager = () => {
    const [view, setView] = useState('stock'); 
    const [newFeed, setNewFeed] = useState({ type: 'ردة', quantity: '', unit: 'جوال', price: '', merchantName: '', merchantLoc: '', merchantPhone: '', date: new Date().toISOString().split('T')[0] });
    const [consumption, setConsumption] = useState({ type: '', quantity: '', date: new Date().toISOString().split('T')[0] });

    const UNITS = ['جوال', 'قنطار', 'طن', 'كيلو جرام', 'قيراط'];
    const FEED_TYPES = ['ردة', 'مركزات', 'برسيم', 'سيلاج', 'مولاس', 'أملاح', 'ذرة', 'أخرى'];

    // حساب المخزون (تجميع حسب النوع)
    const getStock = () => {
        const stock = {};
        const units = {}; // لتذكر وحدة كل نوع للعرض
        feedRecords.forEach(r => {
             stock[r.type] = (stock[r.type] || 0) + Number(r.quantity);
             if(!units[r.type]) units[r.type] = r.unit; 
        });
        feedConsumption.forEach(r => stock[r.type] = (stock[r.type] || 0) - Number(r.quantity));
        return Object.entries(stock).map(([type, qty]) => ({ type, qty, unit: units[type] || 'وحدة' }));
    };

    const handleBuy = () => {
        if (!newFeed.quantity || !newFeed.price) return showNotify("أكمل البيانات");
        setFeedRecords([...feedRecords, { ...newFeed, id: Date.now(), totalCost: Number(newFeed.price) * Number(newFeed.quantity) }]);
        setNewFeed({ ...newFeed, quantity: '', price: '', date: new Date().toISOString().split('T')[0] }); 
        showNotify("تم الشراء"); setView('stock');
    };

    const handleConsume = () => {
        if (!consumption.type || !consumption.quantity) return;
        setFeedConsumption([...feedConsumption, { ...consumption, id: Date.now() }]);
        setConsumption({ type: '', quantity: '', date: new Date().toISOString().split('T')[0] }); 
        showNotify("تم الاستهلاك"); setView('stock');
    };

    return (
        <div className="space-y-4 pb-20">
            <div className="flex bg-gray-200 p-1 rounded-xl overflow-x-auto">
                {[{id:'stock', l:'المخزون'}, {id:'buy', l:'شراء'}, {id:'use', l:'استهلاك'}, {id:'report', l:'التقارير'}].map(t => (
                    <button key={t.id} onClick={() => setView(t.id)} className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg whitespace-nowrap ${view === t.id ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>{t.l}</button>
                ))}
            </div>

            {view === 'stock' && (
                <div className="grid grid-cols-2 gap-3">
                    {getStock().map((item, i) => (
                        <Card key={i} className="text-center py-4 border-t-4 border-t-amber-500">
                            <Wheat size={24} className="mx-auto text-amber-500 mb-2"/>
                            <h3 className="font-bold text-gray-800">{item.type}</h3>
                            <p className="text-2xl font-bold text-blue-600">{item.qty}</p>
                            <span className="text-xs text-gray-500 font-bold bg-gray-100 px-2 rounded">{item.unit}</span>
                        </Card>
                    ))}
                    {getStock().length === 0 && <p className="col-span-2 text-center text-gray-400 py-10">المخزن فارغ</p>}
                </div>
            )}

            {view === 'buy' && (
                <Card className="animate-slide-up">
                    <h3 className="font-bold mb-3 flex items-center gap-2 text-green-700"><Plus size={18}/> شراء علف جديد</h3>
                    <div className="flex gap-2 mb-2">
                        <select className="flex-1 p-3 bg-gray-50 border rounded-xl" value={newFeed.type} onChange={e=>setNewFeed({...newFeed, type:e.target.value})}>
                            {FEED_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                        </select>
                        <select className="flex-1 p-3 bg-gray-50 border rounded-xl" value={newFeed.unit} onChange={e=>setNewFeed({...newFeed, unit:e.target.value})}>
                            {UNITS.map(u=><option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-2 mb-2"><Input placeholder="الكمية" type="number" value={newFeed.quantity} onChange={e=>setNewFeed({...newFeed, quantity:e.target.value})}/><Input placeholder="سعر الوحدة" type="number" value={newFeed.price} onChange={e=>setNewFeed({...newFeed, price:e.target.value})}/></div>
                    
                    <div className="bg-gray-50 p-2 rounded-lg mb-2">
                        <p className="text-xs font-bold text-gray-400 mb-1">بيانات التاجر</p>
                        <Input placeholder="اسم التاجر" value={newFeed.merchantName} onChange={e=>setNewFeed({...newFeed, merchantName:e.target.value})}/>
                        <div className="flex gap-2">
                            <Input placeholder="المكان" value={newFeed.merchantLoc} onChange={e=>setNewFeed({...newFeed, merchantLoc:e.target.value})}/>
                            <Input placeholder="الهاتف" value={newFeed.merchantPhone} onChange={e=>setNewFeed({...newFeed, merchantPhone:e.target.value})}/>
                        </div>
                    </div>
                    <Button onClick={handleBuy} variant="success" className="w-full">إضافة للمخزون</Button>
                </Card>
            )}

            {view === 'use' && (
                <Card className="animate-slide-up">
                    <h3 className="font-bold mb-3 flex items-center gap-2 text-orange-700"><TrendingDown size={18}/> تسجيل استهلاك</h3>
                    <Input type="date" label="تاريخ الاستهلاك" value={consumption.date} onChange={e=>setConsumption({...consumption, date:e.target.value})}/>
                    <select className="w-full p-3 mb-3 bg-gray-50 border rounded-xl" value={consumption.type} onChange={e=>setConsumption({...consumption, type:e.target.value})}><option value="">اختر النوع...</option>{getStock().map(s=><option key={s.type} value={s.type}>{s.type} (متوفر: {s.qty} {s.unit})</option>)}</select>
                    <Input placeholder="الكمية المستهلكة" type="number" value={consumption.quantity} onChange={e=>setConsumption({...consumption, quantity:e.target.value})}/>
                    <Button onClick={handleConsume} variant="warning" className="w-full">خصم من المخزون</Button>
                </Card>
            )}

            {view === 'report' && (
                <div className="space-y-4 animate-slide-up">
                    <Card>
                        <h3 className="font-bold text-sm mb-3 flex gap-2"><FileText size={16}/> سجل المشتريات (مقارنة التجار)</h3>
                        <div className="overflow-x-auto">
                        <table className="w-full text-xs text-right">
                            <thead className="bg-gray-100 text-gray-600 font-bold"><tr><th className="p-2">التاريخ</th><th className="p-2">التاجر</th><th className="p-2">الصنف</th><th className="p-2">السعر</th></tr></thead>
                            <tbody>
                                {feedRecords.slice().reverse().map(r => (
                                    <tr key={r.id} className="border-b">
                                        <td className="p-2">{formatDate(r.date)}</td>
                                        <td className="p-2 font-bold">{r.merchantName || '-'}<br/><span className="text-[9px] text-gray-400">{r.merchantLoc}</span></td>
                                        <td className="p-2">{r.type}<br/>{r.quantity} {r.unit}</td>
                                        <td className="p-2 font-bold text-blue-600">{r.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </Card>
                    <Card>
                        <h3 className="font-bold text-sm mb-3 flex gap-2"><TrendingDown size={16}/> سجل الاستهلاك</h3>
                        <div className="space-y-2">
                             {feedConsumption.slice().reverse().map(c => (
                                 <div key={c.id} className="flex justify-between bg-gray-50 p-2 rounded text-xs">
                                     <span>{formatDate(c.date)}</span>
                                     <span className="font-bold">{c.type}</span>
                                     <span className="text-red-500 font-bold">-{c.quantity}</span>
                                 </div>
                             ))}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans text-gray-900" dir="rtl">
      <Modal isOpen={confirmDialog.isOpen} onClose={() => setConfirmDialog({...confirmDialog, isOpen: false})} title="تأكيد"> <p className="text-gray-600 mb-6 text-center">{confirmDialog.title}</p> <div className="flex gap-3"> <Button onClick={confirmDialog.onConfirm} variant="danger" className="flex-1">نعم</Button> <Button onClick={() => setConfirmDialog({...confirmDialog, isOpen: false})} variant="ghost" className="flex-1">إلغاء</Button> </div> </Modal>
      {notification && <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-2xl z-50 animate-bounce font-bold text-sm">{notification}</div>}
      <div className="bg-white pt-safe-top pb-2 px-4 sticky top-0 z-20 shadow-sm"> <div className="flex justify-between items-center max-w-md mx-auto pt-2"> <h1 className="text-xl font-black text-gray-800">مزرعتي 🐄</h1> <Activity className="text-blue-600"/> </div> </div>
      <div className="p-4 max-w-md mx-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'cows' && <CowsManager />}
        {activeTab === 'milk' && <MilkView />}
        {activeTab === 'sales' && <SalesManager />}
        {activeTab === 'feed' && <FeedManager />}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t pb-safe shadow-lg z-30"> <div className="flex justify-around p-2 max-w-md mx-auto"> {[{id:'dashboard',icon:Activity,l:'الرئيسية'},{id:'cows',icon:Users,l:'القطيع'},{id:'milk',icon:Milk,l:'الحلبات'},{id:'sales',icon:DollarSign,l:'المالية'},{id:'feed',icon:Wheat,l:'أعلاف'}].map(t=><button key={t.id} onClick={()=>setActiveTab(t.id)} className={`flex flex-col items-center w-12 ${activeTab===t.id?'text-blue-600':'text-gray-400'}`}><t.icon size={20} strokeWidth={activeTab===t.id?2.5:2}/><span className="text-[9px] font-bold mt-1">{t.l}</span></button>)} </div> </div>
    </div>
  );
}
