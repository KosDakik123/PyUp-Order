import sqlite3

conn = sqlite3.connect('app.db')
cursor = conn.cursor()

try:
    cursor.execute("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'")
    conn.commit()
    print("Column added successfully!")
except Exception as e:
    print(f"Error: {e}")
finally:
    conn.close()