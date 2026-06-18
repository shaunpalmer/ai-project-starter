# DATA-FLOW.md — Data Flow Documentation

> Describes how data enters, moves through, and exits the system. Read before touching any pipeline or integration.

## Data Sources

| Source | Type | Ingestion method | Frequency |
|--------|------|-----------------|-----------|
|        |      |                 |           |

## Data Sinks

| Destination | Type | Delivery method | Frequency |
|-------------|------|----------------|-----------|
|             |      |                |           |

## Core Data Flows

### Flow 1: [Name]

```
[Source] → [Step A] → [Step B] → [Sink]
```

**Trigger:** 
**Volume:** 
**SLA:** 
**Error handling:** 

---

### Flow 2: [Name]

```
[Source] → [Step A] → [Step B] → [Sink]
```

**Trigger:** 
**Volume:** 
**SLA:** 
**Error handling:** 

---

## Transformation Rules

| Field | Source format | Target format | Rule |
|-------|--------------|---------------|------|
|       |              |               |      |

## Data Validation

| Stage | What is validated | On failure |
|-------|------------------|-----------|
|       |                  |           |

## PII / Sensitive Data

| Data type | Where stored | Encrypted | Masked in logs | Retention |
|-----------|-------------|-----------|---------------|-----------|
|           |             |           |               |           |

## Event / Message Schema

```json
{
  "event": "event.name",
  "version": "1.0",
  "timestamp": "ISO8601",
  "payload": {}
}
```
