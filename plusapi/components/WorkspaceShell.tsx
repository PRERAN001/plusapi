"use client";

import { useEffect, useMemo, useState } from "react";
import { 
  FolderClosed, 
  History, 
  Settings2, 
  RefreshCw, 
  Trash2, 
  Edit3, 
  Activity, 
  Terminal, 
  AlertTriangle,
  SendHorizontal,
  Layers
} from "lucide-react";
import {
  clearHistory,
  createCollection,
  createEnvironment,
  deleteCollection,
  deleteEnvironment,
  deleteHistory,
  getCollections,
  getEnvironments,
  getHistory,
  sendRequest,
  updateCollection,
  updateEnvironment,
} from "@/lib/api";
import type {
  CollectionItem,
  EnvironmentItem,
  HistoryItem,
  JsonObject,
  JsonValue,
  RequestPayload,
  RequestResult,
} from "@/types/types";

type TabKey = "collections" | "history" | "environments";

type RequestForm = {
  method: string;
  url: string;
  headers: string;
  params: string;
  body: string;
};

type CollectionForm = {
  name: string;
  description: string;
};

type EnvironmentForm = {
  name: string;
  variables: string;
};

const defaultRequestForm: RequestForm = {
  method: "GET",
  url: "",
  headers: "{}",
  params: "{}",
  body: "{}",
};

const defaultCollectionForm: CollectionForm = {
  name: "",
  description: "",
};

const defaultEnvironmentForm: EnvironmentForm = {
  name: "",
  variables: "{}",
};

function safeJsonBody(input: string): JsonValue {
  if (!input.trim()) return {};
  try {
    return JSON.parse(input) as JsonValue;
  } catch {
    throw new Error("Please enter valid JSON");
  }
}

