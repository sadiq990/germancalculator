export interface ExportColumn {
  id: string;
  key: string;
  label: string;
  visible: boolean;
  order: number;
}

export interface ExportConfig {
  format: 'pdf' | 'csv';
  columns: ExportColumn[];
  includeHeader: boolean;
  customHeaderText?: string;
  includeSondertage: boolean;
  groupByKunde: boolean;
}
