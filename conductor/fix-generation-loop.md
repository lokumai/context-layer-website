# Implementation Plan: Fix Stalled Generation Jobs

## Objective
Fix the React lifecycle bug that causes the Wiki and Intelligence generation jobs to permanently stall at step 1 (1/6).

## Key Files & Context
- `apps/web/src/components/playground/wiki/configure/generation-in-progress.tsx`
- `apps/web/src/components/playground/intelligence/generation.tsx`

## Root Cause
The `GenerationInProgress` component accepts `onStepAdvance` and `onComplete` callbacks from its parent. The parent updates its own state (`currentStep`) inside these callbacks, causing it to re-render and pass down new function references. 

Because `GenerationInProgress` includes these callbacks in its `useEffect` dependency array, React cleans up the effect mid-job (setting `cancelled.current = true`) and tries to restart it. However, the restart is blocked by a `started.current` flag, leaving the generator permanently stalled.

## Implementation Steps

### Phase 1: Wiki Generation
1. In `apps/web/src/components/playground/wiki/configure/generation-in-progress.tsx`, remove the `started` ref logic.
2. Introduce two new refs: `onStepAdvanceRef` and `onCompleteRef`.
3. Add a lightweight `useEffect` that continuously syncs the latest props into these refs:
   ```typescript
   useEffect(() => {
     onStepAdvanceRef.current = onStepAdvance;
     onCompleteRef.current = onComplete;
   }, [onStepAdvance, onComplete]);
   ```
4. Modify the main `simulateJob` `useEffect` to use an empty dependency array (`[]`). Inside the loop, it will call `onStepAdvanceRef.current(...)` and `onCompleteRef.current()`.
5. Ensure the effect uses an internal `let active = true;` flag to gracefully handle unmounts, replacing the faulty `cancelled.current` mutation on re-renders.

### Phase 2: Intelligence Generation
1. Replicate the exact same fix for `apps/web/src/components/playground/intelligence/generation.tsx`, replacing its faulty `useEffect` dependencies with the `useRef` pattern and an empty dependency array.

## Verification & Testing
- Trigger a "Force Rebuild" for the Wiki; verify that it proceeds through all 6 steps smoothly.
- Trigger "Generate Intelligence"; verify that it also proceeds through all steps without stalling.
- Confirm total simulation time remains exactly 5.5s.
