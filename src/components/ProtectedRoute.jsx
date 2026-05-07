import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

const ProtectedRoute = ({ children, requiredRole, redirectTo = "/login" }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "usuarios", currentUser.uid));
          if (userDoc.exists()) {
            const role = userDoc.data().role || "comum";
            setUserRole(role);
          } else {
            setUserRole("comum");
          }
        } catch (error) {
          console.error("Erro ao buscar papel do usuário:", error);
          setUserRole("comum");
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} />;
  }


  const hasAccess = () => {
    if (!userRole) return false;

    switch (requiredRole) {
      case "admin":
        return userRole === "admin";
      case "saude":
        return userRole === "admin" || userRole === "saude";
      case "comum":
        return userRole === "admin" || userRole === "saude" || userRole === "comum";
      default:
        return false;
    }
  };

  if (!hasAccess()) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;