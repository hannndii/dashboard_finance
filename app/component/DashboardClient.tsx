'use client';

import { useState } from "react";
import InputPanel from "./InputPanel";

export default function DashboardClient({ children }: any) {
  const [showInput, setShowInput] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowInput(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium"
      >
        + Input Transaksi
      </button>

      {showInput && (
        <InputPanel onClose={() => setShowInput(false)} />
      )}
    </>
  );
}