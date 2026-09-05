"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  const [boltonId, setBoltonId] = useState("");

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const value = boltonId.trim();

    if (!value) {
      return;
    }

    router.push(
      `/search?boltonId=${encodeURIComponent(value)}`
    );
  };

  return (
    <header className="flex h-16 w-full max-w-screen items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="relative w-full max-w-md"
      >
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          type="text"
          value={boltonId}
          onChange={(event) =>
            setBoltonId(event.target.value)
          }
          placeholder="Search by Bolton ID..."
          className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100"
        />
      </form>

      {/* Profile */}
      <button
        type="button"
        className="ml-6 flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-slate-100"
      >
        <div className="relative h-9 w-9 overflow-hidden rounded-full border border-slate-200">
          <Image
            src="/user.png"
            alt="User profile"
            fill
            className="object-cover"
          />
        </div>
      </button>
    </header>
  );
};

export default Header;