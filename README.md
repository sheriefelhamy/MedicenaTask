Medicena · Pre-Authorization Operations Command Center
======================================================

> **Product Owner Take-Home · Tactful AI**Seed-stage B2B SaaS for private hospitals in Egypt

The Problem
===========

Private hospitals in Egypt manage insurance pre-authorizations through fragmented workflows:

*   WhatsApp threads,
    
*   phone calls,
    
*   insurer portals,
    
*   emails,
    
*   spreadsheets,
    
*   and paper tracking.
    

The result:

*   Delays become invisible until patients are already waiting
    
*   Admin teams spend their day chasing updates instead of resolving blockers
    
*   Directors cannot clearly see where approvals are stuck
    
*   Operational decisions are made based on guesswork
    
*   Revenue-generating procedures are delayed unnecessarily
    

Most hospitals do not lack communication channels.

They lack operational visibility and accountability.

The Wedge
=========

Rather than rebuilding hospital infrastructure, Medicena focuses on one narrow but painful operational workflow:

**Insurance pre-authorization coordination.**

The first product is a lightweight operational command center that helps hospitals:

*   track approvals in real time,
    
*   surface bottlenecks early,
    
*   clarify ownership,
    
*   and escalate delays before they impact treatment.
    

The system works alongside existing hospital behavior instead of replacing it.

Hospitals can continue using:

*   WhatsApp,
    
*   phone calls,
    
*   insurer portals,
    
*   and emails,
    

while Medicena becomes the operational source of truth.

In Scope
--------

*   Live pre-auth request queue
    
*   SLA risk and delay visibility
    
*   Request ownership and escalation
    
*   Timeline tracking and operational notes
    
*   Director dashboard for bottleneck visibility
    

Explicitly Out of Scope
-----------------------

*   EMR / medical records
    
*   Insurance claims automation
    
*   Full billing systems
    
*   Hospital ERP workflows
    
*   Patient-facing applications
    
*   Replacing WhatsApp or insurer communication channels
    

Contents
========

