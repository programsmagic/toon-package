// import React from 'react'; // Not needed in React 17+
import { motion } from 'framer-motion';
import { AgentEvent, EventType } from '@toon/core';
import '../styles/toon-theme.css';

export interface FlowDiagramProps {
  events: AgentEvent[];
  flows?: Array<{
    id: string;
    name: string;
    steps: Array<{ actionId: string }>;
  }>;
}

/**
 * Visual flow diagram component
 */
export function FlowDiagram({ events, flows }: FlowDiagramProps): JSX.Element {
  const flowEvents = events.filter(
    (e) => e.type === EventType.FLOW_START || e.type === EventType.FLOW_END
  );

  if (!flows || flows.length === 0) {
    return (
      <div className="toon-flow-diagram">
        <div className="toon-flow-empty">No flows defined</div>
      </div>
    );
  }

  return (
    <div className="toon-flow-diagram">
      <div className="toon-flow-header">
        <h3>Flow Diagram</h3>
      </div>
      <div className="toon-flow-content">
        {flows.map((flow) => {
          const flowStart = flowEvents.find(
            (e) => e.type === EventType.FLOW_START && 'flowId' in e && e.flowId === flow.id
          );
          const flowEnd = flowEvents.find(
            (e) => e.type === EventType.FLOW_END && 'flowId' in e && e.flowId === flow.id
          );
          const isActive = !!flowStart && !flowEnd;
          const isComplete = !!flowStart && !!flowEnd;

          return (
            <motion.div
              key={flow.id}
              className={`toon-flow-item ${isActive ? 'active' : isComplete ? 'complete' : 'pending'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="toon-flow-name">{flow.name}</div>
              <div className="toon-flow-steps">
                {flow.steps.map((step, index) => (
                  <div key={index} className="toon-flow-step">
                    {step.actionId}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

