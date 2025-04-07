import pandas as pd
import os
from concurrent.futures import ThreadPoolExecutor
import shutil

# Function to load data with basic cleaning
def load_and_clean_data(file_path):
    try:
        df = pd.read_csv(file_path)
        print("CSV file loaded successfully.")
    except Exception as e:
        print(f"Error loading CSV file: {e}")
        return pd.DataFrame()

    # Convert to datetime and clean data
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce', dayfirst=True)
    df['value'] = pd.to_numeric(df['value'], errors='coerce')

    # Filter after conversions
    df = df.dropna(subset=['timestamp', 'value'])
    df = df.drop_duplicates(subset=['timestamp'])

    return df


# Function to split data into daily files
def split_data_by_day(df):
    # Create folders if they don't exist
    os.makedirs("daily_chunks", exist_ok=True)
    os.makedirs("hourly_averages", exist_ok=True)

    # Add date column and save each day to a separate file
    df['date'] = df['timestamp'].dt.date
    for date, group in df.groupby('date'):
        group.to_csv(f"daily_chunks/data_{date}.csv", index=False)


# Function to compute hourly average for a single file
def compute_hourly_average(file_name):
    path = os.path.join("daily_chunks", file_name)
    df_day = pd.read_csv(path)

    df_day['timestamp'] = pd.to_datetime(df_day['timestamp'], errors='coerce')
    df_day['value'] = pd.to_numeric(df_day['value'], errors='coerce')

    df_day = df_day.dropna(subset=['timestamp', 'value'])
    df_day['hour'] = df_day['timestamp'].dt.floor('h')

    # Compute hourly average
    hourly_avg = df_day.groupby('hour')['value'].mean().reset_index()

    # Save hourly results
    output_path = os.path.join("hourly_averages", f"hourly_{file_name}")
    hourly_avg.to_csv(output_path, index=False)


# Function to merge all results into a final file
def merge_hourly_averages():
    # Create output folder if not exists
    os.makedirs("hourly_averages", exist_ok=True)

    # Merge all files in the hourly_averages folder
    all_hourly_files = [pd.read_csv(os.path.join("hourly_averages", f)) for f in os.listdir("hourly_averages")]
    final_df = pd.concat(all_hourly_files)

    # Sort by hour and save final output
    final_df.sort_values(by='hour', inplace=True)
    final_df.to_csv("final_output.csv", index=False)

    print("✅ Final file successfully created: final_output.csv")


# Step 1: Load and prepare the data

# Delete old folders if they exist
shutil.rmtree("daily_chunks", ignore_errors=True)
shutil.rmtree("hourly_averages", ignore_errors=True)

file_path = "time_series.csv"
df = load_and_clean_data(file_path)

# Step 2: Split into daily files
split_data_by_day(df)

# Step 3: Parallel processing to compute hourly averages per daily file
chunk_files = os.listdir("daily_chunks")
with ThreadPoolExecutor() as executor:
    executor.map(compute_hourly_average, chunk_files)

# Step 4: Merge the final results into one file
merge_hourly_averages()
