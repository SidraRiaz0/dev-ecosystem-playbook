# Contributing to the DevEx Revenue Playbook

## Architecture Overview
```
/
├── data/
│   └── audit-questions.json     # Single source of truth for all questions
├── playbook/
│   └── onboarding-audit.md      # Strategic audit framework
├── analytics/
│   └── models.md                # Mathematical models (LaTeX)
└── simulator/
    └── src/
        ├── DevExSimulator.js    # Main React component
        ├── App.js               # Entry point
        └── audit-questions.json # Symlink → ../../data/audit-questions.json
```

## Adding New Audit Questions

1. Open `/data/audit-questions.json`
2. Add a new question object inside an existing category, or create a new category block
3. Each question requires:
   - `id`: unique string (e.g. `q6`)
   - `text`: the question shown to the user
   - `options`: array of objects with `label`, `score_impact` (0-10), and `feedback`
   - `revenue_leakage_weight`: float between 0-1 representing financial impact weight
4. Weights across all questions do not need to sum to 1, but higher values increase financial output sensitivity
5. Run `npm test` inside `/simulator` to verify nothing broke

## Adjusting the Financial Model

The multipliers in `DevExSimulator.js` are:
- `wastedSpend = leakageFactor * totalBudget * 0.12`
- `supportCost = leakageFactor * totalBudget * 0.06`

To recalibrate for a different market baseline, update these multipliers and document your assumption in `/analytics/models.md`.

## Running Locally
```bash
cd simulator
npm install
npm start
```

## Running Tests
```bash
cd simulator
npm test -- --watchAll=false
```
