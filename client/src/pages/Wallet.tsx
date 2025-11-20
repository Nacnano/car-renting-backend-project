import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  createdAt: string;
}

export default function Wallet() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/transactions");
        setTransactions(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTransaction = async (type: "deposit" | "withdraw") => {
    const amount = prompt(`Enter amount to ${type}:`);
    if (!amount) return;

    try {
      await api.post(`/transactions/${type}`, { amount: Number(amount) });
      toast.success(`${type} successful`);
      refreshUser();
      fetchTransactions();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Transaction failed");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded shadow mb-6">
        <h1 className="text-3xl font-bold mb-4">Wallet</h1>
        <p className="text-2xl mb-4">
          Balance:{" "}
          <span className="font-bold text-green-600">{user?.balance}</span>
        </p>
        <div className="space-x-4">
          <button
            onClick={() => handleTransaction("deposit")}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Deposit
          </button>
          <button
            onClick={() => handleTransaction("withdraw")}
            className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
          >
            Withdraw
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Type</th>
              <th className="py-2 px-4 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id} className="border-t">
                <td className="py-2 px-4">
                  {new Date(t.createdAt).toLocaleString()}
                </td>
                <td className="py-2 px-4 capitalize">{t.type}</td>
                <td
                  className={`py-2 px-4 font-bold ${
                    t.amount > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t.amount > 0 ? "+" : ""}
                  {t.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
