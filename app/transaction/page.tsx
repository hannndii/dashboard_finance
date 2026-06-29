"use client";

import { useEffect, useState } from "react";
import Sidebar from "../component/Sidebar";
import Topbar from "../component/Topbar";
import EditTransactionModal from "../component/EditTransactionModal";

import {
  getAllTransactions,
  deleteTransaction,
} from "../action";

import {
  Search,
  Trash2,
  Pencil,
} from "lucide-react";

export default function TransactionPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  async function loadTransactions() {
    const data = await getAllTransactions();
    setTransactions(data);
    setFilteredTransactions(data);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    const filtered = transactions.filter((trx) =>
      trx.productName.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredTransactions(filtered);
  }, [search, transactions]);

  async function handleDelete(id: string) {
    await deleteTransaction(id);
    await loadTransactions();
  }

  const formatRp = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-8">

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-4xl font-light text-slate-700">
              Riwayat Transaksi
            </h1>

            <p className="text-slate-600 mt-2 text-lg">
              Semua transaksi yang telah tersimpan
            </p>
          </div>

          {/* SEARCH */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center gap-3 border border-slate-200">
            <Search size={18} className="text-slate-500" />

            <input
              type="text"
              placeholder="Cari transaksi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none text-black placeholder:text-slate-400"
            />
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="py-4 text-black font-semibold">Produk</th>
                  <th className="py-4 text-black font-semibold">Qty</th>
                  <th className="py-4 text-black font-semibold">Metode</th>
                  <th className="py-4 text-black font-semibold">Total</th>
                  <th className="py-4 text-black font-semibold">Tanggal</th>
                  <th className="py-4 text-black font-semibold">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((trx) => (
                    <tr
                      key={trx._id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                      {/* Produk */}
                      <td className="py-5">
                        <div>
                          <p className="font-semibold text-black text-base">
                            {trx.productName}
                          </p>
                        </div>
                      </td>

                      {/* Qty */}
                      <td>
                        <span className="font-semibold text-black">
                          {trx.qty}
                        </span>
                      </td>

                      {/* Metode */}
                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            trx.paymentMethod === "QRIS"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {trx.paymentMethod}
                        </span>
                      </td>

                      {/* Total */}
                      <td>
                        <span className="font-semibold text-black">
                          {formatRp(trx.total)}
                        </span>
                      </td>

                      {/* Tanggal */}
                      <td>
                        <div>
                          <p className="text-black font-medium">
                            {new Date(trx.createdAt).toLocaleDateString(
                              "id-ID"
                            )}
                          </p>
                          <p className="text-sm text-slate-500">
                            {new Date(trx.createdAt).toLocaleTimeString(
                              "id-ID",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </td>

                      {/* Aksi */}
                      <td>
                        <div className="flex gap-2">

                          {/* Edit */}
                          <button
                            onClick={() => {
                              setSelectedTransaction(trx);
                              setShowEditModal(true);
                            }}
                            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-600 p-2 rounded-lg transition"
                          >
                            <Pencil size={16} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(trx._id)}
                            className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-8 text-slate-400"
                    >
                      Tidak ada transaksi ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </main>
      </div>

      {/* EDIT MODAL */}
      {showEditModal && selectedTransaction && (
        <EditTransactionModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTransaction(null);
            loadTransactions();
          }}
        />
      )}
    </div>
  );
}