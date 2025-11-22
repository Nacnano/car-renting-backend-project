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
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/transactions");
      setTransactions(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async (type: "deposit" | "withdraw") => {
    const amount = prompt(
      `💰 ${
        type === "deposit" ? "Deposit Money" : "Withdraw Money"
      }\n\nEnter amount:`,
      "1000"
    );
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      if (amount !== null) toast.error("Please enter a valid amount");
      return;
    }

    setProcessing(true);
    try {
      await api.post(`/transactions/${type}`, { amount: Number(amount) });
      toast.success(
        `✅ ${type === "deposit" ? "Deposited" : "Withdrawn"} ฿${Number(
          amount
        ).toLocaleString()} successfully`
      );
      refreshUser();
      fetchTransactions();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Transaction failed");
    } finally {
      setProcessing(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return "💵";
      case "withdraw":
        return "💸";
      case "payment":
        return "🛒";
      case "refund":
        return "↩️";
      default:
        return "💰";
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "text-green-600";
      case "withdraw":
        return "text-orange-600";
      case "payment":
        return "text-red-600";
      case "refund":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl shadow-2xl p-8 text-white mb-8 transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-2">
                Total Balance
              </p>
              <h1 className="text-5xl font-bold mb-1">
                ฿{user?.balance?.toLocaleString() || "0"}
              </h1>
              <p className="text-blue-200 text-sm">Available to spend</p>
            </div>
            <div className="text-7xl opacity-20">💳</div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => handleTransaction("deposit")}
              disabled={processing}
              className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>💵</span>
              <span>Deposit</span>
            </button>
            <button
              onClick={() => handleTransaction("withdraw")}
              disabled={processing}
              className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>💸</span>
              <span>Withdraw</span>
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Transaction History
            </h2>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              {transactions.length} transactions
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📜</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Transactions Yet
              </h3>
              <p className="text-gray-500">
                Your transaction history will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((t) => (
                <div
                  key={t._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{getTransactionIcon(t.type)}</div>
                    <div>
                      <p className="font-semibold text-gray-800 capitalize">
                        {t.type}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(t.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`text-2xl font-bold ${getTransactionColor(
                      t.type
                    )}`}
                  >
                    {t.amount > 0 ? "+" : ""}฿
                    {Math.abs(t.amount).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
