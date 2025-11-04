import APIS from "./endpoints";

// Treatment Types
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

// Similar Patient Types
export interface SimilarPatient {
	patient_id: string;
	overall_similarity: number;
	dcna_similarity: number;
	mutation_similarity: number;
	clinical_similarity: number;
	network_similarity: number;
	shared_mutations: string[];
	similar_therapies: Array<{
		therapy_name: string;
		activity_score: number;
		therapy_type: string;
	}>;
	clinical_outcomes: Record<string, any>;
}

export interface TherapyRecommendation {
	therapy_name: string;
	recommendation_score: number;
	supporting_patients: number;
	max_similarity: number;
	evidence_strength: "high" | "medium" | "low";
}

interface SimilarityAnalysis {
	query_patient_id: string;
	similar_patients: SimilarPatient[];
	similarity_summary: {
		total_similar_patients: number;
		avg_overall_similarity: number;
		avg_dcna_similarity: number;
		avg_mutation_similarity: number;
		avg_clinical_similarity: number;
		avg_network_similarity: number;
		most_similar_patient: string;
		highest_similarity_score: number;
	};
	therapy_recommendations: TherapyRecommendation[];
	ai_assessment: string;
	analysis_timestamp: string;
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
	async getPatientTreatments(
		patientId: string,
	): Promise<TreatmentHistoryData | null> {
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
			return null;
		}
	}

	// Get silimar patient data
	async getSimilarPatients(
		patientId: string,
	): Promise<SimilarityAnalysis | null> {
		const cacheKey = `similar_${patientId}`;
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey);
		}

		try {
			const data = await this.apiCall(`/patients-like-me/${patientId}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ analysis_type: "patients_like_me" }),
			});
			// This api has a weird signature
			const payload = data.patients_like_me;
			this.cache.set(cacheKey, payload);
			return payload;
		} catch (error) {
			console.error(
				`Error loading simliar patients for patient ${patientId}:`,
				error,
			);
			return null;
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