SectionDescription[1\. Discovery & Framing](https://chatgpt.com/c/69ff691e-aa4c-83ea-9900-af509eaec210#1-discovery--framing)User research, JTBD, wedge rationale[2\. Solution Outline](https://chatgpt.com/c/69ff691e-aa4c-83ea-9900-af509eaec210#2-solution-outline)MLP definition, workflow, key screens[3\. Prototype](https://chatgpt.com/c/69ff691e-aa4c-83ea-9900-af509eaec210#3-prototype)Clickable prototype and walkthrough[4\. Measurement Plan](https://chatgpt.com/c/69ff691e-aa4c-83ea-9900-af509eaec210#4-measurement-plan)Metrics, instrumentation, success thresholds[5\. Walkthrough Video](https://chatgpt.com/c/69ff691e-aa4c-83ea-9900-af509eaec210#5-walkthrough-video)Recorded submission walkthrough

1\. Discovery & Framing
=======================

[→ Read the full memo](https://drive.google.com/file/d/14R3sAkTcQitLvLKGgtWCXb90AzaD3OCO/view?usp=sharing)

Primary User
------------

Insurance coordinators and pre-auth admins inside private hospitals.

Job-to-be-done
--------------

“Help me keep insurance pre-authorizations moving by making delays, ownership, and escalation visible early so patients are treated faster and operations stay under control.”

Core Insight
------------

The problem is not insurer communication itself.

Hospitals already communicate through existing channels.

The real issue is:

*   invisible delays,
    
*   unclear ownership,
    
*   overloaded coordinators,
    
*   and lack of operational visibility.
    

Medicena solves this by becoming the live operational coordination layer for pre-authorizations.

Key Risk
--------

The biggest risk is adoption.

Will admins consistently use Medicena as their operational source of truth instead of spreadsheets and WhatsApp threads during busy shifts?

2\. Solution Outline
====================

[→ Read the full solution outline](https://drive.google.com/file/d/1va0xockCzJjo7m7XJkFDMicbz0RgkzRg/view?usp=sharing)

Minimum Lovable Product
-----------------------

The first version of Medicena is a lightweight pre-auth operations command center.

The product enables coordinators to:

*   create and track pre-auth requests,
    
*   monitor delays and SLA risk,
    
*   escalate stuck approvals,
    
*   add operational notes,
    
*   and give directors live visibility into bottlenecks.
    

The goal is not to automate insurance approvals.

The goal is to create operational visibility and accountability across the workflow.

High-Level User Flow
--------------------

Admin receives pre-auth task→ Create request in Medicena→ Send insurer request through existing channels→ Update request status and notes→ Escalate if delay or SLA breach risk appears

Director monitors dashboard→ Identifies insurer or workload bottlenecks→ Reassigns or operationally follows up

Request resolved→ Mark approved or rejected→ Metrics roll into operational reporting

Key Screens
-----------

### 1\. Queue Screen _(Core Operational View)_

*   Active request queue
    
*   Priority and aging indicators
    
*   SLA risk visibility
    
*   Status filtering and sorting
    

### 2\. Request Details Drawer

*   Timeline tracking
    
*   Ownership visibility
    
*   Notes and status updates
    
*   Escalation actions
    

### 3\. New Request Form

*   Fast intake for pre-auth requests
    
*   Assignee and insurer selection
    
*   Priority and communication channel tracking
    

### 4\. Director Dashboard

*   Delays by insurer
    
*   Queue aging analytics
    
*   Coordinator workload visibility
    
*   Operational bottleneck monitoring
    

Commercial Context
------------------

The primary buyers are:

*   hospital operations leadership,
    
*   general managers,
    
*   and CFO-influenced operational stakeholders.
    

Daily users are insurance coordinators and pre-auth admins.

The product is evaluated on operational outcomes:

*   faster approvals,
    
*   fewer stuck cases,
    
*   improved visibility,
    
*   reduced coordination chaos,
    
*   and smoother patient flow.
    

The pricing model is intended to be a lightweight monthly SaaS subscription per hospital site or pre-auth volume band.

3\. Prototype
=============

Deliverables
------------

*   Discovery & Framing Memo[https://drive.google.com/file/d/14R3sAkTcQitLvLKGgtWCXb90AzaD3OCO/view?usp=sharing](https://drive.google.com/file/d/14R3sAkTcQitLvLKGgtWCXb90AzaD3OCO/view?usp=sharing)
    
*   Solution Outline[https://drive.google.com/file/d/1va0xockCzJjo7m7XJkFDMicbz0RgkzRg/view?usp=sharing](https://drive.google.com/file/d/1va0xockCzJjo7m7XJkFDMicbz0RgkzRg/view?usp=sharing)
    
*   Measurement Plan[https://drive.google.com/file/d/1eRWxrz2E9N4X5tJhnB-Xftre61PSEdqB/view?usp=sharing](https://drive.google.com/file/d/1eRWxrz2E9N4X5tJhnB-Xftre61PSEdqB/view?usp=sharing)
    

What the Prototype Demonstrates
-------------------------------

*   Live operational queue management
    
*   Request tracking and escalation
    
*   Timeline-based coordination workflow
    
*   Director-level operational visibility
    
*   SLA risk awareness and bottleneck surfacing
    

Built With
----------

*   Cursor
    
*   LLM drafting support
    
*   React prototype implementation
    

AI tools were used to:

*   structure the product framing,
    
*   refine workflows,
    
*   analyze operational logic,
    
*   and accelerate iteration speed.
    

4\. Measurement Plan
====================

[→ Read the full measurement plan](https://drive.google.com/file/d/1eRWxrz2E9N4X5tJhnB-Xftre61PSEdqB/view?usp=sharing)

The framework evaluates two core dimensions:

**Desirability** — do coordinators actually adopt and rely on the system?**Viability** — does the workflow improve enough operationally to justify payment?

Metrics
-------

TypeMetricTarget (Week 4)InputQueue capture rate≥ 75%InputActive usage depthConsistent operational actions dailyInputEscalation timelinessMajority of risky requests escalated earlyOutputMedian approval cycle time↓ 20% or moreOutputSLA breach rate↓ 25% or more

What Failure Looks Like
-----------------------

*   Coordinators continue relying mainly on WhatsApp and spreadsheets
    
*   Queue capture remains below 40%
    
*   Minimal improvement in approval cycle time
    
*   Directors do not operationally rely on the dashboard
    
*   Product is perceived as extra work rather than operational leverage
    

5\. Walkthrough Video
=====================

[→ Watch the recording](https://drive.google.com/file/d/1HEqXl9A_OqFLedU9T-gv1X0CZwLwPxse/view?usp=sharing)

Covers
------

*   Why this wedge was chosen
    
*   Product framing and tradeoffs
    
*   Prototype walkthrough
    
*   What was intentionally excluded
    
*   Measurement strategy and validation logic