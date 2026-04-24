import sqlite3

def make_admin():
    try:
        # Database se connect karein
        conn = sqlite3.connect('Grievance.db')
        cursor = conn.cursor()

        # Pehle check karein ki users hain ya nahi
        cursor.execute("SELECT id, email, is_admin FROM users")
        users = cursor.fetchall()
        
        if not users:
            print("Database mein koi user nahi mila. Pehle register karein!")
            return

        print("Users list:", users)

        # Pehle wale user (ID: 1) ko admin banate hain
        cursor.execute("UPDATE users SET is_admin = 1 WHERE id = 1")
        
        conn.commit()
        print("\nSUCCESS: User ID 1 ab ADMIN ban gaya hai!")
        
        conn.close()
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    make_admin()