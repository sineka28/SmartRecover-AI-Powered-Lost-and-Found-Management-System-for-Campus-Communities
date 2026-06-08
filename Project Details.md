# SmartRecover: AI-Powered Lost and Found Management System for Campus Communities

---

## 📌 Project Description

**SmartRecover** is a web-based platform designed to simplify the process of reporting, tracking, and recovering lost items within college campuses. The system enables users to report lost and found items, receive match suggestions, raise claim requests, and securely recover their belongings through an admin verification process.

The project aims to replace traditional notice boards and manual communication with a centralized digital solution that improves recovery efficiency and user experience.

---

## ❗ Problem Statement

Students and staff frequently lose personal belongings such as ID cards, wallets, keys, calculators, books, and electronic devices within campus premises. Existing lost-and-found methods are often informal, time-consuming, and lack proper tracking mechanisms.

There is a need for a centralized platform that allows users to report lost and found items, search for matches, and securely claim ownership — while reducing manual effort and improving recovery rates.

---

## 🎯 Project Objectives

1. Develop a centralized platform for managing lost and found items.
2. Allow users to report lost and found items with relevant details.
3. Enable efficient searching and filtering of items.
4. Provide intelligent match suggestions based on item information.
5. Facilitate secure claim verification and approval.
6. Maintain a digital record of item recovery history.
7. Improve communication between owners, finders, and administrators.
8. Reduce the time required to recover lost belongings.

---

## 🧩 Module List

### 1. User Registration & Login Module
- User account creation
- Secure authentication
- Profile management

### 2. Lost Item Module
- Report lost items
- Upload item details and images
- Track item status

### 3. Found Item Module
- Report found items
- Upload found item information
- Update item status

### 4. Search & Filter Module
- Search items by name
- Filter by category, location, and date

### 5. Match Suggestion Module
- Compare lost and found item details
- Generate possible match recommendations

### 6. Claim Management Module
- Submit ownership claims
- Verify item ownership
- Claim approval workflow

### 7. Notification Module
- Match notifications
- Claim status updates
- System alerts

### 8. Admin Dashboard Module
- Manage users
- Verify claims
- Monitor system activities
- Generate reports

---

## 🗄️ Database Table List

### Users

| Field | Type | Description |
|-------|------|-------------|
| user_id | INT (PK) | Unique user identifier |
| name | VARCHAR | Full name of the user |
| reg_no | VARCHAR | Campus registration number |
| email | VARCHAR | Email address |
| password | VARCHAR | Encrypted password |
| role | ENUM | Role: `student`, `staff`, `admin` |

---

### Lost_Items

| Field | Type | Description |
|-------|------|-------------|
| item_id | INT (PK) | Unique lost item identifier |
| user_id | INT (FK) | References Users table |
| item_name | VARCHAR | Name of the lost item |
| category | VARCHAR | Item category (e.g. electronics, keys) |
| color | VARCHAR | Color of the item |
| location | VARCHAR | Location where item was lost |
| date_lost | DATE | Date the item was lost |
| image | VARCHAR | Image file path or URL |
| status | ENUM | Status: `open`, `matched`, `recovered` |

---

### Found_Items

| Field | Type | Description |
|-------|------|-------------|
| found_id | INT (PK) | Unique found item identifier |
| user_id | INT (FK) | References Users table |
| item_name | VARCHAR | Name of the found item |
| category | VARCHAR | Item category |
| color | VARCHAR | Color of the item |
| location | VARCHAR | Location where item was found |
| date_found | DATE | Date the item was found |
| image | VARCHAR | Image file path or URL |
| status | ENUM | Status: `open`, `claimed`, `returned` |

---

### Claims

| Field | Type | Description |
|-------|------|-------------|
| claim_id | INT (PK) | Unique claim identifier |
| user_id | INT (FK) | References Users table |
| item_id | INT (FK) | References Lost_Items table |
| status | ENUM | Status: `pending`, `approved`, `rejected` |
| verification_details | TEXT | Ownership proof provided by user |

---

### Notifications

| Field | Type | Description |
|-------|------|-------------|
| notification_id | INT (PK) | Unique notification identifier |
| user_id | INT (FK) | References Users table |
| message | TEXT | Notification message content |
| date | DATETIME | Date and time of notification |
| status | ENUM | Status: `unread`, `read` |

---

### Match_Results

| Field | Type | Description |
|-------|------|-------------|
| match_id | INT (PK) | Unique match identifier |
| lost_item_id | INT (FK) | References Lost_Items table |
| found_item_id | INT (FK) | References Found_Items table |
| match_score | FLOAT | Similarity score (0.0 – 1.0) |

---

### Admin

| Field | Type | Description |
|-------|------|-------------|
| admin_id | INT (PK) | Unique admin identifier |
| username | VARCHAR | Admin login username |
| password | VARCHAR | Encrypted admin password |

---

## ✅ Expected Outcome

The system provides a **centralized and efficient platform** for managing lost and found items within campus communities — reducing manual effort, improving recovery rates, and ensuring secure ownership verification through a streamlined digital process.

---
