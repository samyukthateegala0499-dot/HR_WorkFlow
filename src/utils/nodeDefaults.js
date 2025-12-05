export const nodeDefaults = {
  start: { title: 'Start', metadata: {} },
  task: { title: 'New Task', description: '', assignee: '', dueDate: '', customFields: {} },
  approval: { title: 'Approval', approverRole: 'Manager', autoApproveThreshold: 0 },
  automated: { title: 'Automated', actionId: '', actionParams: {} },
  end: { endMessage: 'Workflow complete', summary: false }
}
