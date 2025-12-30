# Out of Scope
# School Result Management System (SRMS) - MVP

**Version:** 1.0  
**Date:** 2025-12-30  
**Owner:** Product Manager

---

## Purpose of This Document

This document explicitly defines what is **NOT included** in the School Result Management System MVP (v1.0). The purpose is to:
- Prevent scope creep
- Align stakeholder expectations
- Focus development effort on core value
- Provide clear boundaries for decision-making
- Document features deferred to future releases

**If it's not in the functional requirements AND not in this out-of-scope list, ask before implementing.**

---

## 1. Features Explicitly Excluded from MVP

### 1.1 Integration with Existing Systems

**Excluded:**
- Integration with existing School Management Systems (SMS)
- Integration with Student Information Systems (SIS)
- Integration with Learning Management Systems (LMS like Moodle, Canvas)
- Integration with financial/accounting systems
- Integration with library management systems
- Integration with attendance tracking systems
- SSO integration with Google Workspace or Microsoft 365
- API for third-party integrations

**Why Excluded:**
- Each school uses different systems (no standard)
- Integration requires significant development and maintenance effort
- MVP focuses on standalone result management
- Manual data import/export sufficient for MVP

**Future Consideration:** Post-MVP (v1.1 or v2.0), provide REST API and OAuth for integrations

---

### 1.2 Real-Time Collaboration Features

**Excluded:**
- Multiple teachers editing same grade sheet simultaneously
- Real-time notifications (e.g., "Admin is reviewing your submission")
- Live chat or messaging between users
- Collaborative grade discussions or comment threads
- Real-time dashboard updates without refresh

**Why Excluded:**
- Complex technical implementation (WebSockets, real-time sync)
- Not critical for core use case
- Asynchronous workflow sufficient (teachers work independently)
- Increases infrastructure complexity and cost

**Future Consideration:** Post-MVP if user demand is high

---

### 1.3 Offline-First Mobile Applications

**Excluded:**
- Native iOS app
- Native Android app
- Offline mode (work without internet, sync later)
- Mobile app stores (App Store, Google Play) distribution
- Push notifications via mobile app

**Why Excluded:**
- Responsive web app sufficient for mobile access
- Native app development doubles development cost
- Offline sync adds significant complexity
- Browsers provide adequate mobile experience

**Future Consideration:** Post-MVP (v2.0+) if strong user demand for native apps

**MVP Includes:** Responsive web design that works on mobile browsers

---

### 1.4 AI-Powered Features

**Excluded:**
- AI-generated performance insights or recommendations
- Predictive analytics (e.g., "Student likely to fail")
- Automated grading suggestions
- Natural language processing for teacher comments
- AI-powered anomaly detection in grades
- Chatbot for student/parent support

**Why Excluded:**
- Not core to result management
- Requires machine learning infrastructure
- Needs training data (not available initially)
- Manual processes adequate for MVP

**Future Consideration:** Post-MVP (v2.0+) as value-added features

---

### 1.5 Advanced Analytics and Business Intelligence

**Excluded:**
- Custom report builder with drag-and-drop
- Advanced data visualization dashboards
- Cohort analysis and longitudinal studies
- Comparative analytics across schools (benchmarking)
- Predictive modeling (grade projections, dropout risk)
- Data export to BI tools (Tableau, Power BI)

**Why Excluded:**
- Basic reports sufficient for MVP
- Complex analytics not primary use case
- Requires data science expertise
- Can be added later based on demand

**MVP Includes:** Basic class and school-wide reports (pass rates, averages, distributions)

**Future Consideration:** Post-MVP (v1.1+) as enhanced reporting module

---

### 1.6 Attendance and Behavior Tracking

**Excluded:**
- Student attendance tracking
- Tardiness/absences recording
- Behavior incidents logging
- Detention/suspension management
- Parent notifications for attendance issues

**Why Excluded:**
- Separate domain from result management
- Many schools use dedicated attendance systems
- Scope creep risk (attendance is complex)
- Focus on core value: academic results

**Future Consideration:** Possible future integration, but likely stays separate

---

### 1.7 Financial Features

**Excluded:**
- Fee management and billing
- Payment processing (school fees, tuition)
- Financial aid/scholarship tracking
- Invoice generation
- Payment reminders
- Integration with accounting software

**Why Excluded:**
- Completely separate domain
- Requires payment gateway integration (PCI compliance)
- Financial systems have different security requirements
- Not related to academic results

**Future Consideration:** Not planned; schools use dedicated financial systems

---

### 1.8 Communication and Messaging

**Excluded:**
- Email marketing campaigns to parents
- SMS notifications (except basic result publication alerts)
- In-app messaging between teachers, students, parents
- Announcement/news feed system
- Parent-teacher conference scheduling
- Mass communication tools

