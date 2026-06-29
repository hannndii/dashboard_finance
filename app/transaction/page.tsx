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

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-8">

          <div className="mb-8">
            <h1 className="text-4xl font-light text-slate-700">
              Riwayat Transaksi
            </h1>

            <p className="text-slate-500 mt-2">
              Semua transaksi yang telah tersimpan
            </p>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center gap-3">
            <Search size={18} className="text-slate-400" />

            <input
              type="text"
              placeholder="Cari transaksi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none text-black"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-slate-400">
                  <th className="py-4 text-black">Produk</th>
                  <th className="py-4 text-black">Qty</th>
                  <th className="py-4 text-black">Metode</th>
                  <th className="py-4 text-black">Total</th>
                  <th className="py-4 text-black">Tanggal</th>
                  <th className="py-4 text-black">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((trx) => (
                  <tr key={trx._id} className="border-b hover:bg-slate-50">

                    <td>{trx.productName}</td>
                    <td>{trx.qty}</td>
                    <td>{trx.paymentMethod}</td>
                    <td>Rp {trx.total.toLocaleString("id-ID")}</td>
                    <td>
                      {new Date(trx.createdAt).toLocaleDateString("id-ID")}
                    </td>

                    <td>
                      <div className="flex gap-2">

                        <button
                          onClick={() => {
                            setSelectedTransaction(trx);
                            setShowEditModal(true);
                          }}
                          className="bg-yellow-100 text-yellow-600 p-2 rounded-lg"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(trx._id)}
                          className="bg-red-100 text-red-600 p-2 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </main>
      </div>

      {/* Edit Modal */}
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