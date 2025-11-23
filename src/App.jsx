import React, { useState, useEffect } from 'react';
import { Milk, DollarSign, Users, Activity, Trash2, Download, Plus, UserPlus, ChevronLeft, Edit2, Share2, X, Wheat, TrendingUp, TrendingDown, MapPin } from 'lucide-react';

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

// --- مكونات الواجهة (UI Components) ---

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-scale-up overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X size={20}/></button>
        </div>
        <div className="p-4">{children}</div>
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
  // حالة الأعلاف الجديدة
  const [feedRecords, setFeedRecords] = useState(() => JSON.parse(localStorage.getItem('feedRecords')) || []);

  // Persist Data
  useEffect(() => {
    localStorage.setItem('cows', JSON.stringify(cows));
    localStorage.setItem('milkRecords', JSON.stringify(milkRecords));
    localStorage.setItem('customers', JSON.stringify(customers));
    localStorage.setItem('sales', JSON.stringify(sales));
    localStorage.setItem('feedRecords', JSON.stringify(feedRecords));
  }, [cows, milkRecords, customers, sales, feedRecords]);

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
    const netProfit = totalSales - totalFeedCost;
    
    // توصيات ذكية
    const getRecommendation = () => {
      if (totalMilk === 0) return "ابدأ بتسجيل الحلبات للحصول على توصيات.";
      const feedPerMilk = totalFeedCost / totalMilk;
      
      if (netProfit < 0) return "⚠️ تنبيه: المزرعة تخسر! تكلفة العلف أعلى من المبيعات. راجع كميات العلف أو ابحث عن مورد أرخص.";
      if (feedPerMilk > 400) return "⚠️ تكلفة إنتاج الرطل مرتفعة جداً. حاول تقليل الهدر في العلف.";
      return "✅ الأداء ممتاز! استمر في الحفاظ على توازن العلف والإنتاج.";
    };

    const generateReport = () => {
      const text = `📊 *تقرير المزرعة المالي*
      
💰 *إجمالي المبيعات:* ${totalSales.toLocaleString()} ج.س
🌾 *تكلفة العلف:* ${totalFeedCost.toLocaleString()} ج.س
📈 *صافي الربح:* ${netProfit.toLocaleString()} ج.س
      
🥛 *الإنتاج:* ${totalMilk} رطل
🐮 *عدد القطيع:* ${cows.length}

💡 *التوصية:* ${getRecommendation()}
      
_تم الإنشاء عبر تطبيق مزرعتي_`;
      shareViaWhatsapp(text);
    };

    return (
      <div className="space-y-4 pb-20 animate-fade-in">
        {/* ملخص الربح والخسارة */}
        <div className="bg-gray-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-5 rounded-full -translate-x-10 -translate-y-10"></div>
           <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 text-sm font-bold">صافي الربح (المبيعات - العلف)</span>
              {netProfit >= 0 ? <TrendingUp className="text-emerald-400"/> : <TrendingDown className="text-rose-400"/>}
           </div>
           <p className={`text-4xl font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
             {netProfit.toLocaleString()} <span className="text-sm text-white opacity-60 font-normal">ج.س</span>
           </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-emerald-50 border-emerald-100">
            <div className="flex justify-between mb-2 opacity-80"><span className="text-xs text-emerald-800 font-bold">دخل المبيعات</span><DollarSign size={16} className="text-emerald-600"/></div>
            <p className="text-xl font-bold text-emerald-700">{totalSales.toLocaleString()}</p>
          </Card>
          <Card className="bg-amber-50 border-amber-100">
            <div className="flex justify-between mb-2 opacity-80"><span className="text-xs text-amber-800 font-bold">صرف العلف</span><Wheat size={16} className="text-amber-600"/></div>
            <p className="text-xl font-bold text-amber-700">{totalFeedCost.toLocaleString()}</p>
          </Card>
        </div>

        {/* بطاقة التوصيات */}
        <Card className="border-l-4 border-l-blue-500">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Activity size={18} className="text-blue-500"/> تحليل وتوصيات
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {getRecommendation()}
          </p>
        </Card>

        <Button onClick={generateReport} className="w-full bg-green-600 hover:bg-green-700">
          <Share2 size={18} /> مشاركة التقرير المالي
        </Button>
      </div>
    );
  };

  // --- قسم إدارة الأعلاف (جديد) ---
  const FeedManager = () => {
    const [view, setView] = useState('list');
    const [newFeed, setNewFeed] = useState({ 
        id: null, type: '', quantity: '', unit: 'جوال', price: '', merchant: '', location: '', date: new Date().toISOString().split('T')[0] 
    });

    const handleSaveFeed = () => {
        if (!newFeed.type || !newFeed.price || !newFeed.quantity) return showNotify("البيانات ناقصة!");
        const totalCost = Number(newFeed.price) * Number(newFeed.quantity); // إذا كان السعر للوحدة
        // أو إذا كان السعر إجمالي، يعتمد على طريقة إدخالك. سنفترض هنا السعر للوحدة (للجوال مثلاً)
        const record = { ...newFeed, totalCost: totalCost };

        if (newFeed.id) {
            setFeedRecords(feedRecords.map(f => f.id === newFeed.id ? record : f));
            showNotify("تم تعديل سجل العلف");
        } else {
            setFeedRecords([{ ...record, id: Date.now() }, ...feedRecords]);
            showNotify("تمت إضافة العلف 🌾");
        }
        setNewFeed({ id: null, type: '', quantity: '', unit: 'جوال', price: '', merchant: '', location: '', date: new Date().toISOString().split('T')[0] });
        setView('list');
    };

    const handleEditFeed = (rec) => {
        setNewFeed(rec); // ملاحظة: totalCost يحسب عند الحفظ
        setView('new');
    };

    if (view === 'new') return (
        <div className="space-y-4 pb-20 animate-slide-up">
            <div className="flex items-center gap-2 mb-2">
                <button onClick={() => setView('list')} className="p-2 bg-gray-100 rounded-lg"><ChevronLeft size={20}/></button>
                <h2 className="font-bold text-xl text-gray-800">{newFeed.id ? 'تعديل شراء' : 'شراء علف جديد'}</h2>
            </div>
            
            <Card className="space-y-3">
                <Input label="نوع العلف (ردة، برسيم، مركزات...)" value={newFeed.type} onChange={e => setNewFeed({...newFeed, type: e.target.value})} />
                
                <div className="flex gap-3">
                    <div className="flex-1">
                        <Input label="الكمية" type="number" value={newFeed.quantity} onChange={e => setNewFeed({...newFeed, quantity: e.target.value})} />
                    </div>
                    <div className="w-1/3">
                        <label className="text-xs font-bold text-gray-400 mb-1 block">الوحدة</label>
                        <select className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl" value={newFeed.unit} onChange={e => setNewFeed({...newFeed, unit: e.target.value})}>
                            <option>جوال</option>
                            <option>طن</option>
                            <option>قنطار</option>
                            <option>حزمة</option>
                            <option>كيلو</option>
                        </select>
                    </div>
                </div>

                <Input label="سعر الوحدة (للجوال/الطن...)" type="number" value={newFeed.price} onChange={e => setNewFeed({...newFeed, price: e.target.value})} />
                
                <div className="bg-amber-50 p-3 rounded-xl flex justify-between items-center border border-amber-100">
                    <span className="text-amber-800 font-bold text-sm">التكلفة الإجمالية:</span>
                    <span className="text-xl font-bold text-amber-900">{(Number(newFeed.quantity || 0) * Number(newFeed.price || 0)).toLocaleString()} ج.س</span>
                </div>

                <Input label="اسم التاجر" value={newFeed.merchant} onChange={e => setNewFeed({...newFeed, merchant: e.target.value})} />
                <Input label="مكان الشراء" value={newFeed.location} onChange={e => setNewFeed({...newFeed, location: e.target.value})} />
                <Input label="تاريخ الشراء" type="date" value={newFeed.date} onChange={e => setNewFeed({...newFeed, date: e.target.value})} />

                <Button onClick={handleSaveFeed} className="w-full bg-amber-600 hover:bg-amber-700 text-white">حفظ الفاتورة</Button>
            </Card>
        </div>
    );

    return (
        <div className="space-y-4 pb-20">
            <Button onClick={() => {setNewFeed({ id: null, type: '', quantity: '', unit: 'جوال', price: '', merchant: '', location: '', date: new Date().toISOString().split('T')[0] }); setView('new')}} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
              <Plus size={18} /> تسجيل شراء علف
            </Button>
            
            <div className="space-y-3 mt-4">
               {feedRecords.length === 0 && <p className="text-center text-gray-400 py-10">لا توجد سجلات أعلاف</p>}
               {feedRecords.map(feed => (
                   <div key={feed.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative">
                       <div className="flex justify-between items-start mb-2">
                           <div>
                               <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2"><Wheat size={16} className="text-amber-500"/> {feed.type}</h4>
                               <p className="text-xs text-gray-400 mt-1">{formatDate(feed.date)}</p>
                           </div>
                           <div className="text-left">
                               <p className="font-bold text-lg text-amber-700">{feed.totalCost.toLocaleString()} ج.س</p>
                               <p className="text-xs text-gray-500">{feed.quantity} {feed.unit} × {feed.price}</p>
                           </div>
                       </div>
                       
                       <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 bg-gray-50 p-2 rounded-lg">
                           <span className="flex items-center gap-1"><UserPlus size={12}/> {feed.merchant || '-'}</span>
                           <span className="flex items-center gap-1"><MapPin size={12}/> {feed.location || '-'}</span>
                       </div>

                       <div className="flex gap-2 justify-end border-t pt-2 border-gray-50">
                            <button onClick={() => handleEditFeed(feed)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg flex items-center gap-1 text-xs font-bold"><Edit2 size={14}/> تعديل</button>
                            <button onClick={() => handleDelete('سجل العلف', () => setFeedRecords(feedRecords.filter(f => f.id !== feed.id)))} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg flex items-center gap-1 text-xs font-bold"><Trash2 size={14}/> حذف</button>
                       </div>
                   </div>
               ))}
            </div>
        </div>
    );
  };

  // --- بقية الـ Views كما هي مع تعديلات طفيفة ---
  // (تم دمج منطق الـ CowsView و MilkView و SalesManager هنا للاختصار، لكنك ستنسخ الكود كاملاً)

  const CowsView = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ id: null, name: '', tag: '', status: 'milking', birthDate: '', calvings: 0 });

    const handleSubmit = () => {
      if (!form.tag) return showNotify("رقم البقرة مطلوب!");
      if (isEditing) {
        setCows(cows.map(c => c.id === form.id ? { ...form } : c));
        showNotify("تم التعديل بنجاح ✅");
        setIsEditing(false);
      } else {
        setCows([...cows, { ...form, id: Date.now() }]);
        showNotify("تمت الإضافة بنجاح ✨");
      }
      setForm({ id: null, name: '', tag: '', status: 'milking', birthDate: '', calvings: 0 });
    };

    const handleEdit = (cow) => {
      setForm(cow);
      setIsEditing(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
      <div className="space-y-4 pb-20">
        <Card className={isEditing ? "border-2 border-blue-400" : ""}>
          <div className="flex justify-between items-center mb-3">
             <h3 className="font-bold text-gray-700">{isEditing ? 'تعديل بيانات البقرة' : 'إضافة بقرة جديدة'}</h3>
             {isEditing && <button onClick={() => {setIsEditing(false); setForm({ id: null, name: '', tag: '', status: 'milking', birthDate: '', calvings: 0 })}} className="text-xs text-red-500 font-bold">إلغاء</button>}
          </div>
          <div className="flex gap-2">
            <Input placeholder="الرقم (Tag)" value={form.tag} onChange={e => setForm({...form, tag: e.target.value})} />
            <Input placeholder="الاسم" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
               <label className="text-xs font-bold text-gray-400 mr-1">تاريخ الميلاد</label>
               <input type="date" value={form.birthDate} onChange={e => setForm({...form, birthDate: e.target.value})} className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl mb-3" />
            </div>
            <div className="w-1/3">
               <Input label="الولادات" type="number" value={form.calvings} onChange={e => setForm({...form, calvings: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-2 mb-3">
            {['milking', 'dry', 'sick'].map(st => (
              <button key={st} onClick={() => setForm({...form, status: st})}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition-all ${form.status === st 
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-100 text-gray-400'
                }`}>
                {st === 'milking' ? 'حلابة' : st === 'dry' ? 'جافة' : 'مريضة'}
              </button>
            ))}
          </div>
          <Button onClick={handleSubmit} className="w-full">{isEditing ? 'حفظ التعديلات' : 'إضافة'}</Button>
        </Card>
        <div className="space-y-2">
          {cows.map(cow => (
            <div key={cow.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative group">
              <div className="flex justify-between items-start">
                 <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${cow.status === 'milking' ? 'bg-emerald-500' : 'bg-gray-400'}`}>
                      {cow.tag}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{cow.name || 'بدون اسم'}</p>
                      <p className="text-xs text-gray-400">العمر: {calculateAge(cow.birthDate)} • الولادات: {cow.calvings}</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => handleEdit(cow)} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(`البقرة ${cow.tag}`, () => setCows(cows.filter(c => c.id !== cow.id)))} className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Trash2 size={16}/></button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const MilkView = () => {
    const [record, setRecord] = useState({ id: null, amount: '', session: 'morning', date: new Date().toISOString().split('T')[0] });
    const [isEditing, setIsEditing] = useState(false);
    const handleSubmit = () => {
      if (!record.amount) return;
      if (isEditing) {
        setMilkRecords(milkRecords.map(r => r.id === record.id ? record : r));
        showNotify("تم تعديل الحلبة");
        setIsEditing(false);
      } else {
        setMilkRecords([{ ...record, id: Date.now() }, ...milkRecords]);
        showNotify("تم تسجيل الحلبة 🥛");
      }
      setRecord({ id: null, amount: '', session: 'morning', date: new Date().toISOString().split('T')[0] });
    };
    const handleEdit = (rec) => { setRecord(rec); setIsEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };

    return (
      <div className="space-y-4 pb-20">
         <Card className="border-t-4 border-t-indigo-500">
           <div className="flex justify-between items-center mb-2">
             <h3 className="font-bold text-gray-800">{isEditing ? 'تعديل سجل' : 'سجل جديد'}</h3>
             {isEditing && <button onClick={() => {setIsEditing(false); setRecord({id: null, amount: '', session: 'morning', date: new Date().toISOString().split('T')[0]})}} className="text-red-500 text-xs font-bold">إلغاء</button>}
           </div>
           <div className="flex gap-2 mb-3">
              <input type="date" value={record.date} onChange={e => setRecord({...record, date: e.target.value})} className="bg-gray-100 rounded-xl px-3 py-2 text-sm font-bold flex-1"/>
              <div className="flex bg-gray-100 p-1 rounded-xl flex-1">
                <button onClick={() => setRecord({...record, session: 'morning'})} className={`flex-1 rounded-lg text-xs font-bold transition-all ${record.session === 'morning' ? 'bg-white shadow text-amber-600' : 'text-gray-400'}`}>صباح</button>
                <button onClick={() => setRecord({...record, session: 'evening'})} className={`flex-1 rounded-lg text-xs font-bold transition-all ${record.session === 'evening' ? 'bg-white shadow text-indigo-900' : 'text-gray-400'}`}>مساء</button>
              </div>
           </div>
           <div className="relative mb-4">
             <input type="number" placeholder="0" className="w-full text-center text-4xl font-bold text-indigo-900 bg-transparent outline-none placeholder-gray-200" value={record.amount} onChange={e => setRecord({...record, amount: e.target.value})} />
             <span className="block text-center text-gray-400 text-xs font-bold mt-1">الكمية (رطل)</span>
           </div>
          <Button onClick={handleSubmit} className="w-full bg-indigo-600">{isEditing ? 'تحديث' : 'تسجيل'}</Button>
        </Card>
        <div className="space-y-2">
          {milkRecords.slice(0, 20).map(rec => (
            <div key={rec.id} className="bg-white px-4 py-3 rounded-xl shadow-sm flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-full ${rec.session === 'morning' ? 'bg-amber-50 text-amber-500' : 'bg-indigo-50 text-indigo-500'}`}>
                    <Milk size={18} />
                 </div>
                 <div>
                    <p className="font-bold text-gray-800 text-lg">{rec.amount} رطل</p>
                    <p className="text-[10px] text-gray-400">{formatDate(rec.date)} • {rec.session === 'morning' ? 'صباح' : 'مساء'}</p>
                 </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => handleEdit(rec)} className="text-blue-400"><Edit2 size={16}/></button>
                 <button onClick={() => handleDelete('سجل حلب', () => setMilkRecords(milkRecords.filter(r => r.id !== rec.id)))} className="text-red-400"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SalesManager = () => {
    const [view, setView] = useState('list'); 
    const [newSale, setNewSale] = useState({ id: null, customerId: '', amount: '', price: '500', paid: '', date: new Date().toISOString().split('T')[0] });
    
    const handleSaveSale = () => {
        if (!newSale.customerId || !newSale.amount) return showNotify("بيانات ناقصة!");
        const total = Number(newSale.amount) * Number(newSale.price);
        const paid = newSale.paid === '' ? total : Number(newSale.paid);
        const saleData = { ...newSale, total, paid, debt: total - paid };

        if (newSale.id) {
            setSales(sales.map(s => s.id === newSale.id ? saleData : s));
            showNotify("تم تحديث البيع");
        } else {
            setSales([{ ...saleData, id: Date.now() }, ...sales]);
            showNotify("تم البيع بنجاح 💰");
        }
        setNewSale({ id: null, customerId: '', amount: '', price: '500', paid: '', date: new Date().toISOString().split('T')[0] });
        setView('list');
    };
    const handleEditSale = (sale) => { setNewSale(sale); setView('new'); };
    const deleteCustomer = (id) => { handleDelete('العميل', () => { setCustomers(customers.filter(c => c.id !== id)); }); };
    const shareDebt = (customerName, debt) => { shareViaWhatsapp(`مرحباً عزيزي ${customerName}،\nنود تذكيرك بأن إجمالي المتبقي عليكم لمزرعتنا هو: *${debt.toLocaleString()} ج.س*.\nشكراً لتعاملكم.`); };

    if (view === 'new') return (
      <div className="space-y-4 pb-20 animate-slide-up">
        <div className="flex items-center gap-2 mb-2">
          <button onClick={() => setView('list')} className="p-2 bg-gray-100 rounded-lg"><ChevronLeft size={20}/></button>
          <h2 className="font-bold text-xl text-gray-800">{newSale.id ? 'تعديل فاتورة' : 'بيع جديد'}</h2>
        </div>
        <Card className="space-y-4">
           <div className="flex gap-2 items-end">
             <div className="flex-1">
               <label className="text-xs font-bold text-gray-400 mb-1 block">العميل</label>
               <select className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl" value={newSale.customerId} onChange={e => setNewSale({...newSale, customerId: e.target.value})}>
                 <option value="">اختر العميل...</option>
                 {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
             </div>
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
             <div className="flex-1"> <Input label="الكمية (رطل)" type="number" value={newSale.amount} onChange={e => setNewSale({...newSale, amount: e.target.value})} /> </div>
             <div className="flex-1"> <Input label="السعر" type="number" value={newSale.price} onChange={e => setNewSale({...newSale, price: e.target.value})} /> </div>
           </div>
           <div className="p-3 bg-blue-50 rounded-xl flex justify-between items-center">
             <span className="text-blue-800 font-bold">الإجمالي:</span>
             <span className="text-xl font-bold text-blue-900">{(Number(newSale.amount) * Number(newSale.price)).toLocaleString()} ج.س</span>
           </div>
           <Input label="المبلغ المدفوع" type="number" placeholder="اتركه فارغاً إذا دفع كامل المبلغ" value={newSale.paid} onChange={e => setNewSale({...newSale, paid: e.target.value})} />
           <Button onClick={handleSaveSale} className="w-full">{newSale.id ? 'حفظ التعديلات' : 'إتمام البيع'}</Button>
        </Card>
      </div>
    );
    return (
      <div className="space-y-4 pb-20">
        <div className="flex p-1 bg-gray-200 rounded-xl">
          <button onClick={() => setView('list')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${view === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>السجل</button>
          <button onClick={() => setView('debts')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${view === 'debts' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>الديون والعملاء</button>
        </div>
        {view === 'list' && (
          <>
            <Button onClick={() => {setNewSale({ id: null, customerId: '', amount: '', price: '500', paid: '', date: new Date().toISOString().split('T')[0] }); setView('new')}} className="w-full"><Plus size={18} /> عملية بيع جديدة</Button>
            <div className="space-y-3 mt-4">
              {sales.map(sale => {
                const customerName = customers.find(c => c.id == sale.customerId)?.name || 'غير معروف';
                return (
                  <div key={sale.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-800">{customerName}</p>
                      <p className="text-xs text-gray-400 mb-1">{formatDate(sale.date)} • {sale.amount} رطل</p>
                      <div className="flex gap-2">
                         <span className="font-bold text-blue-900">{sale.total.toLocaleString()} ج.س</span>
                         {sale.debt > 0 && <span className="text-xs bg-rose-100 text-rose-600 px-2 rounded pt-0.5">باقي: {sale.debt}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => handleEditSale(sale)} className="text-blue-400 p-2 bg-blue-50 rounded-lg"><Edit2 size={16}/></button>
                        <button onClick={() => handleDelete('البيع', () => setSales(sales.filter(s => s.id !== sale.id)))} className="text-red-400 p-2 bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
        {view === 'debts' && (
           <div className="space-y-3">
             <Card>
                <h3 className="font-bold mb-3 border-b pb-2">إدارة العملاء</h3>
                {customers.map(c => {
                    const debt = sales.filter(s => s.customerId == c.id).reduce((sum, s) => sum + s.debt, 0);
                    return (
                        <div key={c.id} className="flex justify-between items-center py-3 border-b last:border-0">
                            <div>
                                <p className="font-bold text-gray-800">{c.name}</p>
                                {debt > 0 ? <p className="text-rose-600 font-bold text-sm">عليه: {debt.toLocaleString()}</p> : <p className="text-green-500 text-xs">حسابه خالص</p>}
                            </div>
                            <div className="flex gap-2">
                                {debt > 0 && <button onClick={() => shareDebt(c.name, debt)} className="p-2 bg-green-100 text-green-600 rounded-lg"><Share2 size={16}/></button>}
                                <button onClick={() => {
                                    const newName = prompt("تعديل اسم العميل:", c.name);
                                    if (newName) setCustomers(customers.map(cus => cus.id === c.id ? {...cus, name: newName} : cus));
                                }} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Edit2 size={16}/></button>
                                <button onClick={() => deleteCustomer(c.id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    )
                })}
             </Card>
           </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans text-gray-900" dir="rtl">
      <Modal isOpen={confirmDialog.isOpen} onClose={() => setConfirmDialog({...confirmDialog, isOpen: false})} title="تأكيد الحذف ⚠️">
         <p className="text-gray-600 mb-6">{confirmDialog.title}</p>
         <div className="flex gap-3">
            <Button onClick={confirmDialog.onConfirm} variant="danger" className="flex-1">نعم، احذف</Button>
            <Button onClick={() => setConfirmDialog({...confirmDialog, isOpen: false})} variant="ghost" className="flex-1">إلغاء</Button>
         </div>
      </Modal>

      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <span className="text-sm font-bold">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white pt-safe-top pb-4 px-6 sticky top-0 z-20 shadow-sm bg-white/95 backdrop-blur-sm">
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
        {activeTab === 'feed' && <FeedManager />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-30">
        <div className="flex justify-around items-center p-2 max-w-md mx-auto">
          {[
            {id: 'dashboard', icon: Activity, label: 'الرئيسية'}, 
            {id: 'cows', icon: Users, label: 'القطيع'}, 
            {id: 'milk', icon: Milk, label: 'الحلبات'}, 
            {id: 'sales', icon: DollarSign, label: 'المالية'},
            {id: 'feed', icon: Wheat, label: 'الأعلاف'}
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                className={`flex flex-col items-center justify-center w-14 h-16 rounded-2xl transition-all duration-300 ${isActive ? 'bg-blue-50 text-blue-600 -translate-y-2 shadow-lg shadow-blue-100' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[9px] font-bold mt-1 transition-all ${isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0 h-0'}`}>{tab.label}</span>
              </button>
          )})}
        </div>
      </div>
    </div>
  );
}
