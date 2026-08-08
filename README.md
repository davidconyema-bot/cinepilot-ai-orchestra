CinePilot AI

Your entire production, run by AI agents.

CinePilot AI is an AI-powered multi-agent production management platform for filmmakers, producers, directors, production managers, and film crews.

Instead of treating AI as a single chatbot, CinePilot uses specialized production agents to turn a screenplay into structured production intelligence: scenes, characters, locations, scheduling requirements, budgets, risks, reports, and production workflows.

Project Links

Hosted application: https://cinepilot-ai-command.lovable.app

Source repository: https://github.com/davidconyema-bot/cinepilot-ai-orchestra

Demo video: Add public YouTube/Vimeo URL before submission

Core Workflow

Create Production
       ↓
Upload Screenplay
       ↓
Gemini screenplay analysis
       ↓
Producer Agent
       ↓
Specialized production agents
       ├── Script Analyst
       ├── Scheduling
       ├── Budget
       ├── Shot List
       ├── Costume
       ├── Props
       ├── Location
       └── Risk Analysis
       ↓
Production workspace
       ├── Schedule
       ├── Budget
       ├── Reports
       ├── Analytics
       └── AI Command Center

Why CinePilot?

Film production is highly collaborative, but important information is often spread across scripts, spreadsheets, schedules, messages, and separate production tools.

CinePilot brings this workflow into one production command center and uses AI agents to help the production team reason about the same underlying production context.

Features

Production Workspace

Users can create their own productions instead of being locked to a predefined project.

A production can contain:

Screenplays

Scenes

Characters

Locations

Crew

Props

Costumes

Schedules

Budgets

Reports

Notifications

AI agent activity

AI Operations Center

CinePilot includes specialized agents including:

Producer Agent — coordinates production tasks

Script Analyst Agent — extracts scenes, characters, dialogue, locations, and requirements

Scheduling Agent — helps optimize shooting schedules

Budget Agent — analyzes production costs

Shot List Agent — creates shot suggestions

Costume Agent — identifies wardrobe requirements

Props Agent — manages prop requirements

Location Agent — organizes locations and logistics

Risk Analysis Agent — identifies conflicts, resource gaps, and potential risks

The current application structure and agent definitions are present in the source repository.

AI Command Center

The interface is designed around production commands such as:

"Find scheduling conflicts."

"Optimize production costs."

"Generate tomorrow's call sheet."

"Estimate the cost of adding another location."

"Move Scene 12 to Friday."

Schedule

The production schedule provides:

Shoot days

Scene numbers

Actors

Crew

Equipment

Locations

Estimated duration

Conflict visualization

Budget

The budget workspace includes:

Cost breakdowns

Spending trends

Budget forecasts

Budget allocation

AI cost recommendations

Reports

CinePilot is designed to generate:

Scene Breakdown

Shooting Order

Daily Call Sheet

Crew Report

Budget Report

Production Summary

Risk Assessment

Google Cloud Architecture

Google Cloud is the AI and agent foundation of CinePilot.

The target production architecture is:

CinePilot Web App
       ↓
Cloud Run API
       ↓
Vertex AI / Gemini
       ↓
Production Agent
       ↓
Specialized Agents
       ↓
Production data + analytics

Google Cloud services used by the final judging build:

Google Cloud product

Role

Vertex AI / Gemini

Screenplay reasoning and production intelligence

Vertex AI Agent Builder / Agent Engine

Agent orchestration and runtime

Cloud Run

Secure backend/API runtime

Cloud Storage

Screenplays and production assets

Firestore

Production state and agent activity

The repository originally contained Google Cloud service placeholders. The judging build must replace those mock implementations with real runtime calls before submission.

Partner Technology

Replit

Partner track: Replit

CinePilot integrates Replit Agent / Replit Apps as a production-utility layer.

The intended workflow is:

CinePilot Production
       ↓
Producer Agent identifies a useful production utility
       ↓
Replit-powered utility
       ↓
Crew / department uses the utility
       ↓
Result is returned to CinePilot

Example utilities include:

Crew check-in

Props inventory

Costume tracking

