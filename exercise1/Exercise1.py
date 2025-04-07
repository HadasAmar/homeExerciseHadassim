import os
from collections import Counter
from concurrent.futures import ThreadPoolExecutor


# Splitting the log file into smaller files
def split_log_file(file_path, split_folder, lines_per_file):
    if not os.path.exists(split_folder):
        os.makedirs(split_folder)

    with open(file_path, 'r', encoding='utf-8') as logs:
        lines = logs.readlines()

    for i in range(0, len(lines), lines_per_file):
        current_file_lines = lines[i:i + lines_per_file]
        file_path = os.path.join(split_folder, f"part_{i // lines_per_file + 1}.txt")
        with open(file_path, 'w', encoding='utf-8') as current_file:
            current_file.writelines(current_file_lines)

    print(f"Splitting the file into {len(lines) // lines_per_file} parts completed!")


# Counting errors in a single file
def count_errors_in_file(file_path):
    error_counter = Counter()
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            # Extract the error from the line
            error_code = line.split("Error: ")[1].strip(' "\n')
            error_counter[error_code] += 1
    return error_counter


# Analyzing the log file
def analyze_logs(file_path, N=5):
    split_folder = "split_logs"  # The folder that will contain the parts
    lines_per_file = 100000      # Number of lines per file

    # Split the file into smaller chunks
    split_log_file(file_path, split_folder, lines_per_file)

    # Create a ThreadPoolExecutor for parallel processing
    total_error_counter = Counter()
    with ThreadPoolExecutor() as executor:
        # Collect all part files
        part_files = [os.path.join(split_folder, f) for f in os.listdir(split_folder) if f.endswith('.txt')]
        # Process files in parallel
        results = executor.map(count_errors_in_file, part_files)

        # Update the total error counter
        for result in results:
            total_error_counter.update(result)

    # Get the N most common error codes
    most_common_errors = total_error_counter.most_common(N)

    print(f"The {N} most common error codes:")
    for error_code, count in most_common_errors:
        print(f"{error_code}: {count} times")


# Run the function with the path to the log file
analyze_logs("logs.txt", N=5)


# סיבוכיות זמן (Time Complexity)
# נסמן:
#
# L – מספר השורות בקובץ הלוגים
#
# E – מספר הקבצים לאחר הפיצול (L \\ lines_per_file)
#
# U – מספר קודי השגיאה הייחודיים
#
# N – מספר קודי השגיאה הנפוצים שרוצים להחזיר (בד"כ קבוע קטן)
#
# קריאת הקובץ כולו לזיכרון באמצעות readlines() מתבצעת בזמן של O(L).
#
# כתיבת הקבצים הקטנים לאחר הפיצול מתבצעת גם היא בזמן O(L) – כל שורה נכתבת פעם אחת.
#
# כל אחד מהקבצים הקטנים נקרא ומעובד בנפרד לצורך ספירת שגיאות – סה"כ עיבוד כל השורות הוא שוב O(L).
#
# איחוד תוצאות הספירה מכל הקבצים באמצעות אובייקט מסוג Counter מתבצע בזמן של O(E * U).
#
# שליפת N קודי השגיאה הנפוצים ביותר (באמצעות most_common(N)) מתבצעת בזמן O(U log N).
#
# לכן, סה"כ סיבוכיות הזמן של האלגוריתם היא:
#
# O(L + U log N)



# סיבוכיות מקום (Space Complexity)
# כל הקובץ נקרא לזיכרון כ־רשימת שורות – צורך O(L) מקום בזיכרון.
#
# במהלך הספירה נוצר מילון של כל קודי השגיאה והספירה שלהם – צורך O(U) מקום בזיכרון.
#
# בנוסף, נוצרים קבצי טקסט זמניים בתיקייה ייעודית (split_logs) – נפח האחסון הכולל שווה לנפח של הקובץ המקורי (כלומר O(L) דיסק).
#
# לכן:
#
# סיבוכיות מקום בזיכרון: O(L + U)
#
# סיבוכיות מקום בדיסק: O(L)