import type {
  CollectionInput,
  CollectionItem,
  EnvironmentInput,
  EnvironmentItem,
  HistoryItem,
  RequestPayload,
  RequestResult,
} from "@/types/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data as T;
}

export function sendRequest(payload: RequestPayload) {
  return apiRequest<RequestResult>("/api/request", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCollections() {
  return apiRequest<CollectionItem[]>("/api/collection");
}

export function createCollection(input: CollectionInput) {
  return apiRequest<CollectionItem>("/api/collection", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateCollection(id: string, input: CollectionInput) {
  return apiRequest<CollectionItem>(`/api/collection/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteCollection(id: string) {
  return apiRequest<{ success: boolean }>(`/api/collection/${id}`, {
    method: "DELETE",
  });
}

export function getHistory() {
  return apiRequest<HistoryItem[]>("/api/history");
}

export function deleteHistory(id: string) {
  return apiRequest<{ success: boolean }>(`/api/history/${id}`, {
    method: "DELETE",
  });
}

export function clearHistory() {
  return apiRequest<{ success: boolean }>("/api/history", {
    method: "DELETE",
  });
}

export function getEnvironments() {
  return apiRequest<EnvironmentItem[]>("/api/environment");
}

export function createEnvironment(input: EnvironmentInput) {
    console.log("inputtttttttttt",input)
  return apiRequest<EnvironmentItem>("/api/environment", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateEnvironment(id: string, input: EnvironmentInput) {
  return apiRequest<EnvironmentItem>(`/api/environment/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteEnvironment(id: string) {
  return apiRequest<{ success: boolean }>(`/api/environment/${id}`, {
    method: "DELETE",
  });
}