"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Upload, X, Link2, Loader2, ImagePlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/Toast";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const { showToast } = useToast();

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("Solo se permiten archivos de imagen", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("La imagen no puede pesar mas de 5MB", "error");
      return;
    }

    setUploading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const ext = file.name.split(".").pop();
      const path = `${user?.id || "anon"}/${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from("pet-images")
        .upload(path, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("pet-images").getPublicUrl(path);

      onChange(publicUrl);
      showToast("Foto subida", "success");
    } catch {
      showToast("No se pudo subir la foto, intenta de nuevo", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div>
      <label className="label">Foto de la mascota</label>

      {value ? (
        <div className="relative w-full aspect-video rounded-balulu-sm overflow-hidden border-2 border-balulu-border">
          <Image src={value} alt="Vista previa" fill className="object-cover" sizes="500px" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`w-full aspect-video rounded-balulu-sm border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
            dragActive
              ? "border-balulu-primary-500 bg-balulu-primary-50"
              : "border-balulu-border hover:border-balulu-primary-300 hover:bg-balulu-background"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-balulu-primary-500 animate-spin" />
              <p className="text-sm text-balulu-muted">Subiendo...</p>
            </>
          ) : (
            <>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ImagePlus className="w-9 h-9 text-balulu-primary-400" />
              </motion.div>
              <p className="text-sm font-semibold text-balulu-text">
                Arrastra una foto o haz clic para elegir
              </p>
              <p className="text-xs text-balulu-muted">PNG o JPG, maximo 5MB</p>
            </>
          )}
        </div>
      )}

      {!value && (
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="flex items-center gap-1.5 text-xs font-semibold text-balulu-muted hover:text-balulu-primary-600 mt-2 transition-colors"
        >
          <Link2 className="w-3.5 h-3.5" />
          O pega un link de imagen
        </button>
      )}

      {showUrlInput && !value && (
        <input
          type="url"
          onChange={(e) => onChange(e.target.value)}
          className="input mt-2"
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      )}
    </div>
  );
}
