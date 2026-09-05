"use client";

import React, { useRef, useState } from "react";
import axios from "axios";
import {
  Upload,
  FileSpreadsheet,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

const UploadPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleFile = (selectedFile: File) => {
    setSuccess("");
    setError("");

    const isExcel =
      selectedFile.name.toLowerCase().endsWith(".xlsx") ||
      selectedFile.name.toLowerCase().endsWith(".xls");

    if (!isExcel) {
      setError("Please select an Excel file (.xlsx or .xls).");
      return;
    }

    setFile(selectedFile);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setSuccess("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an Excel file first.");
      return;
    }

    setUploading(true);
    setSuccess("");
    setError("");

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await axios.post(
        "/api/upload",
        formData
      );

      if (response.status === 201) {
        setSuccess(
          `Successfully uploaded "${file.name}". ${response.data.rowCount} rows imported.`
        );

        setFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        router.push("/");
        window.location.reload();

      }
    } catch (error: any) {
      console.error("Upload failed:", error);

      const message =
        error.response?.data?.error ||
        "Failed to upload the Excel file.";

      setError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Upload Sheet
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Upload an Excel file to add a new dataset to the system.
        </p>
      </div>

      {/* Upload Card */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Excel File
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            The file must contain a column named exactly{" "}
            <span className="font-medium text-slate-700">
              Bolton ID
            </span>
            .
          </p>
        </div>

        <div className="p-6">
          {/* Drop Zone */}
          {!file && (
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-16 text-center transition ${
                isDragging
                  ? "border-slate-500 bg-slate-50"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Upload className="h-5 w-5 text-slate-600" />
              </div>

              <p className="text-sm font-medium text-slate-900">
                Drop your Excel file here
              </p>

              <p className="mt-1 text-sm text-slate-500">
                or click to browse from your computer
              </p>

              <p className="mt-4 text-xs text-slate-400">
                Supported formats: .xlsx, .xls
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* Selected File */}
          {file && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200">
                    <FileSpreadsheet className="h-5 w-5 text-slate-600" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {file.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="ml-4 rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />

              <p className="text-sm text-green-700">
                {success}
              </p>
            </div>
          )}

          {/* Upload Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleUpload}
              disabled={!file || uploading}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />

              {uploading ? "Uploading..." : "Upload Sheet"}
            </button>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-slate-900">
          Before uploading
        </h3>

        <ul className="mt-3 space-y-2 text-sm text-slate-500">
          <li className="flex gap-2">
            <span className="text-slate-400">•</span>
            The file must be an Excel spreadsheet.
          </li>

          <li className="flex gap-2">
            <span className="text-slate-400">•</span>
            The workbook must contain exactly one worksheet.
          </li>

          <li className="flex gap-2">
            <span className="text-slate-400">•</span>
            Every row must contain a valid Bolton ID.
          </li>

          <li className="flex gap-2">
            <span className="text-slate-400">•</span>
            The Bolton ID column must be named exactly{" "}
            <span className="font-medium text-slate-700">
              Bolton ID
            </span>
            .
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UploadPage;
