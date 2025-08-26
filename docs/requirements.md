# Project Requirements

## 1. Functional Requirements

### 1.1. User Account Management

- **As a new user,** I want to register for an account using my email or a social media profile (Google/Facebook) so I can start shopping.
- **As a registered user,** I want to log in securely to access my account and order history.
- **As a logged-in user,** I want to manage my profile information, including shipping addresses and payment methods.

### 1.2. Product Discovery

- **As a user,** I want to browse products by category to easily find what I'm looking for.
- **As a user,** I want to use a search bar with auto-suggestions to quickly find specific products.
- **As a user,** I want to filter and sort product listings by price, rating, and relevance.
- **As a user,** I want to view detailed product pages with multiple images, descriptions, specifications, and user reviews.

### 1.3. Shopping Cart

- **As a user,** I want to add products to my shopping cart from a product detail page.
- **As a user,** I want to view and edit the contents of my cart (change quantity, remove items).
- **As a user,** I want to see a clear summary of my order total, including subtotal, taxes, and shipping costs.

### 1.4. Checkout & Payment

- **As a user,** I want a multi-step, secure checkout process.
- **As a user,** I want to enter or select my shipping address.
- **As a user,** I want to pay securely using my credit/debit card via the Stripe integration.
- **As a user,** I want to receive an order confirmation via email and in the app upon successful payment.

### 1.5. Post-Purchase

- **As a user,** I want to view my order history and the status of current orders (e.g., Processing, Shipped, Delivered).
- **As a user,** I want to track my shipment with a provided tracking number.
- **As a user,** I want to leave a rating and a written review for products I have purchased.

## 2. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Security** | - All communication between the app and server must be encrypted via HTTPS.<br>- Payment card information must be handled in a PCI-compliant manner (tokenization via Stripe SDK).<br>- User passwords must be hashed and salted. |
| **Performance** | - App should launch in under 3 seconds.<br>- Product images should be optimized and lazy-loaded.<br>- API response times should be under 500ms for typical requests. |
| **Usability** | - The user interface must be intuitive and follow platform-specific design guidelines (HIG for iOS, Material Design for Android).<br>- The app must be fully responsive and accessible. |
| **Compatibility** | - The app must function correctly on the latest two major versions of iOS and Android.<br>- The app must support a range of screen sizes and resolutions. |

## 3. Technical Requirements

- The backend will be a RESTful API built with Node.js and Express.
- User authentication will be managed by Firebase Authentication, with JWTs used to authorize API requests.
- The database schema in MongoDB will be designed to support products, users, orders, and reviews efficiently.
- The React Native application state will be managed using a state management library (e.g., Redux Toolkit or Zustand).