function safeJsonStringMap(input: string): Record<string, string> {
  const parsed = safeJsonBody(input);
  if (parsed === null || Array.isArray(parsed) || typeof parsed !== "object") {
    throw new Error("Headers and params must be JSON objects");
  }
  return Object.fromEntries(
    Object.entries(parsed as JsonObject).map(([key, value]) => [key, String(value)])
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

export default function WorkspaceShell() {
  const [activeTab, setActiveTab] = useState<TabKey>("collections");
  const [requestForm, setRequestForm] = useState<RequestForm>(defaultRequestForm);
  const [requestResult, setRequestResult] = useState<RequestResult | HistoryItem | null>(null);
  const [requestLoading, setRequestLoading] = useState(false);

  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [collectionForm, setCollectionForm] = useState<CollectionForm>(defaultCollectionForm);
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [environments, setEnvironments] = useState<EnvironmentItem[]>([]);
  const [environmentsLoading, setEnvironmentsLoading] = useState(false);
  const [environmentForm, setEnvironmentForm] = useState<EnvironmentForm>(defaultEnvironmentForm);
  const [editingEnvironmentId, setEditingEnvironmentId] = useState<string | null>(null);

  // Consolidated Single Source of Truth for Selected Environment ID String
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState<string>("");

  const [message, setMessage] = useState("");

  const tabs = [
    { key: "collections" as TabKey, label: "Collections", icon: FolderClosed },
    { key: "history" as TabKey, label: "History", icon: History },
    { key: "environments" as TabKey, label: "Environments", icon: Settings2 },
  ];

  const activeLabel = useMemo(
    () => tabs.find((tab) => tab.key === activeTab)?.label ?? "Collections",
    [activeTab]
  );

  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case "GET": return "bg-sky-50 text-blue-600 border border-blue-200";
      case "POST": return "bg-orange-50 text-orange-600 border border-orange-200";
      case "PUT": return "bg-amber-50 text-amber-600 border border-amber-200";
      case "DELETE": return "bg-red-50 text-red-600 border border-red-200";
      default: return "bg-zinc-100 text-zinc-600 border border-zinc-200";
    }
  };

  useEffect(() => {
    void loadCollections();
    void loadHistory();
    void loadEnvironments();
  }, []);

  useEffect(() => {
    if (activeTab === "collections") void loadCollections();
    if (activeTab === "history") void loadHistory();
    if (activeTab === "environments") void loadEnvironments();
  }, [activeTab]);

  async function loadCollections() {
    setCollectionsLoading(true);
    try {
      setCollections(await getCollections());
    } catch (error: unknown) {
      setMessage(getErrorMessage(error));
    } finally {
      setCollectionsLoading(false);
    }
  }

  async function loadHistory() {
    setHistoryLoading(true);
    try {
      setHistory(await getHistory());
    } catch (error: unknown) {
      setMessage(getErrorMessage(error));
    } finally {
      setHistoryLoading(false);
    }
  }

  async function loadEnvironments() {
    setEnvironmentsLoading(true);
    try {
      setEnvironments(await getEnvironments());
    } catch (error: unknown) {
      setMessage(getErrorMessage(error));
    } finally {
      setEnvironmentsLoading(false);
    }
  }

  async function handleSendRequest() {
    if (!selectedEnvironmentId) {
      setMessage("Environment configuration selection is required to dispatch runtime requests.");
      return;
    }

    setRequestLoading(true);
    setMessage("");
    try {
      const payload: RequestPayload & { environmentId?: string } = {
        method: requestForm.method,
        url: requestForm.url,
        headers: safeJsonStringMap(requestForm.headers),
        params: safeJsonStringMap(requestForm.params),
        body: safeJsonBody(requestForm.body),
        environmentId: selectedEnvironmentId, // Appended clean selection ID mapping onto payload
      };
      
      const result = await sendRequest(payload);
      setRequestResult(result);
      await loadHistory();
      setActiveTab("history");
    } catch (error: unknown) {
      setMessage(getErrorMessage(error));
    } finally {
      setRequestLoading(false);
    }
  }

  async function handleCollectionSave() {
    setMessage("");
    try {
      const payload = {
        name: collectionForm.name.trim(),
        description: collectionForm.description.trim(),
      };
      if (editingCollectionId) {
        await updateCollection(editingCollectionId, payload);
      } else {
        await createCollection(payload);
      }
      setCollectionForm(defaultCollectionForm);
      setEditingCollectionId(null);
      await loadCollections();
    } catch (error: unknown) {
      setMessage(getErrorMessage(error));
    }
  }

  function startEditingCollection(collection: CollectionItem) {
    setEditingCollectionId(collection._id);
    setCollectionForm({
      name: collection.name,
      description: collection.description,
    });
    setActiveTab("collections");
  }

  async function handleCollectionDelete(id: string) {
    try {
      await deleteCollection(id);
      await loadCollections();
    } catch (error: unknown) {
      setMessage(getErrorMessage(error));
    }
  }

  async function handleHistoryDelete(id: string) {
    try {
      await deleteHistory(id);
      await loadHistory();
    } catch (error: unknown) {
      setMessage(getErrorMessage(error));
    }
  }

  async function handleHistoryClear() {
    try {
      await clearHistory();
      await loadHistory();
    } catch (error: unknown) {
      setMessage(getErrorMessage(error));
    }
  }

  async function handleEnvironmentSave() {
    setMessage("");
    try {
      const payload = {
        name: environmentForm.name.trim(),
        variables: safeJsonBody(environmentForm.variables) as JsonObject,
      };
      if (editingEnvironmentId) {
        await updateEnvironment(editingEnvironmentId, payload);
      } else {
        await createEnvironment(payload);
      }
      setEnvironmentForm(defaultEnvironmentForm);
      setEditingEnvironmentId(null);
      await loadEnvironments();
    } catch (error: unknown) {
      setMessage(getErrorMessage(error));
    }
  }

  function startEditingEnvironment(environment: EnvironmentItem) {
    setEditingEnvironmentId(environment._id);
    setEnvironmentForm({
      name: environment.name,
      variables: JSON.stringify(environment.variables ?? {}, null, 2),
    });
    setActiveTab("environments");
  }

  async function handleEnvironmentDelete(id: string) {
    try {
      await deleteEnvironment(id);
      if (selectedEnvironmentId === id) {
        setSelectedEnvironmentId("");
      }
      await loadEnvironments();
    } catch (error: unknown) {
      setMessage(getErrorMessage(error));
    }
  }

  return (
    <main className="h-screen w-screen bg-[#FDFDFB] text-zinc-800 selection:bg-orange-100 selection:text-orange-900 font-sans antialiased overflow-hidden">
      <div className="flex h-full w-full">
        
        {/* Sidebar */}
        <aside className="flex w-64 flex-col border-r border-zinc-200/80 bg-[#FAFAEE]/60 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3 border-b border-zinc-200/60 px-5 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500 text-sm font-bold text-white shadow-md shadow-orange-500/20">
              P
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-zinc-900">PulseAPI</h1>
              <p className="text-[10px] font-bold text-blue-600/80 uppercase tracking-wider">Workspace</p>
            </div>
          </div>

          <nav className="flex-1 space-y-0.5 p-3 overflow-y-auto">
            {tabs.map((tab) => {
              const isSelected = activeTab === tab.key;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150 ${
                    isSelected
                      ? "bg-white text-zinc-950 shadow-sm border border-zinc-200/60 ring-1 ring-blue-500/5"
                      : "text-zinc-500 hover:bg-white/60 hover:text-zinc-900"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isSelected ? "text-blue-600" : "opacity-70"}`} />
                  <span className={isSelected ? "text-blue-600" : ""}>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <section className="relative flex-1 bg-[#F8F8F6] flex flex-col overflow-hidden">
          <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-blue-400/5 blur-[80px]" />
          <div className="pointer-events-none absolute right-[-5%] bottom-[-5%] h-72 w-72 rounded-full bg-orange-400/5 blur-[90px]" />

          {/* Sub Header (Title Panel) */}
          <div className="flex items-center justify-between border-b border-zinc-200/60 bg-white/60 backdrop-blur-md px-6 py-3 shrink-0 z-10">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-orange-500">Active View</p>
              <h2 className="text-base font-bold text-zinc-900 tracking-tight">{activeLabel}</h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium text-blue-700 bg-blue-50/60 border border-blue-100/70 rounded-lg px-3 py-1">
              <Activity className="h-3 w-3 text-blue-500" />
              <span>Orchestrator Sandbox Core Active</span>
            </div>
          </div>

          {/* Core Master Split Window Workspace */}
          <div className="flex-1 flex overflow-hidden p-4 gap-4 z-10">
            
            {/* LEFT COLUMN: Request Controls & Dynamic Tab Forms */}
            <div className="w-[45%] xl:w-[40%] flex flex-col gap-4 overflow-y-auto pr-1">
              
              {/* Send Request Bar Card */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm shrink-0">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                    Target Configurator
                  </h3>
                  
                  {/* Premium Required Environment Dropdown Menu Selector Component */}
                  <div className="flex items-center gap-1.5 max-w-[60%]">
                    <Layers className="h-3 w-3 text-zinc-400 shrink-0" />
                    <select
                      required
                      value={selectedEnvironmentId}
                      onChange={(e) => setSelectedEnvironmentId(e.target.value)}
                      className={`w-full rounded-lg border px-2 py-1 text-[11px] font-semibold outline-none transition cursor-pointer ${
                        selectedEnvironmentId 
                          ? "bg-blue-50/80 border-blue-200 text-blue-700 focus:border-blue-400" 
                          : "bg-orange-50/70 border-orange-200 text-orange-700 font-bold focus:border-orange-400 animate-pulse"
                      }`}
                    >
                      <option value="" className="text-zinc-400 font-medium">-- Select Active Env * --</option>
                      {environments.map((env) => (
                        <option key={env._id} value={env._id} className="text-zinc-800 font-medium bg-white">
                          {env.name} ({env._id.substring(0, 6)}...)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Input Bar Layout */}
                <div className="flex gap-2">
                  <select
                    value={requestForm.method}
                    onChange={(e) =>
                      setRequestForm((current) => ({ ...current, method: e.target.value }))
                    }
                    className="rounded-xl border border-zinc-200 bg-zinc-50 px-2.5 py-2 text-xs font-bold text-zinc-700 outline-none focus:border-blue-500 focus:bg-white transition"
                  >
                    {["GET", "POST", "PUT", "PATCH", "DELETE"].map((method) => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                  <input
                    value={requestForm.url}
                    onChange={(e) =>
                      setRequestForm((current) => ({ ...current, url: e.target.value }))
                    }
                    placeholder="https://api.example.com/v1/resource"
                    className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:bg-white transition shadow-inner"
                  />
                  <button
                    onClick={handleSendRequest}
                    disabled={requestLoading || !requestForm.url.trim() || !selectedEnvironmentId}
                    className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white transition shadow-md shadow-orange-500/10 hover:bg-orange-600 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 flex items-center gap-1.5"
                    title={!selectedEnvironmentId ? "Please select an active environment first" : "Send request"}
                  >
                    <SendHorizontal className="h-3 w-3" />
                    <span>{requestLoading ? "..." : "Send"}</span>
                  </button>
                </div>

                {/* JSON Parameters Input Areas */}
                <div className="mt-3.5 space-y-2.5">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 px-0.5">Headers</span>
                    <textarea
                      value={requestForm.headers}
                      onChange={(e) => setRequestForm((current) => ({ ...current, headers: e.target.value }))}
                      rows={2}
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50/40 p-2 text-[11px] font-mono text-zinc-800 outline-none focus:border-blue-500 focus:bg-white resize-none transition"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 px-0.5">Params</span>
                    <textarea
                      value={requestForm.params}
                      onChange={(e) => setRequestForm((current) => ({ ...current, params: e.target.value }))}
                      rows={2}
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50/40 p-2 text-[11px] font-mono text-zinc-800 outline-none focus:border-blue-500 focus:bg-white resize-none transition"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 px-0.5">Body Data</span>
                    <textarea
                      value={requestForm.body}
                      onChange={(e) => setRequestForm((current) => ({ ...current, body: e.target.value }))}
                      rows={3}
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50/40 p-2 text-[11px] font-mono text-zinc-800 outline-none focus:border-blue-500 focus:bg-white resize-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Modules Forms */}
              {activeTab === "collections" && (
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-zinc-900 tracking-tight">
                    {editingCollectionId ? "Modify Collection Schema" : "Register Collection"}
                  </h3>
                  <input
                    value={collectionForm.name}
                    onChange={(e) => setCollectionForm((current) => ({ ...current, name: e.target.value }))}
                    placeholder="Schema Identifier"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium outline-none focus:border-blue-500 focus:bg-white"
                  />
                  <textarea
                    value={collectionForm.description}
                    onChange={(e) => setCollectionForm((current) => ({ ...current, description: e.target.value }))}
                    placeholder="Documentation mapping meta notes..."
                    rows={2}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCollectionSave}
                      className="flex-1 rounded-xl bg-zinc-900 py-2 text-xs font-bold text-white transition hover:bg-zinc-800"
                    >
                      {editingCollectionId ? "Commit" : "Save Schema"}
                    </button>
                    {editingCollectionId && (
                      <button
                        onClick={() => { setEditingCollectionId(null); setCollectionForm(defaultCollectionForm); }}
                        className="rounded-xl border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-800"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "environments" && (
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-zinc-900 tracking-tight">
                    {editingEnvironmentId ? "Modify Target Map" : "Register Environment Map"}
                  </h3>
                  <input
                    value={environmentForm.name}
                    onChange={(e) => setEnvironmentForm((current) => ({ ...current, name: e.target.value }))}
                    placeholder="Profile Namespace"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium outline-none focus:border-blue-500 focus:bg-white"
                  />
                  <textarea
                    value={environmentForm.variables}
                    onChange={(e) => setEnvironmentForm((current) => ({ ...current, variables: e.target.value }))}
                    placeholder='{"BASE_URL": "https://api.net"}'
                    rows={3}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-[11px] font-mono outline-none focus:border-blue-500 focus:bg-white resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleEnvironmentSave}
                      className="flex-1 rounded-xl bg-zinc-900 py-2 text-xs font-bold text-white transition hover:bg-zinc-800"
                    >
                      {editingEnvironmentId ? "Sync Map" : "Initialize Map"}
                    </button>
                    {editingEnvironmentId && (
                      <button
                        onClick={() => { setEditingEnvironmentId(null); setEnvironmentForm(defaultEnvironmentForm); }}
                        className="rounded-xl border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-800"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: MASSIVE CANVAS VIEWPORT */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              <div className="flex-1 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm flex flex-col min-h-0">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-zinc-400 stroke-[1.5]" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">
                      Response Console Engine
                    </h3>
                  </div>
                  {requestResult && !("error" in requestResult) && (
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-600 shadow-sm">
                      STATUS 200 OK
                    </span>
                  )}
                </div>
                
                <div className="flex-1 rounded-xl border border-zinc-150 bg-[#FCFCFB] p-4 overflow-auto shadow-inner min-h-0">
                  {requestResult ? (
                    <pre className="whitespace-pre-wrap text-xs font-mono text-zinc-700 leading-relaxed selection:bg-orange-200">
                      {JSON.stringify(requestResult, null, 2)}
                    </pre>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-zinc-400 gap-2 py-8">
                      <div className="h-8 w-8 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400">
                        ⚡
                      </div>
                      <p className="text-xs font-semibold text-zinc-400">Awaiting runtime socket response execution payloads...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Secondary Bottom Log Deck */}
              <div className="h-44 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm flex flex-col min-h-0 shrink-0">
                {activeTab === "collections" && (
                  <div className="flex flex-col h-full min-h-0">
                    <div className="flex items-center justify-between shrink-0 border-b border-zinc-100 pb-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Captured Objects Repository ({collections.length})</span>
                      <button onClick={loadCollections} className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <RefreshCw className="h-2.5 w-2.5" /> Sync
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
                      {collections.length === 0 ? (
                        <div className="text-center py-4 text-[11px] text-zinc-400">No active structures stored inside workspace core.</div>
                      ) : (
                        collections.map((c) => (
                          <div key={c._id} className="flex items-center justify-between text-xs bg-[#FCFCFB] border border-zinc-100 rounded-lg p-2 hover:border-zinc-200 transition">
                            <span className="font-bold text-zinc-800 truncate pr-4">{c.name}</span>
                            <div className="flex gap-2 shrink-0">
                              <button onClick={() => startEditingCollection(c)} className="text-zinc-500 hover:text-zinc-900 font-semibold"><Edit3 className="h-3 w-3" /></button>
                              <button onClick={() => handleCollectionDelete(c._id)} className="text-orange-500 hover:text-orange-600 font-semibold"><Trash2 className="h-3 w-3" /></button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "history" && (
                  <div className="flex flex-col h-full min-h-0">
                    <div className="flex items-center justify-between shrink-0 border-b border-zinc-100 pb-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Runtime Telemetry History Logs</span>
                      <button onClick={handleHistoryClear} className="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                        <Trash2 className="h-2.5 w-2.5" /> Purge Stack
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
                      {history.length === 0 ? (
                        <div className="text-center py-4 text-[11px] text-zinc-400">Execution timeline log stack is currently empty.</div>
                      ) : (
                        history.map((h) => (
                          <div key={h._id} className="flex items-center justify-between text-[11px] bg-[#FCFCFB] border border-zinc-100 rounded-lg p-2 hover:border-zinc-200 transition">
                            <div className="flex items-center gap-2 truncate pr-4">
                              <span className={`px-1 py-0.5 rounded text-[8px] font-bold tracking-tight ${getMethodBadgeClass(h.method)}`}>{h.method}</span>
                              <span className="font-mono text-zinc-700 truncate">{h.url}</span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-blue-600 font-mono font-semibold">{h.responseTime ?? 0}ms</span>
                              <button onClick={() => setRequestResult(h)} className="text-zinc-500 hover:text-zinc-900 font-bold text-[10px]">Inspect</button>
                              <button onClick={() => handleHistoryDelete(h._id)} className="text-zinc-400 hover:text-orange-600"><Trash2 className="h-3 w-3" /></button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "environments" && (
                  <div className="flex flex-col h-full min-h-0">
                    <div className="flex items-center justify-between shrink-0 border-b border-zinc-100 pb-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Environment Sandboxes Configuration ({environments.length})</span>
                      <button onClick={loadEnvironments} className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <RefreshCw className="h-2.5 w-2.5" /> Sync Map
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
                      {environments.length === 0 ? (
                        <div className="text-center py-4 text-[11px] text-zinc-400">No target profiles parsed inside global parameters tree.</div>
                      ) : (
                        environments.map((env) => (
                          <div key={env._id} className="flex items-center justify-between text-xs bg-[#FCFCFB] border border-zinc-100 rounded-lg p-2 hover:border-zinc-200 transition">
                            <span className="font-bold text-zinc-800 truncate pr-4 flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>{env.name}</span>
                            <div className="flex gap-2 shrink-0">
                              <button onClick={() => startEditingEnvironment(env)} className="text-zinc-500 hover:text-zinc-900 font-semibold"><Edit3 className="h-3 w-3" /></button>
                              <button onClick={() => handleEnvironmentDelete(env._id)} className="text-orange-500 hover:text-orange-600 font-semibold"><Trash2 className="h-3 w-3" /></button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Toast Message Container */}
          {message && (
            <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-xs font-semibold text-orange-800 shadow-lg max-w-sm animate-fade-in flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-orange-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}