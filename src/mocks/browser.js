// src/mocks/browser.js
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

export async function setupMocks() {
  await worker.start({ onUnhandledRequest: 'bypass' })
  return worker
}
