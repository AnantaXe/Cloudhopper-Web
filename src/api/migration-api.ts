import { demoAgentRuns, demoApprovals, demoArchitectureOptions, demoAssets, demoAuditEvents, demoDependencies, demoExecutionTasks, demoFeedback, demoIaCFiles, demoMigrationWorkItems, demoOverview, demoReports, demoRiskAssessments, demoValidationChecks, demoWaves } from '../data/demo-data';
import type { MigrationApi } from '../types/domain';

const delay = (milliseconds = 180) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export const demoMigrationApi: MigrationApi = {
  async getOverview() {
    await delay();
    return demoOverview;
  },
  async listAssets() {
    await delay();
    return demoAssets;
  },
  async getDependencyGraph() {
    await delay();
    return { assets: demoAssets, relationships: demoDependencies };
  },
  async listMigrationWaves() {
    await delay();
    return demoWaves;
  },
  async listMigrationWorkItems() {
    await delay();
    return demoMigrationWorkItems;
  },
  async listRiskAssessments() {
    await delay();
    return demoRiskAssessments;
  },
  async listArchitectureOptions() {
    await delay();
    return demoArchitectureOptions;
  },
  async listIaCFiles() {
    await delay();
    return demoIaCFiles;
  },
  async listValidationChecks() {
    await delay();
    return demoValidationChecks;
  },
  async listApprovalRequests() {
    await delay();
    return demoApprovals;
  },
  async listExecutionTasks() {
    await delay();
    return demoExecutionTasks;
  },
  async listAgentRuns() {
    await delay();
    return demoAgentRuns;
  },
  async listAuditEvents() {
    await delay();
    return demoAuditEvents;
  },
  async listFeedbackEntries() {
    await delay();
    return demoFeedback;
  },
  async listReports() {
    await delay();
    return demoReports;
  },
};

// Swap this adapter for a contract-backed implementation when backend endpoints are available.
export const migrationApi: MigrationApi = demoMigrationApi;
