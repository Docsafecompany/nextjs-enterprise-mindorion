"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { FREE_LIMIT, getFreeUsed, hasFreeLeft, incFreeUsed } from "@/lib/freeQuota";

type Mode = "correct" | "rephrase";

export default function DocSafeUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "info" | "success" | "error"; text: string } | null>(null);
  const [used, setUsed] = useState<number>(() => getFreeUsed());
  const left = useMemo(() => Math.max(FREE_LIMIT - used, 0), [used]);

  const onBrowse = () => inputRef.current?.click();

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (busy) return;
      const files = e.dataTransfer?.files;
      handleFiles(files);
    },
    [busy]
  );

  const prevent = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const file = files[0];
    const mode: Mode = "correct"; // TODO: exposer un sélecteur si tu veux activer "rephrase"

    if (!hasFreeLeft()) {
      setMsg({
        type: "error",
        text: `Limite gratuite atteinte (${FREE_LIMIT}). Créez un compte ou consultez la page Pricing.`,
      });
      return;
    }

    setBusy(true);
    setMsg({ type: "info", text: "Traitement en cours…" });

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("mode", mode);
      fd.append("lang", "auto");

      const res = await fetch("/api/docsafe", { method: "POST", body: fd });

      if (res.status === 402 || res.status === 429) {
        setMsg({
          type: "error",
          text: `Limite gratuite atteinte (${FREE_LIMIT}). Créez un compte ou consultez la page Pricing.`,
        });
        return;
      }
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Échec du traitement");
      }

      // Si ton backend renvoie un fichier (stream), tu peux déclencher un download ici.
      // Placeholder: lecture JSON éventuelle
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        await res.json().catch(() => ({}));
      }

      // Succès → incrémente et affiche le message
      const next = incFreeUsed();
      setUsed(next);
      setMsg({
        type: "success",
        text: "Traitement réussi. (Branche ici le téléchargement si besoin.)",
      });
    } catch (e: any) {
      setMsg({ type: "error", text: e?.message || "Erreur inattendue" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Zone de drop + bouton */}
      <div
        className="rounded-2xl border border-dashed bg-gray-50 p-6 text-center transition hover:bg-gray-100"
        onDrop={onDrop}
        onDragOver={prevent}
        onDragEnter={prevent}
      >
        <div className="mx-auto grid max-w-sm place-items-center gap-3">
          <div className="h-16 w-16 rounded-full border" />
          <p className="text-sm text-gray-600">Glissez-déposez votre fichier ici</p>
          <p className="text-xs text-gray-500">ou cliquez “Importer un fichier”</p>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <button
            type="button"
            disabled={busy}
            onClick={onBrowse}
            className="mt-3 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {busy ? "Import en cours…" : "Importer un fichier"}
          </button>

          {/* Compteur visible */}
          <div className="mt-2 text-xs text-gray-600">
            <span className="font-semibold">{FREE_LIMIT - left}/{FREE_LIMIT}</span> utilisés •{" "}
            <span className={left > 0 ? "text-green-600" : "text-red-600"}>
              {left} restant{left > 1 ? "s" : ""}
            </span>
          </div>

          {/* Message feedback */}
          {msg && (
            <div
              className={`mt-2 rounded-lg px-3 py-2 text-xs ${
                msg.type === "error"
                  ? "bg-red-50 text-red-700"
                  : msg.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-50 text-gray-700"
              }`}
            >
              {msg.text}{" "}
              {msg.type !== "success" && (
                <>
                  <a href="/pricing" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Pricing
                  </a>{" "}
                  • <a href="/sign-up" className="font-semibold text-indigo-600 hover:text-indigo-500">Créer un compte</a>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Panneau d’aide compact à droite */}
      <div className="rounded-2xl border p-4">
        <h4 className="font-semibold text-slate-900">Conseils</h4>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li>Formats: PDF, DOCX, PPTX.</li>
          <li>V1: Nettoyage + correction orthographe/grammaire.</li>
          <li>V2: Reformulation pour plus de clarté (sur demande).</li>
          <li>La mise en page et la structure restent intactes.</li>
          <li>Limite gratuite anonyme: {FREE_LIMIT} fichiers.</li>
        </ul>
        <div className="mt-3 text-xs text-slate-500">
          Besoin de plus ?{" "}
          <a href="/pricing" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Voir les offres
          </a>
          .
        </div>
      </div>
    </div>
  );
}


