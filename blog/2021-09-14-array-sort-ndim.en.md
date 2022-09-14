---
title: Python 2-dim array sort
date: '2022-01-20 18:46:37'
description: Python, Algorizm, Leetcode
category: Python
background: '#4169e1'
---

When you want to sort 2-dim array with Python, you can specify a method that returns a tuple with the elements you want as keys.

```
x.sort(key=method)
```

For example, sort date with string format especially month is not a integer originally.

```python

monthsMap = dict()
# Function which initializes the monthsMap
def sort_months():

    monthsMap["Jan"] = 1
    monthsMap["Feb"] = 2
    monthsMap["Mar"] = 3
    monthsMap["Apr"] = 4
    monthsMap["May"] = 5
    monthsMap["Jun"] = 6
    monthsMap["Jul"] = 7
    monthsMap["Aug"] = 8
    monthsMap["Sep"] = 9
    monthsMap["Oct"] = 10
    monthsMap["Nov"] = 11
    monthsMap["Dec"] = 12

def cmp(date):
    date = date.split()
    return (
        int(date[2]), # year
        monthsMap[date[1]], # month
        int(date[0]), # day
    )

if __name__ == "__main__":

    dates = [
        "24 Jul 2017",
        "25 Jul 2017",
        "13 Feb 2016",
        "11 Jun 1996",
        "01 Jan 2019",
        "12 Aug 2005",
        "01 Jan 1997",
    ]
    # Order the months
    sort_months()
    # Sort the dates
    dates.sort(key=cmp) # return type is tuple.
    # Print the sorted dates
    for i in range(len(dates)):
        print(dates[i])
```

# Result

```shell
$ python main.py
11 Jun 1996
01 Jan 1997
12 Aug 2005
13 Feb 2016
24 Jul 2017
25 Jul 2017
01 Jan 2019
```