**Why Excluded:**
- Communication tools available elsewhere (email, SMS providers)
- Not core to result management
- Increases complexity significantly

**MVP Includes:** Basic email notification when results are published (P1 feature, may be deferred)

**Future Consideration:** Post-MVP if users request integrated communication

---

### 1.9 Timetable and Curriculum Management

**Excluded:**
- Class timetable/schedule creation
- Teacher timetable management
- Curriculum planning and mapping
- Lesson planning tools
- Assignment/homework tracking
- Exam/test scheduling

**Why Excluded:**
- Separate domain from result management
- Many schools use dedicated timetable software
- Complex scheduling algorithms required
- Not related to core value proposition

**Future Consideration:** Not planned; focus remains on results

---

### 1.10 Library and Resource Management

**Excluded:**
- Library book cataloging
- Book checkout/return tracking
- Digital resource library
- Equipment/facility booking
- Inventory management

**Why Excluded:**
- Completely unrelated to result management
- Schools use dedicated library systems

**Future Consideration:** Not planned

---

## 2. Platform Exclusions

### 2.1 Platforms NOT Supported in MVP

**Excluded Platforms:**
- Internet Explorer (any version)
- Legacy browsers (Chrome < v100, Firefox < v100, etc.)
- Browsers with JavaScript disabled
- Text-only browsers
- Feature phones (non-smartphones)

**Why Excluded:**
- Modern browsers provide better performance and security
- IE market share negligible and no longer supported by Microsoft
- Maintaining legacy browser support increases development cost
- JavaScript required for core functionality

**MVP Supports:** Modern browsers (Chrome, Firefox, Safari, Edge) - last 2 versions

---

### 2.2 Devices NOT Optimized For

**Excluded:**
- Smart TVs
- Smart watches
- Game consoles (PlayStation, Xbox browsers)
- E-readers (Kindle, etc.)
- Extremely small screens (< 320px width)

**Why Excluded:**
- Not typical use cases for school result management
- Limited user base on these devices
- Desktop, tablet, mobile cover 99%+ of use cases

**MVP Supports:** Desktop, tablet, smartphone (responsive design)

---

## 3. Technical Exclusions

### 3.1 Deployment Options NOT Supported

**Excluded:**
- On-premise installation (self-hosted on school servers)
- Hybrid cloud deployment
- Private cloud deployment (dedicated cloud instance per school)
- Air-gapped network deployment (no internet)

**Why Excluded:**
- SaaS (cloud-based) model simplifies maintenance
- On-premise requires IT expertise schools may not have
- Support costs higher for on-premise
- Cloud provides better scalability and updates

**MVP Deployment:** Cloud-only (AWS/Azure/GCP), multi-tenant SaaS

**Future Consideration:** On-premise option for government/large schools (v2.0+) if demand exists

---

### 3.2 Advanced Technical Features

**Excluded:**
- Multi-region deployment (data residency compliance)
- White-labeling (schools rebrand as their own)
- Custom domain per school (e.g., school.srms.com)
- API webhooks for real-time events
- GraphQL API (only REST API if available)
- Command-line interface (CLI) for bulk operations

**Why Excluded:**
- Not required for core functionality
- Increases complexity and infrastructure cost
- MVP focuses on web UI, not API/automation

**Future Consideration:** White-labeling and custom domains for premium tier (v2.0+)

---

### 3.3 Database and Data Features

**Excluded:**
- Real-time data replication across regions
- Multi-master database (write to multiple locations)
- Data warehousing and OLAP
- NoSQL database support (MongoDB, etc.)
- Graph database for relationships
- Time-series database for analytics

**Why Excluded:**
- Relational database (PostgreSQL/MySQL) sufficient
- Real-time replication unnecessary for result management
- Standard backup/restore adequate for MVP

**MVP Database:** Single relational database (PostgreSQL or MySQL)

---

## 4. Business Model Exclusions

### 4.1 Pricing Models NOT Offered in MVP

**Excluded:**
- Free tier with limited features
- Freemium model (basic free, premium paid)
- Pay-per-student pricing
- Transaction-based pricing (charge per report generated)
- Enterprise pricing with custom contracts
- Reseller/partner program

**Why Excluded:**
- MVP focuses on proving value first
- Complex pricing increases sales friction
- Simple pricing easier to communicate and manage

**MVP Pricing:** Subscription-based (per school, flat rate or tiered by student count)

**Future Consideration:** Pricing optimization based on market feedback

---

### 4.2 Payment Features NOT Supported

