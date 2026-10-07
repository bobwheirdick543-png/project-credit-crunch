import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Building2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatNairaFull } from "./currency";

export type BankTransaction = {
  id: string;
  type: "purchase" | "deposit" | "withdrawal" | "transfer" | "income";
  amount: number;
  label: string;
  timestamp: number;
};

type BankToast = {
  id: string;
  message: string;
  sub: string;
  timestamp: number;
};

type BankContextValue = {
  balance: number;
  setBalance: (n: number | ((prev: number) => number)) => void;
  transactions: BankTransaction[];
  notify: (tx: Omit<BankTransaction, "id" | "timestamp">) => void;
  deduct: (amount: number, label: string) => boolean;
  deposit: (amount: number, label?: string) => void;
};

const BankContext = createContext<BankContextValue | null>(null);
const STORAGE_KEY = "sl-bank-balance";
const TX_KEY = "sl-bank-tx";

export function BankProvider({ children }: { children: ReactNode }) {
  const [balance, setBalanceState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? Number(stored) : 5000;
  });
  const [transactions, setTransactions] = useState<BankTransaction[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(TX_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [toasts, setToasts] = useState<BankToast[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(balance));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem(TX_KEY, JSON.stringify(transactions.slice(0, 50)));
  }, [transactions]);

  const setBalance = (n: number | ((prev: number) => number)) => {
    setBalanceState((prev) => (typeof n === "function" ? n(prev) : n));
  };

  const notify = (tx: Omit<BankTransaction, "id" | "timestamp">) => {
    const full: BankTransaction = {
      ...tx,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setTransactions((prev) => [full, ...prev].slice(0, 50));

    const toastId = crypto.randomUUID();
    const verb =
      tx.type === "purchase"
        ? "You spent"
        : tx.type === "deposit"
          ? "You deposited"
          : tx.type === "withdrawal"
            ? "You withdrew"
            : tx.type === "transfer"
              ? "You transferred"
              : "You received";

    setToasts((prev) => [
      ...prev,
      {
        id: toastId,
        message: `${verb} ${formatNairaFull(tx.amount)}`,
        sub: tx.label,
        timestamp: Date.now(),
      },
    ]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 4000);
  };

  const deduct = (amount: number, label: string): boolean => {
    if (balance < amount) return false;
    setBalance((b) => b - amount);
    notify({ type: "purchase", amount, label });
    return true;
  };

  const deposit = (amount: number, label = "Deposit") => {
    setBalance((b) => b + amount);
    notify({ type: "deposit", amount, label });
  };

  const value = useMemo(
    () => ({ balance, setBalance, transactions, notify, deduct, deposit }),
    [balance, transactions]
  );

  return (
    <BankContext.Provider value={value}>
      {children}
      {/* Apple-style toast stack */}
      <div className="pointer-events-none fixed right-4 top-20 z-[100] flex w-[min(100vw-2rem,320px)] flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="pointer-events-auto glass-card flex items-start gap-3 rounded-2xl p-3 shadow-lg"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-tight">{t.message}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{t.sub}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </BankContext.Provider>
  );
}

export function useBank() {
  const ctx = useContext(BankContext);
  if (!ctx) throw new Error("useBank must be used inside BankProvider");
  return ctx;
}
