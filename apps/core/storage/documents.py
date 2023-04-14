import sqlite3

class Documents(): 
    def __init__(self, name, content): 
        conn = sqlite3.connect('storage.db')
        c = conn.cursor()
        self.name = name
        self.content = content

    def create_table(self):
        self.c.execute("CREATE TABLE documents (id INTEGER PRIMARY KEY, name TEXT, content TEXT)")
        self.conn.commit()

    def save(self): 
        self.c.execute("INSERT INTO documents (name, content) VALUES (?, ?)", (self.name, self.content))
        conn.commit()

    def load(self): 
        c.execute("SELECT * FROM documents")
        return c.fetchall()

    def delete(self): 
        c.execute("DELETE FROM documents WHERE name = ?", (self.name,))
        conn.commit()

    def update(self): 
        c.execute("UPDATE documents SET content = ? WHERE name = ?", (self.content, self.name))
        conn.commit()

    def __repr__(self): 
        return f"Document(name={self.name}, content={self.content})"