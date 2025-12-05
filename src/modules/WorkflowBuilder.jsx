import React from 'react'
import { ReactFlowProvider } from 'reactflow'
import FlowCanvas from './FlowCanvas.jsx'
import { WorkflowProvider } from '../hooks/useWorkflowState.jsx'
import Sidebar from './Sidebar.jsx'
import PropertiesPanel from './PropertiesPanel.jsx'

export default function WorkflowBuilder(){
  return (
    <WorkflowProvider>
      <div className="app">
        <div className="left"><Sidebar /></div>

        <div className="center">
          <div className="header"><h3>HR Workflow Designer</h3></div>
          <div className="canvasWrap">
            {/* ReactFlowProvider wraps components to use reactflow hooks internally */}
            <ReactFlowProvider>
              <div className="canvas"><FlowCanvas /></div>
            </ReactFlowProvider>
          </div>
        </div>

        <div className="right">
          <PropertiesPanel />
          <hr style={{margin:'12px 0'}}/>
          <TestRunner />
        </div>
      </div>
    </WorkflowProvider>
  )
}
