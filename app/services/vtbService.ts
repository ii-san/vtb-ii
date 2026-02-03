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

// Giant Report Types
export interface DrugScore {
	rank: number;
	drug_name: string;
	total_score: number;
	dcna_score: number;
	molecular_profile_score: number;
	biomarker_score: number;
	clinical_evidence_score: number;
	mechanism_score: number;
	administration_score: number;
	interaction_score: number;
	rationale: string;
}

export interface MutationScore {
	rank: number;
	gene: string;
	mutation: string;
	total_score: number;
	clinical_score: number;
	prevalence_score: number;
	therapeutic_score: number;
	biomarker_score: number;
	clinical_evidence_score: number;
	mechanism_score: number;
	prognostic_score: number;
	rationale: string;
	clinical_interpretation?: string;
}

interface PrognosisAssessment {
	prognosis_score: number;
	risk_category: string;
	estimated_survival: string;
	favorable_factors: string[];
	adverse_factors: string[];
	key_biomarkers: {
		idh_status: string;
		mgmt_status: string;
		age: number;
	};
}

export interface ClinicalTrial {
	nct_id: string;
	title: string;
	status: string;
	phase: string;
	drug_name: string;
	brief_summary: string;
	indication?: string;
	enrollment?: string | number;
	url?: string;
	detailed_description?: string;
	eligibility_criteria?: string;
	primary_outcome?: string;
	secondary_outcome?: string;
	study_design?: string;
	sponsor?: string;
	location?: string;
	start_date?: string;
	completion_date?: string;
}

interface PubMedArticle {
	pmid: string;
	title: string;
	authors?: string;
	source?: string;
	pubdate?: string;
	url: string;
	publication_info?: string;
}

export interface LiteratureSummary {
	drug_literature: { [drug: string]: PubMedArticle[] };
	mutation_literature: { [gene: string]: PubMedArticle[] };
	summary_stats: {
		total_drug_articles: number;
		total_mutation_articles: number;
		drugs_with_literature: number;
		genes_with_literature: number;
		drugs_searched: number;
		genes_searched: number;
	};
	search_metadata: {
		search_date: string;
		top_drugs_searched?: string[];
		top_genes_searched?: string[];
		drugs_count?: number;
		genes_count?: number;
		error?: string;
	};
}

interface AIExecutiveSummary {
	unified_summary?: string;
	summary?: string;
	patient_overview: string;
	key_findings: string[];
	molecular_profile?: string;
	treatment_strategy?: string;
	prognosis_assessment?: string;
	next_steps: string[];
}

interface AIRecommendationsData {
	patient_id: string;
	query: string;
	executive_summary: AIExecutiveSummary;
	overall_confidence: number;
	timestamp: string;
	cached?: boolean;
	session_id?: number;
}

interface ComprehensiveReportData {
	patient_id: string;
	patient_overview: string;
	molecular_profile: any;
	ranked_drugs: DrugScore[];
	ranked_mutations: MutationScore[];
	prognosis_assessment: PrognosisAssessment;
	treatment_recommendations: any[];
	next_steps: string[];
	overall_confidence: number;
	timestamp: string;
	clinical_trials?: ClinicalTrial[];
	literature_summary?: LiteratureSummary;
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

	// Get patient report data
	async getPatientReport(patientId: string): Promise<ComprehensiveReportData> {
		const cacheKey = `full_report_${patientId}`;
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey);
		}

		try {
			const data = await this.apiCall(`/get-comprehensive-report/${patientId}`);
			this.cache.set(cacheKey, data);
			return data;
		} catch (error) {
			console.error(
				`Failed to load comprehensive report for ${patientId}:`,
				error,
			);
			return null;
		}
	}

	// Get patient report data
	async getAiRecommendations(
		patientId: string,
	): Promise<AIRecommendationsData> {
		const cacheKey = `ai_recommendations_${patientId}`;
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey);
		}

		try {
			const data = await this.apiCall(`/recommendations/${patientId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: "Provide therapy recommendations for this patient",
					top_k: 5,
					force_new_analysis: false,
				}),
			});
			this.cache.set(cacheKey, data);
			return data;
		} catch (error) {
			console.error(
				`Failed to load ai recommendations for ${patientId}:`,
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
