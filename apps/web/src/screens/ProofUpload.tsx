import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSubmitProofMutation } from "../hooks/useVerification";
import {
  ArrowLeft,
  UploadCloud,
  X,
  Camera,
  Image,
  CheckCircle2,
} from "lucide-react";
import { cn } from "../lib/utils";

export const ProofUpload = () => {
  const navigate = useNavigate();
  const submitProof = useSubmitProofMutation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [dragging, setDragging] = useState(false);

  const handleFiles = (newFiles: File[]) => {
    const valid = newFiles.filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/"),
    );
    setFiles((prev) => [...prev, ...valid].slice(0, 5));
    valid.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (e) =>
        setPreviews((prev) => [...prev, e.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeFile = (i: number) => {
    setFiles(files.filter((_, fi) => fi !== i));
    setPreviews(previews.filter((_, pi) => pi !== i));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    formData.append("note", note);
    await submitProof.mutateAsync(formData);
    navigate(-1);
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-zinc-100"
        >
          <ArrowLeft size={20} className="text-zinc-600" />
        </button>
        <div>
          <h1 className="text-xl font-black text-zinc-900">Submit Proof</h1>
          <p className="text-xs text-zinc-500">
            Your buddy will verify your submission
          </p>
        </div>
      </div>

      {/* Task context */}
      <div className="card p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-zinc-900">Morning Run — 8km</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Goal: Run a Full Marathon
            </p>
          </div>
          <span
            className="badge"
            style={{
              background: "#F5F3FF",
              color: "#6D28D9",
              border: "1px solid #DDD6FE",
            }}
          >
            +200 XP
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 rounded-lg">
          <div className="w-7 h-7 rounded-full border border-zinc-200 bg-white overflow-hidden shrink-0">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
              alt="Alex"
              className="w-full h-full"
            />
          </div>
          <p className="text-xs text-blue-700 font-medium">
            Alex K. will review this before XP is awarded
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(Array.from(e.dataTransfer.files));
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all",
          dragging
            ? "border-[#2D9CDB] bg-blue-50"
            : "border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50",
        )}
      >
        <div
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center transition-colors",
            dragging ? "bg-[#2D9CDB]" : "bg-zinc-100",
          )}
        >
          <UploadCloud
            size={28}
            className={dragging ? "text-white" : "text-zinc-400"}
          />
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-700">
            Click to upload or drag & drop
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            PNG, JPG, MP4 up to 10MB · Max 5 files
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(Array.from(e.target.files ?? []))}
        />
      </div>

      {/* Quick capture */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.capture = "environment";
              inputRef.current.click();
            }
          }}
          className="flex flex-col items-center gap-2 py-4 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
        >
          <Camera size={22} className="text-zinc-500" />
          <span className="text-sm font-medium text-zinc-600">Take Photo</span>
        </button>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center gap-2 py-4 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
        >
          <Image size={22} className="text-zinc-500" />
          <span className="text-sm font-medium text-zinc-600">
            Choose Gallery
          </span>
        </button>
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-zinc-500 mb-2">
            Selected files ({previews.length}/5)
          </p>
          <div className="grid grid-cols-3 gap-2">
            {previews.map((src, i) => (
              <div
                key={i}
                className="relative rounded-xl overflow-hidden border border-zinc-200"
              >
                <img
                  src={src}
                  alt={`Preview ${i + 1}`}
                  className="w-full h-24 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/80"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Note */}
      <div className="card p-4">
        <label className="block text-sm font-semibold text-zinc-700 mb-2">
          Note (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add context for your buddy — any PR, how you felt, etc."
          rows={3}
          className="form-input resize-none"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={files.length === 0 || submitProof.isPending}
        className="w-full py-3.5 bg-[#1A3C6E] text-white font-bold rounded-xl hover:bg-[#15305a] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
      >
        {submitProof.isPending ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
            Submitting...
          </>
        ) : (
          <>
            <CheckCircle2 size={18} /> Submit for Verification
          </>
        )}
      </button>
    </div>
  );
};
