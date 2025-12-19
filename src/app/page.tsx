"use client";

import { useEffect, useState } from "react";
import styles from "./FrontendTable.module.css";

interface RowData {
  id: number;
  name: string;
  email: string;
  phone: string;
}

/* 🔹 FIXED LOCAL SAMPLE DATA (5 ROWS) */
const SAMPLE_DATA: RowData[] = [
  { id: 1, name: "Amit Sharma", email: "amit@gmail.com", phone: "9876543210" },
  { id: 2, name: "Priya Verma", email: "priya@gmail.com", phone: "9123456780" },
  { id: 3, name: "Rahul Singh", email: "rahul@gmail.com", phone: "9988776655" },
  { id: 4, name: "Neha Gupta", email: "neha@gmail.com", phone: "9090909090" },
  { id: 5, name: "Karan Mehta", email: "karan@gmail.com", phone: "9812345678" },
];

export default function home() {
  const [rows, setRows] = useState<RowData[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [editId, setEditId] = useState<number | null>(null);

  /* 🔹 Load sample data once */
  useEffect(() => {
    const saved = sessionStorage.getItem("frontendRows");
    if (saved) {
      setRows(JSON.parse(saved));
    } else {
      setRows(SAMPLE_DATA);
      sessionStorage.setItem("frontendRows", JSON.stringify(SAMPLE_DATA));
    }
  }, []);

  /* 🔹 Save updates to sessionStorage */
  useEffect(() => {
    sessionStorage.setItem("frontendRows", JSON.stringify(rows));
  }, [rows]);

  /* 🔹 Add / Update with TRIM */
  const handleSubmit = () => {
    const trimmedForm = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };

    // Prevent empty or spaces-only input
    if (!trimmedForm.name || !trimmedForm.email || !trimmedForm.phone) return;

    if (editId) {
      setRows(rows.map(r => (r.id === editId ? { ...r, ...trimmedForm } : r)));
      setEditId(null);
    } else {
      setRows([...rows, { id: Date.now(), ...trimmedForm }]);
    }

    setForm({ name: "", email: "", phone: "" });
  };

  /* 🔹 Edit row */
  const handleEdit = (row: RowData) => {
    setForm({
      name: row.name.trim(),
      email: row.email.trim(),
      phone: row.phone.trim(),
    });
    setEditId(row.id);
  };

  /* 🔹 Delete row */
  const handleDelete = (id: number) => {
    setRows(rows.filter(r => r.id !== id));
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.title}>Frontend CRUD </h2>

        {/* 🔹 Form */}
        <div className={styles.form}>
          <input
            className={styles.input}
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className={styles.input}
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className={styles.input}
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <button className={styles.button} onClick={handleSubmit}>
            {editId ? "Update Data" : "Add Data"}
          </button>
        </div>

        {/* 🔹 Table */}
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
                  No data
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