Equipment checkout

Location scouting forms

Crew availability

Call-sheet portals

The repository already contains a Replit service layer and a Replit Agent definition. The final judging version must connect that layer to a real, documented Replit workflow and demonstrate a live call during the demo rather than presenting Replit only as a label.

Other Technologies

React

TypeScript

Tailwind CSS

shadcn/ui

Framer Motion

React Router / TanStack Router

Recharts

React Hook Form

Lucide Icons

Supabase for the existing application authentication/data layer

Google Identity Services for Google sign-in

LangGraph-compatible multi-agent architecture

Lovable for rapid application development

GitHub for source control

Repository Structure

Important existing areas include:

src/
├── integrations/
├── lib/
├── routes/
├── services/
├── components/
└── ...

src/services/
├── analytics.ts
├── gcp.ts
└── replitAgentService.ts

src/lib/
├── replit.functions.ts
└── ...

supabase/
...

The repository currently contains a gcp.ts service layer and a Replit service layer. Before judging, the Google Cloud functions must perform real calls rather than returning mock values.

Authentication

The public homepage is the default entry point.

/
 ↓
/auth
 ↓
/workspace

Protected application areas require authentication.

Google sign-in uses Google Identity Services.

Signing out returns the user to the public homepage rather than the authentication page.

Local Development

Requirements

Node.js

npm

Google Cloud project for the judging build

Replit account/credentials if the Replit integration is enabled

Supabase configuration for the existing application authentication/data layer

Install

git clone https://github.com/davidconyema-bot/cinepilot-ai-orchestra.git
cd cinepilot-ai-orchestra
npm install

Environment variables

Create a local .env file from .env.example.

Never commit .env.

Example:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

GOOGLE_CLOUD_PROJECT=your_google_cloud_project
GOOGLE_CLOUD_LOCATION=us-central1

CINEPILOT_AGENT_ENGINE_ID=your_agent_engine_id
CINEPILOT_API_URL=your_cloud_run_api_url

REPLIT_APP_URL=your_published_replit_app_url

Server-side credentials must be stored in the deployment's secret manager/environment configuration and must never be exposed to browser code.

Run

npm run dev

Build:

npm run build

How the Google Cloud Integration Is Verified

The final judging build must demonstrate a real runtime path:

Screenplay uploaded
       ↓
CinePilot backend
       ↓
Cloud Run
       ↓
Vertex AI / Gemini
       ↓
Structured screenplay analysis
       ↓
Production agents
       ↓
Dashboard updated

A successful test must show that the result comes from Gemini rather than from hardcoded/mock data.

For example, the previous src/services/gcp.ts implementation returned fixed values such as 142 scenes, 18 characters, and 9 locations. Those mock values must be removed from the judging path.

How the Partner Integration Is Verified

The final Replit judging build must demonstrate:

CinePilot
   ↓
Replit integration
   ↓
Real Replit-powered production utility
   ↓
Returned result/link/status
   ↓
CinePilot workspace

The integration must use a documented Replit mechanism and real credentials/configuration where required.

Do not invent an undocumented Replit Agent endpoint or fake a successful deployment.

Security

Never commit:

API keys

Service-account private keys

.env

OAuth client secrets

Replit secrets

Supabase service-role keys

Use environment variables or a secret manager for credentials.

Hackathon Judging Checklist

Before submitting CinePilot, verify all of the following:

Hosted application is publicly accessible

Homepage loads first

Google sign-in works

Users can create their own production

Users can upload a screenplay

Gemini performs a real screenplay-analysis call

Google Cloud agent runtime performs a real agent call

Cloud Run backend is reachable from the hosted application

Production data persists

Replit partner integration performs a real runtime action

No mock Google Cloud call is used in the judging path

No fake partner integration is used

.env is removed from the public repository

.env.example is included

MIT LICENSE file is present

Repository is public

README contains setup instructions

README contains architecture and integration instructions

3-minute demo video is public and in English

Devpost hosted-project URL is correct

Devpost repository URL is correct

Correct partner track is selected

License

This project is released under the MIT License. See LICENSE.
