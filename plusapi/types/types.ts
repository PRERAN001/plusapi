export type JsonPrimitive = string | number | boolean | null;

export interface JsonObject {
	[key: string]: JsonValue;
}

export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

export interface RequestPayload {
	method: string;
	url: string;
	headers?: Record<string, string>;
	params?: Record<string, string>;
	body?: JsonValue;
}

export interface RequestResult {
	success: boolean;
	historyId?: string;
	status?: number;
	headers?: Record<string, JsonValue>;
	data?: JsonValue;
	time?: number;
	size?: number;
	message?: string;
}

export interface CollectionItem {
	_id: string;
	name: string;
	description: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface HistoryItem {
	_id: string;
	method: string;
	url: string;
	headers: Record<string, string>;
	params: Record<string, string>;
	body: JsonValue;
	response: JsonValue;
	responseHeaders: Record<string, JsonValue>;
	status?: number;
	responseTime?: number;
	responseSize?: number;
	success?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface EnvironmentItem {
	_id: string;
	name: string;
	variables: JsonObject;
	createdAt?: string;
	updatedAt?: string;
}

export interface CollectionInput {
	name: string;
	description: string;
}

export interface EnvironmentInput {
	name: string;
	variables: JsonObject;
}
