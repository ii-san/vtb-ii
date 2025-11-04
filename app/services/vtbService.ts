import APIS from "./endpoints";

export interface Treatment {
	treatment_id: number;
	treatment_order: number;
	treatment_name: string;
	treatment_type: string;
	drugs: string[];
	is_trial: boolean;
	is_surgery: boolean;
	is_radiation: boolean;
	created_at?: string;
}

export interface TreatmentSummary {
	total_treatments: number;
	clinical_trials: number;
	surgeries: number;
	radiation_treatments: number;
	chemotherapy_treatments: number;
	device_therapies: number;
	unique_drugs: string[];
	unique_drug_count: number;
}

export interface TreatmentHistoryData {
	patient_id: string;
	treatments: Treatment[];
	summary: TreatmentSummary;
	timestamp: string;
}

class VtbService {
	baseURL: string;
	cache: Map<string, any>;

	constructor() {
		this.baseURL = APIS.vtb;
		this.cache = new Map();
	}

	// Generic API call method
	async apiCall(endpoint: string, options = {}) {
		try {
			const response = await fetch(`${this.baseURL}${endpoint}`, {
				headers: {
					"Content-Type": "application/json",
					...options.headers,
				},
				...options,
			});

			if (!response.ok) {
				throw new Error(
					`API call failed: ${response.status} ${response.statusText}`,
				);
			}

			return await response.json();
		} catch (error) {
			console.error(`Database API error for ${endpoint}:`, error);
			throw error;
		}
	}

	// Get patient Treatemnt data
	async getPatientTreatments(patientId: string): Promise<TreatmentHistoryData> {
		const cacheKey = `treatment_${patientId}`;
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey);
		}

		try {
			const data: TreatmentHistoryData = await this.apiCall(
				`/patients/${patientId}/treatments`,
			);
			this.cache.set(cacheKey, data);
			return data;
		} catch (error) {
			console.error(`Failed to load treatment history ${patientId}:`, error);
			// return null;
		}
	}

	// Clear cache (useful for refreshing data)
	clearCache() {
		this.cache.clear();
	}

	// Get specific cache entry
	getCachedData(key: string) {
		return this.cache.get(key);
	}

	// Set cache entry
	setCachedData(key: string, data) {
		this.cache.set(key, data);
	}
}

// Create singleton instance
const vtbService = new VtbService();
export default vtbService;
