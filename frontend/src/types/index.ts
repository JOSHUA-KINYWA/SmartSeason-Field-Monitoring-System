export interface FieldRecord {
  id: string;
  name: string;
  crop_type: string;
  planting_date: string;
  stage: 'planted' | 'growing' | 'ready' | 'harvested';
  status: 'active' | 'at_risk' | 'completed';
  assigned_agent_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface FieldUpdateRecord {
  id: string;
  field_id: string;
  agent_id: string | null;
  stage: 'planted' | 'growing' | 'ready' | 'harvested';
  notes: string | null;
  created_at: string;
}

export interface AgentRecord {
  id: string;
  full_name: string;
}
