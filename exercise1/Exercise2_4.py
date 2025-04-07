import pandas as pd

# Load Parquet file with error handling
def load_parquet_file(file_path):
    try:
        df = pd.read_parquet(file_path)  # This is the change between opening the two file types
        print("Parquet file loaded successfully.")
        return df
    except Exception as e:
        print(f"Error loading Parquet file: {e}")
        return pd.DataFrame()


# Data preprocessing
def preprocess_data(df):
    # Convert the 'timestamp' column
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce', dayfirst=True)
    df['value'] = pd.to_numeric(df['value'], errors='coerce')

    # Filter after conversion
    df = df.dropna(subset=['timestamp', 'value'])
    df = df.drop_duplicates(subset=['timestamp'])

    return df


# Calculate hourly averages
def calculate_hourly_average(df):
    df['hour'] = df['timestamp'].dt.floor('h')
    hourly_avg = df.groupby('hour')['value'].mean().reset_index()
    return hourly_avg


# Save to CSV
def save_to_csv(df, output_file="hourly_average.csv"):
    try:
        df.to_csv(output_file, index=False)
        print(f"Results successfully saved to {output_file}")
    except Exception as e:
        print(f"Error saving the file: {e}")


# Running the script
file_path = "time_series.parquet"
df = load_parquet_file(file_path)

if not df.empty:
    df = preprocess_data(df)
    hourly_avg = calculate_hourly_average(df)

    if not hourly_avg.empty:
        save_to_csv(hourly_avg)

#  1. **Columnar Storage**
# Data is stored by columns instead of rows, which allows faster access to just the needed data.

#  2. **Efficient Compression**
# The file is compressed, saving space and reducing access time.

#  3. **Data Types Support**
# Ensures that the correct data types are maintained, avoiding conversion errors and keeping the data accurate.

#  4. **Tool Integration**
# The format supports tools like Spark and Pandas, making it easier to analyze large datasets efficiently.

#  5. **Time Series Friendly**
# It allows for easy processing of time-based data and integrates well with tools like pandas for time series analysis.
