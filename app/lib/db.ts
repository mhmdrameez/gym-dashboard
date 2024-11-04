import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: 13438,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const raw = async (sql: string, bindings?: any) => {
    try {
      const [rows] = await db.execute(sql, bindings);
  
      // Check if rows is an array to handle SELECT queries
      if (Array.isArray(rows)) {
        return rows.length === 1 ? rows[0] : rows;
      }
  
      // Return rows directly for non-SELECT queries (like INSERT, UPDATE)
      return rows;
    } catch (error) {
      console.error("Database query error:", error);
      throw new Error("Failed to execute query.");
    }
  };
  