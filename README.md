# testtask42flows

## Setup

### 1. Create an environment file

Copy the example env file to create your local `.env`:

```bash
cp .env.example .env
```

Edit `.env` if you need to change database credentials or other settings.

### 2. Run with Docker Compose

```bash
docker-compose up -d
```

The API is available at `http://localhost:3000`.

### Examples

Send a message for analysis:

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"message": "car sales trends over the course of a week: Mon: 150, Tue: 230, Wed: 224, Thu: 218, Fri: 135, Sat: 147, Sun: 260"}'
```

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"message": "A descending funnel chart titled Funnel representing the car buying process with a gap of 2. It tracks the conversion from 'Show' (100) and 'Click' (80) to 'Visit' (60), 'Inquiry' (40), and finally 'Order' (20)."}'
```

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"message": "A chart titled Referer of a Website showing the proportion of traffic sources: Search Engine takes the lead with 1048, followed by Direct at 735, Email at 580, Union Ads at 484, and Video Ads at 300"}'
```