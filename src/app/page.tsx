"use client";

import { useEffect, useState } from "react";
import styles from "./FrontendTable.module.css";

interface RowData {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function home() {
  const [rows, setRows] = useState<RowData[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("frontendRows");
    if (saved) {
      setRows(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("frontendRows", JSON.stringify(rows));
  }, [rows]);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone) return;

    if (editId) {
      setRows(
        rows.map((row) =>
          row.id === editId ? { ...row, ...form } : row
        )
      );
      setEditId(null);
    } else {
      setRows([
        ...rows,
        { id: Date.now(), ...form },
      ]);
    }

    setForm({ name: "", email: "", phone: "" });
  };

  const handleEdit = (row: RowData) => {
    setForm({
      name: row.name,
      email: row.email,
      phone: row.phone,
    });
    setEditId(row.id);
  };

  const handleDelete = (id: number) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.title}>Frontend CRUD Table</h2>

        <div className={styles.form}>
          <input
            className={styles.input}
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
          <input
            className={styles.input}
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
          <input
            className={styles.input}
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <button className={styles.button} onClick={handleSubmit}>
            {editId ? "Update Data" : "Add Data"}
          </button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.empty}>
                  No data available
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>{row.phone}</td>
                  <td className={styles.actions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEdit(row)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(row.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
