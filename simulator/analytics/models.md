# 📊 DevEx Economic Models

This document outlines the mathematical frameworks used by the **Sidra_Analytics_Engine** to calculate the business impact of developer experience.

---

## 1. Funnel Decay & CAC Efficiency
We model "Leakage" as the delta between benchmark activation and actual performance.

$$L_{v} = CAC \times (1 - \frac{A_{rate}}{A_{target}})$$

**Variables:**
* $CAC$: Customer Acquisition Cost (Marketing/Sales spend per lead).
* $A_{rate}$: Actual Activation Rate (Calculated from the Simulator Score).
* $A_{target}$: The industry-standard 25% "North Star" activation rate.

**Business Insight:** If your simulator score is low, your $A_{rate}$ drops, proving that you are effectively burning your marketing budget on developers who never reach "Hello World."

---

## 2. Support Deflection ROI (OpEx)
Better documentation and error handling reduce the need for human-led support.

$$S_{saved} = (V_{total} \times D_{rate}) \times C_{ticket}$$

**Variables:**
* $V_{total}$: Total monthly developer inquiries.
* $D_{rate}$: Deflection Rate improvement based on audit results.
* $C_{ticket}$: Average cost of a technical support interaction ($50 - $150).

---

## 3. The Weighted Friction Vector
In our `audit-questions.json`, each question is assigned a weight ($w$) based on its historical impact on churn.

$$Score_{final} = \sum_{i=1}^{n} (S_{i} \times w_{i})$$

Where $S_{i}$ is the raw score of a question and $w_{i}$ is the revenue leakage weight assigned in the data schema.
