import { useState, useEffect, useCallback } from "react";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/api";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchUsers();
      const base = res.data;
      const departments = [
        "Engineering",
        "Design",
        "Marketing",
        "Sales",
        "HR",
        "Finance",
        "Product",
        "Operations",
      ];
      const expanded = [];
      let idCounter = 1;
      for (let i = 0; i < 5; i++) {
        base.forEach((u) => {
          expanded.push({
            ...u,
            id: idCounter++,
            name: `${u.name.split(" ")[0]}${i > 0 ? i + 1 : ""} ${u.name.split(" ").slice(1).join(" ")}`,
            firstName: u.name.split(" ")[0] + (i > 0 ? i + 1 : ""),
            lastName: u.name.split(" ").slice(1).join(" ") || "Smith",
            department: departments[(idCounter + i) % departments.length],
          });
        });
      }
      setUsers(
        expanded.map((u) => ({
          id: u.id,
          firstName: u.firstName || u.name.split(" ")[0],
          lastName: u.lastName || u.name.split(" ").slice(1).join(" ") || "",
          email: u.email,
          department: u.department,
        })),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const addUser = useCallback(
    async (userData) => {
      const res = await createUser(userData);
      const newUser = {
        ...userData,
        id: users.length + 1 + Math.floor(Math.random() * 1000),
      };
      setUsers((prev) => [newUser, ...prev]);
      return newUser;
    },
    [users.length],
  );

  const editUser = useCallback(async (id, userData) => {
    await updateUser(id, userData);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...userData, id } : u)),
    );
  }, []);

  const removeUser = useCallback(async (id) => {
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  return {
    users,
    loading,
    error,
    addUser,
    editUser,
    removeUser,
    reload: loadUsers,
  };
}
