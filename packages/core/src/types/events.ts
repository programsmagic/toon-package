/**
 * Event types for agent communication
 * Based on CopilotKit AG-UI protocol and common agent event patterns
 */

export enum EventType {
  TEXT_MESSAGE_CONTENT = 'TEXT_MESSAGE_CONTENT',
  TOOL_CALL_START = 'TOOL_CALL_START',
  TOOL_CALL_END = 'TOOL_CALL_END',
  ACTION_START = 'ACTION_START',
  ACTION_END = 'ACTION_END',
  FLOW_START = 'FLOW_START',
  FLOW_END = 'FLOW_END',
  STATE_UPDATE = 'STATE_UPDATE',
  ERROR = 'ERROR',
  HEARTBEAT = 'HEARTBEAT',
}

export interface BaseEvent {
  type: EventType;
  timestamp: number;
  id: string;
}

export interface TextMessageContentEvent extends BaseEvent {
  type: EventType.TEXT_MESSAGE_CONTENT;
  content: string;
  role?: 'user' | 'assistant' | 'system';
}

export interface ToolCallStartEvent extends BaseEvent {
  type: EventType.TOOL_CALL_START;
  toolName: string;
  toolId: string;
  parameters: Record<string, unknown>;
}

export interface ToolCallEndEvent extends BaseEvent {
  type: EventType.TOOL_CALL_END;
  toolId: string;
  result: unknown;
  success: boolean;
  error?: string;
}

export interface ActionStartEvent extends BaseEvent {
  type: EventType.ACTION_START;
  actionId: string;
  actionName: string;
  endpoint: string;
  method: string;
  parameters?: Record<string, unknown>;
}

export interface ActionEndEvent extends BaseEvent {
  type: EventType.ACTION_END;
  actionId: string;
  response?: unknown;
  statusCode?: number;
  success: boolean;
  error?: string;
  duration?: number;
}

export interface FlowStartEvent extends BaseEvent {
  type: EventType.FLOW_START;
  flowId: string;
  flowName: string;
  initialParameters?: Record<string, unknown>;
}

export interface FlowEndEvent extends BaseEvent {
  type: EventType.FLOW_END;
  flowId: string;
  result?: unknown;
  success: boolean;
  error?: string;
}

export interface StateUpdateEvent extends BaseEvent {
  type: EventType.STATE_UPDATE;
  state: Record<string, unknown>;
  changes?: Record<string, unknown>;
}

export interface ErrorEvent extends BaseEvent {
  type: EventType.ERROR;
  message: string;
  code?: string;
  details?: unknown;
}

export interface HeartbeatEvent extends BaseEvent {
  type: EventType.HEARTBEAT;
}

export type AgentEvent =
  | TextMessageContentEvent
  | ToolCallStartEvent
  | ToolCallEndEvent
  | ActionStartEvent
  | ActionEndEvent
  | FlowStartEvent
  | FlowEndEvent
  | StateUpdateEvent
  | ErrorEvent
  | HeartbeatEvent;

/**
 * Event emitter interface for agent state changes
 */
export interface EventEmitter {
  emit(event: AgentEvent): void;
  on(eventType: EventType, handler: (event: AgentEvent) => void): void;
  off(eventType: EventType, handler: (event: AgentEvent) => void): void;
}

