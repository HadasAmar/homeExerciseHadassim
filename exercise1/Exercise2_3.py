# 1. Data Structure:
# We will use a dictionary to store data for each hour.
# Each hour will be a key in the dictionary,
# and the values will be lists containing all the data that arrived for that hour.

# 2. Adding Data:
# Each time new data arrives, we calculate the current hour (rounded to the nearest hour),
# and use the dictionary to store the data under the appropriate hour.
#
# If the hour already exists in the dictionary, we add the value to its list.
#
# If the hour doesn’t exist, we create a new list for that hour and add the value to it.

# 3. Calculating the Average:
# For each hour, we calculate the average of the values stored in that hour's list.
#
# This calculation is done for all the values for that hour,
# and each time new data arrives, the average is updated based on the new values.

# 4. Saving Data:
# In a system where data comes in real-time, when a new hour starts,
# we calculate the average for the previous hour, and then we delete the data for that hour.
# This helps save memory by not keeping unnecessary data.
