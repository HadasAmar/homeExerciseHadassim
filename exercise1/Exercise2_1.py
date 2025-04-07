import pandas as pd

# Load CSV file with error handling
def load_csv_file(file_path):
    try:
        df = pd.read_csv(file_path)
        print("CSV file loaded successfully.")
        return df
    except Exception as e:
        print(f"Error loading CSV file: {e}")
        return pd.DataFrame()


# Data preprocessing
def preprocess_data(df):
    # Convert timestamp column
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce', dayfirst=True)

    # Convert numerical values
    df['value'] = pd.to_numeric(df['value'], errors='coerce')

    # Remove invalid rows
    df = df.dropna(subset=['timestamp', 'value'])

    # Remove duplicates
    df = df.drop_duplicates(subset=['timestamp'])

    return df


# Calculate hourly averages
def calculate_hourly_average(df):
    df['hour'] = df['timestamp'].dt.floor('h')
    hourly_avg = df.groupby('hour')['value'].mean().reset_index()
    return hourly_avg


# Run
file_path = "time_series.csv"
df = load_csv_file(file_path)

if not df.empty:
    df = preprocess_data(df)
    hourly_avg = calculate_hourly_average(df)

    if not hourly_avg.empty:
        print(hourly_avg)
