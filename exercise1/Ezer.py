import pandas as pd

# שלב 1: טען את קובץ ה-CSV
df = pd.read_csv('time_series.csv')

# המרת עמודת תאריך
df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce', dayfirst=True)

# הסרת שורות לא תקינות
df = df.dropna(subset=['timestamp', 'value']).copy()

# המרת ערכים מספריים
df['value'] = pd.to_numeric(df['value'], errors='coerce')
df = df.dropna(subset=['value'])

# הסרת כפילויות
# df = df.drop_duplicates(subset=['timestamp'])

# שלב 3: הוצאת התאריך והשעה מה-timestamp
df['date'] = df['timestamp'].dt.date  # רק התאריך (ללא שעה)
df['hour'] = df['timestamp'].dt.hour  # רק השעה

# שלב 4: ספירת הערכים לפי יום ושעה
hourly_counts = df.groupby(['date', 'hour']).size()

# הצגת התוצאות
print(hourly_counts)