**Excluded:**
- Multiple payment methods (credit card, PayPal, bank transfer, mobile money)
- Automatic payment processing
- Invoice generation and tracking
- Payment reminders
- Refund processing
- Multi-currency support

**Why Excluded:**
- Payment processing complex (PCI compliance, fraud prevention)
- Manual invoicing sufficient for MVP (small customer base)
- Focus on product, not payment infrastructure

**MVP Payment:** Manual invoicing, bank transfer or simple Stripe integration

**Future Consideration:** Automated billing post-MVP

---

### 4.3 Customer Segments NOT Targeted in MVP

**Excluded:**
- Universities and higher education institutions
- International schools (non-English language)
- Home-schooling parents
- Tutoring centers
- Online courses/e-learning platforms
- Corporate training programs

**Why Excluded:**
- Different grading systems and requirements
- MVP focuses on K-12 schools (primary and secondary)
- Language and localization not supported yet
- Feature set designed for traditional schools

**MVP Target:** Primary and secondary schools (K-12) in English-speaking markets

**Future Consideration:** Higher education and internationalization (v2.0+)

---

## 5. Data and Reporting Exclusions

### 5.1 Historical Data NOT Migrated

**Excluded:**
- Importing 10+ years of historical results
- Migrating data from legacy systems automatically
- Preserving complex legacy grading schemes
- Bulk import of scanned report cards (OCR)

**Why Excluded:**
- Data migration effort depends on source system
- Manual entry acceptable for critical historical data
- Focus on current and future results
- Legacy data may be in inconsistent formats

**MVP Approach:** Schools start fresh with current academic year, optionally manually enter recent historical data

**Future Consideration:** Data migration services for premium customers

---

### 5.2 Reports NOT Available in MVP

**Excluded:**
- Custom report designer (user creates reports)
- Scheduled report generation (auto-generate monthly)
- Email report delivery automation
- Comparative reports across multiple schools
- Longitudinal studies (3+ year trends)
- Grade prediction models

**Why Excluded:**
- Basic reports cover core needs
- Custom reporting complex to build and maintain
- Schools can export data for advanced analysis

**MVP Reports:** Standard reports (class summaries, student results, pass rates, grade distributions)

**Future Consideration:** Custom reporting in premium tier

---

## 6. Compliance and Localization Exclusions

### 6.1 International Compliance NOT Covered

**Excluded:**
- EU GDPR compliance (if not serving EU markets)
- CCPA compliance (if not serving California)
- FERPA compliance (U.S. student data protection)
- Country-specific data residency requirements
- Industry-specific compliance (HIPAA, SOC2 Type II)

**Why Excluded:**
- Compliance requirements vary by jurisdiction
- MVP targets specific geographic market first
- Compliance certification expensive and time-consuming

**MVP Compliance:** General data protection best practices, applicable laws in target market

**Future Consideration:** Compliance certifications based on market expansion

---

### 6.2 Localization NOT Supported

**Excluded:**
- Multi-language interface (French, Spanish, Arabic, etc.)
- Right-to-left (RTL) language support
- Currency localization (for future payment features)
- Date/time format localization
- Timezone support (if schools in different timezones)
- Cultural adaptations (holiday calendars, academic year variations)

**Why Excluded:**
- Localization doubles development effort
- MVP targets single language market (English)
- Translation and cultural adaptation require native speakers

**MVP Language:** English only

**Future Consideration:** Internationalization (i18n) framework post-MVP, add languages based on demand

---

## 7. Support and Services Exclusions

### 7.1 Support Services NOT Offered in MVP

**Excluded:**
- 24/7 phone support
- Dedicated account manager per school
- On-site training and implementation
- Custom development/features per school
- Data migration services
- Professional services (consulting, setup assistance)

**Why Excluded:**
- High-touch support doesn't scale for MVP
- Self-service documentation sufficient initially
- Focus on product, not services

**MVP Support:** 
- Email support (response within 24 hours)
- Help documentation / knowledge base
- Optional: Live chat (business hours)

**Future Consideration:** Premium support tier for larger schools

---

### 7.2 Training Materials NOT Created in MVP

**Excluded:**
- Video tutorials for all features
- Certification program for administrators
- Train-the-trainer materials
- Webinar series
- In-person training workshops

**Why Excluded:**
- Product should be intuitive (minimal training needed)
- Creating comprehensive training materials time-consuming
- Written documentation sufficient for MVP

**MVP Training:** 
- User manual / help documentation
- Tooltips and in-app guidance
- Optional: Getting started guide

**Future Consideration:** Video tutorials and webinars based on user feedback

---

## 8. Performance and Scale Exclusions

### 8.1 Performance NOT Guaranteed For

