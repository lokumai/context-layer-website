# Implementation Plan: UI Improvements (Issue #11)

## Objective
Address the Web App (Playground) UI improvements requested in Issue #11, which include fixing missing icons in navbar dropdowns, adding smooth transitions to navbar dropdowns and the sources filter pill, correcting the active state highlighting for dropdown navigation items, and improving the citation drawer (smooth appearance and an "extend" width toggle).

## Key Files & Context
- `apps/web/src/components/playground/chrome/nav-destinations.tsx`: Controls the top navigation items, dropdowns, icons, and active state styles.
- `apps/web/src/components/playground/sources/sources-toolbar.tsx`: Renders the filter pills for sources ("All", "Code", "Files", "Discussion").
- `apps/web/src/components/playground/chatbot/citation.tsx`: Renders the citation right-hand sidebar.

## Implementation Steps

### Phase 1: Navbar Improvements (`nav-destinations.tsx`)
1.  **Icons for Dropdown Items**:
    *   Import additional icons from `lucide-react` (e.g., `FileText`, `BrainCircuit`, `LayoutDashboard`, `Terminal`).
    *   Update the `items` array configuration to provide an `icon` for each object within the `dropdown` array for "Knowledge" and "Generate".
    *   Update the `NavItem` component's dropdown rendering logic to render these icons alongside the item labels.
2.  **Dropdown Smooth Transition**:
    *   Wrap the conditional rendering of the dropdown menu (`{open ? ( ... ) : null}`) inside an `<AnimatePresence>`.
    *   Change the dropdown container to a `<motion.div>` and apply entrance/exit animations (e.g., `initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}`).
3.  **Active State Highlighting**:
    *   Modify the `isActive` variable calculation. Instead of defaulting to `false` when `item.href` is missing, check if any of the dropdown sub-items match the current path: 
        `const isActive = item.href ? pathname.startsWith(item.href) : (item.dropdown?.some((d) => pathname.startsWith(d.href)) ?? false);`

### Phase 2: Sources Filter Pill Smoothness (`sources-toolbar.tsx`)
1.  **Warp Effect Animation**:
    *   Import `LayoutGroup` and `motion` from `motion/react`.
    *   Import `LAYOUT_SPRING` from `@/lib/motion/spring` (or define a similar transition).
    *   Wrap the filter buttons container in `<LayoutGroup id="source-filters">`.
    *   For each filter button, make the container `relative`. If the filter is active, render a `<motion.span layoutId="filter-active-bg" className="absolute inset-0 rounded-pill bg-[#f5f2ef] z-0" />`.
    *   Update the text to sit above the background (`relative z-[1]`) to ensure visibility and a smooth sliding visual effect.

### Phase 3: Citations Drawer Smoothness & Extend Option (`citation.tsx`)
1.  **AnimatePresence Wrapper**:
    *   In `CitationProvider`, wrap the conditional rendering of `<CitationDrawer>` with `<AnimatePresence>`.
2.  **Smooth Slide-in/out**:
    *   Import `motion` from `motion/react` and `CONTEXT_SPRING` from `@/lib/motion/spring`.
    *   In `CitationDrawer`, change the wrapping `<aside>` to `<motion.aside>` and configure it to slide in from the right (`initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={CONTEXT_SPRING}`). 
    *   Replace static CSS classes like `animate-in` with these motion properties.
    *   Also animate the backdrop fade (`opacity: 0` to `opacity: 1`).
3.  **Extend/Maximize Toggle**:
    *   Import `Maximize2` and `Minimize2` icons from `lucide-react`.
    *   Add a local `expanded` state to `CitationDrawer`.
    *   Add an expand/collapse toggle button next to the Close (`X`) button in the header.
    *   Animate the width of the drawer dynamically based on the `expanded` state (e.g., toggling `width` between `520px` and `800px` inside the `animate` prop of `motion.aside`).

## Verification & Testing
- Ensure clicking on "Knowledge" or "Generate" dropdown items highlights the parent navigation pill.
- Ensure the dropdowns fade/slide in smoothly.
- Ensure the filter pill active state slides smoothly from one option to the other.
- Open a citation on the Chatbot page and verify the drawer slides in smoothly and slides out smoothly when closed. Test the extend toggle.
