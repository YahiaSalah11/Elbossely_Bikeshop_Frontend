import {useState} from 'react'; 


import BikeManager from "./BikeManager";
import OrderManager from "./OrdersManager";


export default function OwnerDashboard() {

  const [language, setLanguage] = useState('en');
  

  return (
    <div>
      <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="language-toggle">
        {language === 'en' ? 'English' : 'العربية'}
      </button>
      <h1>{language === 'en' ? 'Owner Dashboard' : 'لوحة تحكم المالك'}</h1>
      <BikeManager language={language} />

      <OrderManager language={language} />
    </div>
  );
}


