export type Lang = 'en' | 'he';

const translations = {
  en: {
    // Nav
    dashboard: 'Dashboard',
    income: 'Income',
    expenses: 'Expenses',
    insights: 'Insights',
    tasks: 'Tasks',
    alerts: 'Alerts',
    settings: 'Settings',
    tagline: 'Your finances, calmly.',

    // Onboarding
    onboarding_title: 'Calm Money',
    onboarding_sub: 'Your calm financial assistant',
    onboarding_desc: 'Built for small business owners who want to understand their finances — simply and without stress.',
    onboarding_f1_title: 'See your free money instantly',
    onboarding_f1_desc: 'Know exactly what you can spend this month.',
    onboarding_f2_title: 'Smart insights',
    onboarding_f2_desc: 'Get clear actions based on your real numbers.',
    onboarding_f3_title: 'Simple input',
    onboarding_f3_desc: 'Add income and expenses in seconds. Always editable.',
    onboarding_cta: 'Get started',
    onboarding_privacy: 'All data stays on your device. No accounts required.',

    // Dashboard
    dashboard_sub: 'Your financial overview',
    free_money_title: 'Free Money This Month',
    free_money_sub: 'This is what you can safely use',
    total_income: 'Total Income',
    total_expenses: 'Total Expenses',
    balance: 'Balance',
    pending: 'Pending',
    income_vs_expenses: 'Income vs Expenses',
    expense_categories: 'Expense Categories',
    top_categories: 'Top Expense Categories',
    insights_actions: 'Insights & Actions',
    health_score: 'Financial Health Score',
    health_good: 'Good',
    health_fair: 'Fair',
    health_attention: 'Needs Attention',
    health_desc: 'Based on your free money ratio, pending income, and expense balance this period.',
    no_expenses_yet: 'No expenses yet',
    empty_title: "Let's get started",
    empty_desc: 'Add your income and expenses to see your financial picture.',
    add_income: 'Add income',
    upload_excel: 'Upload Excel',

    // Income page
    income_title: 'Income',
    entries_of: (n: number, total: number) => `${n} of ${total} entries`,
    add_first_income: 'Add your first income',
    no_income_yet: 'No income entries yet.',
    no_match: 'No entries match your filters.',

    // Add Income
    add_income_title: 'Add income',
    add_income_sub: 'You can always edit later.',
    amount_label: 'Amount (₪)',
    amount_placeholder: 'e.g. 5000',
    source_label: 'Source',
    source_placeholder: 'e.g. Client name, project...',
    date_label: 'Date',
    status_label: 'Status',
    received: 'Received',
    pending_status: 'Pending',
    add_income_btn: 'Add income',
    amount_error: 'Please enter a valid amount.',
    back: 'Back',

    // Expenses page
    expenses_title: 'Expenses',
    add_expense: 'Add expense',
    add_first_expense: 'Add your first expense',
    no_expenses_yet2: 'No expense entries yet.',

    // Add Expense
    add_expense_title: 'Add expense',
    category_label: 'Category',
    supplier_label: 'Supplier',
    supplier_placeholder: 'e.g. Supplier name',
    paid: 'Paid',
    upcoming: 'Upcoming',
    add_expense_btn: 'Add expense',
    custom: '+ Custom',
    category_placeholder: 'Category name',

    // Recurring
    recurring_label: 'Recurring',
    recurring_desc: 'Repeat this entry for the next months',
    recurring_months: 'Number of months',
    recurring_badge: 'Recurring',
    recurring_success: (n: number) => `${n} entries created`,

    // FilterBar
    all_categories: 'All categories',
    all_time: 'All time',
    this_month: 'This month',
    last_month: 'Last month',
    last_3_months: 'Last 3 months',
    this_year: 'This year',
    all_statuses: 'All statuses',
    search_source: 'Search source...',
    search_supplier: 'Search supplier...',

    // Insights
    insights_title: 'Insights',
    insights_sub: 'Based on your current period data',
    insights_empty: 'Add income and expenses to get personalized insights.',
    add_as_task: 'Add as task',
    critical: 'Critical',
    warning: 'Warning',
    good: 'Good',
    info: 'Info',

    // Tasks
    tasks_title: 'Tasks',
    tasks_sub: 'Actions derived from your insights',
    tasks_empty: 'No tasks yet. Go to Insights and add actions as tasks.',
    todo: (n: number) => `To Do (${n})`,
    done_section: (n: number) => `Done (${n})`,

    // Alerts
    alerts_title: 'Alerts',
    alerts_sub: 'Things that need your attention',

    // Settings
    settings_title: 'Settings',
    settings_sub: 'Manage your data and preferences',
    data_summary: 'Data summary',
    income_entries: (n: number) => `${n} income entries`,
    expense_entries: (n: number) => `${n} expense entries`,
    task_entries: (n: number) => `${n} tasks`,
    local_storage_note: 'All data is stored locally on this device.',
    clear_data: 'Clear all data',
    clear_data_desc: 'This will permanently delete all your income, expenses, and tasks. This cannot be undone.',
    clear_confirm: 'Yes, delete everything',
    cancel: 'Cancel',
    delete_confirm: 'Delete',
    language: 'Language',

    // Upload
    upload_title: 'Upload Excel file',
    upload_sub: "We'll extract income and expenses automatically. You can review and edit before saving.",
    upload_drop: 'Drop your Excel file here',
    upload_browse: 'or click to browse — .xlsx / .xls',
    upload_reading: 'Reading file...',
    upload_error: 'Could not read this file. Make sure it is an .xlsx or .xls file.',
    upload_found: (inc: number, exp: number) => `Found ${inc} income rows and ${exp} expense rows`,
    import_all: 'Import all',
    upload_different: 'Upload different file',
    import_success: 'Imported successfully!',
    redirecting: 'Redirecting to dashboard...',
    income_section: (n: number) => `Income (${n})`,
    expense_section: (n: number) => `Expenses (${n})`,

    // Edit form
    save: 'Save',
    cancel_edit: 'Cancel',

    // Insight texts
    insight_deficit_title: 'Risk of Deficit',
    insight_deficit_obs: 'Your expenses exceed your income this period.',
    insight_deficit_action: 'Stop non-critical spending immediately and review your largest expense categories.',
    insight_overspend_title: 'Overspending Alert',
    insight_overspend_obs: 'Expenses are higher than received income.',
    insight_overspend_action: 'Reduce spending in your highest expense category.',
    insight_lowmargin_title: 'Low Free Money',
    insight_lowmargin_obs: 'Less than 10% of income is available as free money.',
    insight_lowmargin_action: 'Avoid non-essential spending this month.',
    insight_pending_title: 'High Pending Income',
    insight_pending_obs: (pct: number) => `${pct}% of your expected income is still unpaid.`,
    insight_pending_action: 'Follow up with clients on outstanding invoices.',
    insight_category_title: (name: string) => `High Spend: ${name}`,
    insight_category_obs: (name: string, pct: number) => `${name} accounts for ${pct}% of your expenses.`,
    insight_category_action: 'Review your expenses and see where you can cut back.',
    insight_good_title: 'Good Financial Health',
    insight_good_action: 'Consider setting aside some of this into savings.',

    // Alert texts
    alert_deficit: (n: string) => `Your expenses exceed income by ₪${n}. Immediate action recommended.`,
    alert_low_margin: (pct: number) => `Only ${pct}% of income remains free. Avoid non-essential spending.`,
    alert_overdue: (n: number) => `${n} pending income ${n === 1 ? 'entry is' : 'entries are'} over 30 days old. Follow up with your clients.`,
    alert_pending_heavy: (pct: number) => `${pct}% of expected income is still unpaid. This affects your cash flow.`,
    alert_good: 'No critical alerts at the moment. Keep it up!',
    alert_deficit_title: 'Deficit Risk',
    alert_low_margin_title: 'Low Free Money',
    alert_overdue_title: 'Delayed Payments',
    alert_pending_heavy_title: 'High Pending Income',
    alert_good_title: 'All looks good',

    // Health score
    health_score_desc: (pct: number) => `You have ${pct}% of income available as free money.`,
  },

  he: {
    // Nav
    dashboard: 'לוח בקרה',
    income: 'הכנסות',
    expenses: 'הוצאות',
    insights: 'תובנות',
    tasks: 'משימות',
    alerts: 'התראות',
    settings: 'הגדרות',
    tagline: 'הכספים שלך, ברוגע.',

    // Onboarding
    onboarding_title: 'כסף רגוע',
    onboarding_sub: 'העוזר הפיננסי השקט שלך',
    onboarding_desc: 'נבנה לבעלי עסקים קטנים שרוצים להבין את הכספים שלהם — פשוט ובלי לחץ.',
    onboarding_f1_title: 'ראה את הכסף הפנוי מיד',
    onboarding_f1_desc: 'דע בדיוק כמה אפשר להוציא החודש.',
    onboarding_f2_title: 'תובנות חכמות',
    onboarding_f2_desc: 'קבל פעולות ברורות בהתבסס על המספרים האמיתיים שלך.',
    onboarding_f3_title: 'קלט פשוט',
    onboarding_f3_desc: 'הוסף הכנסות והוצאות בשניות. ניתן לעריכה תמיד.',
    onboarding_cta: 'בואו נתחיל',
    onboarding_privacy: 'כל הנתונים נשמרים במכשיר שלך. אין צורך בחשבון.',

    // Dashboard
    dashboard_sub: 'סקירת הכספים שלך',
    free_money_title: 'כסף פנוי החודש',
    free_money_sub: 'זה מה שאפשר להוציא בבטחה',
    total_income: 'סה"כ הכנסות',
    total_expenses: 'סה"כ הוצאות',
    balance: 'מאזן',
    pending: 'ממתין',
    income_vs_expenses: 'הכנסות מול הוצאות',
    expense_categories: 'קטגוריות הוצאה',
    top_categories: 'קטגוריות הוצאה מובילות',
    insights_actions: 'תובנות ופעולות',
    health_score: 'ציון בריאות פיננסית',
    health_good: 'טוב',
    health_fair: 'סביר',
    health_attention: 'דורש תשומת לב',
    health_desc: 'מבוסס על יחס הכסף הפנוי, הכנסות ממתינות ויתרת הוצאות בתקופה זו.',
    no_expenses_yet: 'אין הוצאות עדיין',
    empty_title: 'בואו נתחיל',
    empty_desc: 'הוסף הכנסות והוצאות כדי לראות את התמונה הפיננסית שלך.',
    add_income: 'הוסף הכנסה',
    upload_excel: 'העלה אקסל',

    // Income page
    income_title: 'הכנסות',
    entries_of: (n: number, total: number) => `${n} מתוך ${total} רשומות`,
    add_first_income: 'הוסף את ההכנסה הראשונה שלך',
    no_income_yet: 'אין רשומות הכנסה עדיין.',
    no_match: 'אין רשומות התואמות את הסינון.',

    // Add Income
    add_income_title: 'הוסף הכנסה',
    add_income_sub: 'תוכל לערוך בכל עת.',
    amount_label: 'סכום (₪)',
    amount_placeholder: 'לדוגמה 5000',
    source_label: 'מקור',
    source_placeholder: 'לדוגמה שם לקוח, פרויקט...',
    date_label: 'תאריך',
    status_label: 'סטטוס',
    received: 'התקבל',
    pending_status: 'ממתין',
    add_income_btn: 'הוסף הכנסה',
    amount_error: 'נא להזין סכום תקין.',
    back: 'חזרה',

    // Expenses page
    expenses_title: 'הוצאות',
    add_expense: 'הוסף הוצאה',
    add_first_expense: 'הוסף את ההוצאה הראשונה שלך',
    no_expenses_yet2: 'אין רשומות הוצאה עדיין.',

    // Add Expense
    add_expense_title: 'הוסף הוצאה',
    category_label: 'קטגוריה',
    supplier_label: 'ספק',
    supplier_placeholder: 'לדוגמה שם ספק',
    paid: 'שולם',
    upcoming: 'עתידי',
    add_expense_btn: 'הוסף הוצאה',
    custom: '+ מותאם אישית',
    category_placeholder: 'שם קטגוריה',

    // Recurring
    recurring_label: 'חוזר',
    recurring_desc: 'חזור על רשומה זו בחודשים הבאים',
    recurring_months: 'מספר חודשים',
    recurring_badge: 'חוזר',
    recurring_success: (n: number) => `נוצרו ${n} רשומות`,

    // FilterBar
    all_categories: 'כל הקטגוריות',
    all_time: 'כל הזמן',
    this_month: 'החודש',
    last_month: 'חודש שעבר',
    last_3_months: '3 חודשים אחרונים',
    this_year: 'השנה',
    all_statuses: 'כל הסטטוסים',
    search_source: 'חפש מקור...',
    search_supplier: 'חפש ספק...',

    // Insights
    insights_title: 'תובנות',
    insights_sub: 'בהתבסס על נתוני התקופה הנוכחית',
    insights_empty: 'הוסף הכנסות והוצאות כדי לקבל תובנות מותאמות.',
    add_as_task: 'הוסף כמשימה',
    critical: 'קריטי',
    warning: 'אזהרה',
    good: 'טוב',
    info: 'מידע',

    // Tasks
    tasks_title: 'משימות',
    tasks_sub: 'פעולות הנגזרות מהתובנות',
    tasks_empty: 'אין משימות עדיין. עבור לתובנות והוסף פעולות כמשימות.',
    todo: (n: number) => `לביצוע (${n})`,
    done_section: (n: number) => `בוצע (${n})`,

    // Alerts
    alerts_title: 'התראות',
    alerts_sub: 'דברים שדורשים את תשומת לבך',

    // Settings
    settings_title: 'הגדרות',
    settings_sub: 'ניהול נתונים והעדפות',
    data_summary: 'סיכום נתונים',
    income_entries: (n: number) => `${n} רשומות הכנסה`,
    expense_entries: (n: number) => `${n} רשומות הוצאה`,
    task_entries: (n: number) => `${n} משימות`,
    local_storage_note: 'כל הנתונים נשמרים מקומית במכשיר זה.',
    clear_data: 'מחק את כל הנתונים',
    clear_data_desc: 'פעולה זו תמחק לצמיתות את כל ההכנסות, ההוצאות והמשימות שלך. לא ניתן לבטל.',
    clear_confirm: 'כן, מחק הכל',
    cancel: 'ביטול',
    delete_confirm: 'מחק',
    language: 'שפה',

    // Upload
    upload_title: 'העלאת קובץ אקסל',
    upload_sub: 'נחלץ הכנסות והוצאות אוטומטית. תוכל לסקור ולערוך לפני השמירה.',
    upload_drop: 'גרור קובץ אקסל לכאן',
    upload_browse: 'או לחץ לעיון — .xlsx / .xls',
    upload_reading: 'קורא קובץ...',
    upload_error: 'לא ניתן לקרוא את הקובץ. ודא שזהו קובץ .xlsx או .xls.',
    upload_found: (inc: number, exp: number) => `נמצאו ${inc} שורות הכנסה ו-${exp} שורות הוצאה`,
    import_all: 'ייבא הכל',
    upload_different: 'העלה קובץ אחר',
    import_success: 'יובא בהצלחה!',
    redirecting: 'מעביר ללוח הבקרה...',
    income_section: (n: number) => `הכנסות (${n})`,
    expense_section: (n: number) => `הוצאות (${n})`,

    // Edit form
    save: 'שמור',
    cancel_edit: 'ביטול',

    // Insight texts
    insight_deficit_title: 'סיכון גירעון',
    insight_deficit_obs: 'ההוצאות שלך עולות על ההכנסות בתקופה זו.',
    insight_deficit_action: 'הפסק הוצאות לא הכרחיות מיד וסקור את קטגוריות ההוצאה הגדולות ביותר.',
    insight_overspend_title: 'התראת הוצאות יתר',
    insight_overspend_obs: 'ההוצאות גבוהות מההכנסות שהתקבלו.',
    insight_overspend_action: 'הפחת הוצאות בקטגוריה הגדולה ביותר.',
    insight_lowmargin_title: 'כסף פנוי נמוך',
    insight_lowmargin_obs: 'פחות מ-10% מההכנסה זמין ככסף פנוי.',
    insight_lowmargin_action: 'הימנע מהוצאות לא חיוניות החודש.',
    insight_pending_title: 'הכנסה ממתינה גבוהה',
    insight_pending_obs: (pct: number) => `${pct}% מההכנסה הצפויה שלך עדיין לא שולמה.`,
    insight_pending_action: 'עקוב אחר לקוחות עם חשבוניות פתוחות.',
    insight_category_title: (name: string) => `הוצאה גבוהה: ${name}`,
    insight_category_obs: (name: string, pct: number) => `${name} מהווה ${pct}% מההוצאות שלך.`,
    insight_category_action: 'סקור את ההוצאות שלך וראה היכן ניתן לצמצם.',
    insight_good_title: 'בריאות פיננסית טובה',
    insight_good_action: 'שקול להפריש חלק מהכסף לחיסכון.',

    // Alert texts
    alert_deficit: (n: string) => `ההוצאות עולות על ההכנסות ב-₪${n}. מומלץ לפעול מיד.`,
    alert_low_margin: (pct: number) => `רק ${pct}% מההכנסה נותר פנוי. הימנע מהוצאות לא חיוניות.`,
    alert_overdue: (n: number) => `${n} ${n === 1 ? 'רשומת הכנסה ממתינה' : 'רשומות הכנסה ממתינות'} מעל 30 יום. עקוב אחר לקוחות.`,
    alert_pending_heavy: (pct: number) => `${pct}% מההכנסה הצפויה עדיין לא שולמה. זה משפיע על תזרים המזומנים.`,
    alert_good: 'אין התראות קריטיות כרגע. כל הכבוד!',
    alert_deficit_title: 'סיכון גירעון',
    alert_low_margin_title: 'כסף פנוי נמוך',
    alert_overdue_title: 'תשלומים מעוכבים',
    alert_pending_heavy_title: 'הכנסה ממתינה גבוהה',
    alert_good_title: 'הכל נראה טוב',

    // Health score
    health_score_desc: (pct: number) => `יש לך ${pct}% מההכנסה כסף פנוי.`,
  },
} as const;

export default translations;
export type Translations = typeof translations.en;
