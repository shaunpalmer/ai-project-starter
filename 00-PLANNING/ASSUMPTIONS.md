# ASSUMPTIONS.md — Stated Assumptions

> Every project runs on assumptions. The dangerous ones are the unstated ones.
> Write them down. If an assumption turns out to be wrong, you want to find out in planning — not in production.

---

## What is an Assumption?

An assumption is anything you believe to be true that you have NOT verified.

Examples:
- "Users will have a stable internet connection"
- "The third-party API will stay free at our usage volume"
- "The client can provide the data export by week 2"
- "Python will be fast enough for this processing volume"

---

## Assumption Register

| # | Assumption | Category | Confidence | Impact if wrong | Verification method | Verified? |
|---|-----------|----------|-----------|----------------|--------------------|----|
| 1 | | Technical | High/Med/Low | High/Med/Low | | [ ] |
| 2 | | Business | | | | [ ] |
| 3 | | User | | | | [ ] |
| 4 | | Data | | | | [ ] |
| 5 | | Infrastructure | | | | [ ] |

**Categories:** Technical / Business / User / Data / Infrastructure / Legal / Team

---

## High-Risk Assumptions

List assumptions where **Confidence = Low AND Impact if wrong = High**. These need to be validated before building.

| # | Assumption | Validation plan | Owner | Due |
|---|-----------|----------------|-------|-----|
| | | | | |

---

## Technical Assumptions

_What are you assuming about the technology stack, performance, or integrations?_

- [ ] The chosen framework/language is capable of the required performance
- [ ] Third-party APIs will remain available and stable
- [ ] The hosting environment supports the required runtime
- [ ] Data volumes will stay within estimated bounds
- [ ] Other: ___________

---

## User Assumptions

_What are you assuming about the people who will use this?_

- [ ] Users have [technical skill level]
- [ ] Users will access this via [device/browser/OS]
- [ ] Users will [behaviour assumption]
- [ ] Other: ___________

---

## Data Assumptions

_What are you assuming about the data this system will work with?_

- [ ] Data format from source X is [format]
- [ ] Data volume is approximately [N records per day/hour]
- [ ] Data quality is [assumption about cleanliness]
- [ ] Data is available at [frequency/schedule]
- [ ] Other: ___________

---

## Business Assumptions

_What are you assuming about the project context, funding, and stakeholders?_

- [ ] Requirements will not change significantly during build
- [ ] Stakeholders are available for questions within [timeframe]
- [ ] Third-party services are within budget at target scale
- [ ] Other: ___________

---

## Assumption Review

Review this file at the start of each sprint or phase. Move validated assumptions to the log below.

### Validated Assumptions Log

| # | Assumption | How validated | Date | Outcome |
|---|-----------|--------------|------|---------|
| | | | | |

### Invalidated Assumptions Log

| # | Assumption | What was actually true | Impact | Response |
|---|-----------|----------------------|--------|---------|
| | | | | |
