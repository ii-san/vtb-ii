import APIS from "./endpoints";

export interface Patient {
	patient_id: string;
	Gender: string;
	Age: number;
	Race: string;
	Ethnicity: string;
	Diagnosis: string;
	Tumor_Status: string;
	IDH_Mutation: string;
	MGMT_Methylation: string;
	Status: string;
	Survival: number;
	TMZ: string;
	BEV: string;
	XRT: string;
}

class PatientService {
	baseURL: string;
	cache: Map<string, any>;

	constructor() {
		this.baseURL = APIS.patient;
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

	// Get patient clinical data
	async getPatientClinical(patientId: string): Promise<Patient | null> {
		const cacheKey = `clinical_${patientId}`;
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey);
		}

		try {
			const data: Patient = await this.apiCall(
				`/patients/${patientId}/clinical`,
			);
			this.cache.set(cacheKey, data);
			return data;
		} catch (error) {
			console.error(
				`Error loading clinical data for patient ${patientId}:`,
				error,
			);
			return null;
		}
	}

	// Get patient mutations data
	async getPatientMutations(patientId: string) {
		const cacheKey = `mutations_${patientId}`;
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey);
		}

		try {
			const data = await this.apiCall(`/patients/${patientId}/mutations`);
			this.cache.set(cacheKey, data);
			return data;
		} catch (error) {
			console.error(
				`Error loading mutations data for patient ${patientId}:`,
				error,
			);
			return [];
		}
	}

	// Get patient SATGBM data
	async getPatientSATGBM(patientId: string) {
		const cacheKey = `satgbm_${patientId}`;
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey);
		}

		try {
			const data = await this.apiCall(`/patients/${patientId}/dcna`);
			this.cache.set(cacheKey, data);
			return data;
		} catch (error) {
			console.error(
				`Error loading SATGBM data for patient ${patientId}:`,
				error,
			);
			return [];
		}
	}

	// Get patient regulon activity data
	async getPatientRegulonActivity(patientId: string) {
		const cacheKey = `regulon_${patientId}`;
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey);
		}

		try {
			const data = await this.apiCall(
				`/patients/${patientId}/regulon-activity`,
			);
			this.cache.set(cacheKey, data);
			return data;
		} catch (error) {
			console.error(
				`Error loading regulon activity data for patient ${patientId}:`,
				error,
			);
			return [];
		}
	}

	// Get patient gene expression data
	async getPatientExpression(patientId: string) {
		const cacheKey = `expression_${patientId}`;
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey);
		}

		try {
			const data = await this.apiCall(`/patients/${patientId}/expression`);
			this.cache.set(cacheKey, data);
			return data;
		} catch (error) {
			console.error(
				`Error loading expression data for patient ${patientId}:`,
				error,
			);
			return [];
		}
	}

	// Get network model data
	async getRegulonData() {
		const cacheKey = "regulon_data";
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey);
		}

		try {
			const data = await this.apiCall("/network/regulons");
			this.cache.set(cacheKey, data);
			return data;
		} catch (error) {
			console.error("Error loading regulon data:", error);
			return [];
		}
	}

	// Get drug mapping data
	async getDrugMappings() {
		const cacheKey = "drug_mappings";
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey);
		}

		try {
			const data = await this.apiCall("/network/drugs");
			this.cache.set(cacheKey, data);
			return data;
		} catch (error) {
			console.error("Error loading drug mappings:", error);
			return [];
		}
	}

	// Get identifier mappings
	async getIdentifierMappings() {
		const cacheKey = "identifier_mappings";
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey);
		}

		try {
			const data = await this.apiCall("/network/identifiers");
			this.cache.set(cacheKey, data);
			return data;
		} catch (error) {
			console.error("Error loading identifier mappings:", error);
			return [];
		}
	}

	// Get enriched SATGBM data with drug information
	async getEnrichedSATGBMData(patientId: string) {
		const cacheKey = `enriched_satgbm_${patientId}`;
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey);
		}

		try {
			const data = await this.apiCall(`/patients/${patientId}/dcna-enriched`);
			this.cache.set(cacheKey, data);
			return data;
		} catch (error) {
			console.error(
				`Error loading enriched SATGBM data for patient ${patientId}:`,
				error,
			);
			return [];
		}
	}

	// Get all available patients
	async getAvailablePatients() {
		const cacheKey = "available_patients";
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey);
		}

		try {
			const data = await this.apiCall("/patients");
			this.cache.set(
				cacheKey,
				data.map((p) => p.patient_id),
			);
			return data.map((p) => p.patient_id);
		} catch (error) {
			console.error("Error loading available patients:", error);
			return [];
		}
	}

	// Get patient summary data
	async getPatientSummary(patientId: string) {
		try {
			const data = await this.apiCall(`/patients/${patientId}/summary`);
			return data;
		} catch (error) {
			console.error(`Error loading patient summary for ${patientId}:`, error);
			return null;
		}
	}

	// Get gene name mapping
	async getGeneName(ensemblId: string) {
		try {
			const data = await this.apiCall(`/network/gene-name/${ensemblId}`);
			return data.gene_name || ensemblId;
		} catch (error) {
			console.error(`Error loading gene name for ${ensemblId}:`, error);
			return ensemblId;
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
const patientService = new PatientService();
export default patientService;