**Excluded:**
- Schools with > 10,000 students (MVP target: up to 10,000)
- Concurrent access by > 500 users simultaneously
- Processing > 100,000 grade entries per hour
- Generating > 1,000 PDFs simultaneously
- Storing > 10 years of historical data

**Why Excluded:**
- MVP targets small to medium schools
- Large-scale performance requires additional infrastructure
- Optimization for scale can be done incrementally

**MVP Performance:** Optimized for schools with up to 10,000 students, 500 concurrent users

**Future Consideration:** Enterprise tier for larger institutions (v2.0+)

---

### 8.2 High Availability NOT Guaranteed

**Excluded:**
- 99.99% uptime SLA (four nines)
- Multi-region failover
- Load balancing across multiple data centers
- Real-time database replication
- Disaster recovery with < 1 hour RTO

**Why Excluded:**
- High availability expensive (redundant infrastructure)
- MVP targets 99.5% uptime (acceptable for schools)
- Perfect uptime not critical for result management

**MVP Availability:** 99.5% uptime target, single region deployment, 4-hour RTO

**Future Consideration:** HA for enterprise customers

---

## 9. Security Exclusions

### 9.1 Advanced Security Features NOT Included

**Excluded:**
- Multi-factor authentication (MFA/2FA)
- Biometric authentication (fingerprint, face recognition)
- Hardware security keys (YubiKey, etc.)
- Advanced threat protection (DDoS mitigation, WAF)
- Security Information and Event Management (SIEM)
- Penetration testing by third-party firm

**Why Excluded:**
- Basic authentication sufficient for MVP
- Advanced security adds complexity and cost
- Schools don't typically require military-grade security

**MVP Security:** Strong password policies, HTTPS, RBAC, encryption at rest/transit, basic security best practices

**Future Consideration:** MFA and advanced security for premium tier

---

### 9.2 Audit and Compliance Features NOT Included

**Excluded:**
- SOC 2 Type II compliance report
- ISO 27001 certification
- Regular third-party security audits
- Compliance dashboard for administrators
- Detailed audit trail for every action (basic audit only)

**Why Excluded:**
- Certification expensive and time-consuming
- Not required for K-12 schools typically
- Basic audit logging sufficient for MVP

**MVP Audit:** Logging of critical actions (user creation, result override, configuration changes)

**Future Consideration:** Compliance certifications for enterprise/government customers

---

## 10. Miscellaneous Exclusions

### 10.1 Features Common in Competitors BUT Excluded

**Excluded:**
- Student portfolios (collection of work samples)
- Competency-based grading (skill mastery tracking)
- Standards-based reporting (alignment with educational standards)
- Parent portal with behavior and attendance
- Teacher collaboration spaces
- Gradebook with ongoing assignment tracking

**Why Excluded:**
- SRMS focuses specifically on result management (term-end results)
- Not a full gradebook (ongoing assignments during term)
- Competitors offer broader school management suites
- MVP = narrow, deep focus on automated result processing

**MVP Focus:** Term/session result entry, calculation, and reporting only

---

### 10.2 "Nice to Have" Features Deferred

**Excluded (for now):**
- Dark mode UI
- Customizable dashboard widgets
- Email templates customization
- Bulk undo/redo for grade entry
- Grade comparison with national/regional averages
- Student self-assessment and goal setting

**Why Excluded:**
- Not core to MVP value proposition
- Can be added incrementally based on user feedback
- Focus on essential features first

**Future Consideration:** User feedback will prioritize these

---

## Summary

### What IS Included in MVP
✅ Core result management (grade entry, calculation, reporting)  
✅ Automated calculations (weighted scores, rankings, letter grades)  
✅ PDF report card generation  
✅ Configurable grading scales and subject weighting  
✅ Role-based access (Admin, Teacher, Student, Parent)  
✅ Responsive web application (desktop, tablet, mobile)  
✅ Basic security and data protection  
✅ Cloud-hosted SaaS deployment  

### What is NOT Included in MVP
❌ Integration with other school systems  
❌ Real-time collaboration  
❌ Native mobile apps  
❌ AI-powered features  
❌ Advanced analytics  
❌ Attendance, behavior, financial features  
❌ Communication/messaging tools  
❌ On-premise deployment  
❌ Multi-language support  
❌ 24/7 support  

---

## Decision Framework

**When a new feature request comes up, ask:**
1. Does it help schools manage term-end results more efficiently? (Core value)
2. Is it required for MVP success, or can it wait?
3. Does it serve our target user (K-12 schools)?
4. Can it be built without delaying MVP launch?

**If NO to any question → Add to out-of-scope and consider for post-MVP.**

---

**Document Status:** Complete  
**Review Cycle:** Update as product evolves  
**Owner:** Product Manager  
**Last Updated:** 2025-12-30
