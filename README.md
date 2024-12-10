# Showroom Social Media App

**Showroom** is a modern social media application designed for showcasing collections, connecting users, and fostering creative inspiration. Built with a React frontend and a powerful Express backend integrated with Sanity CMS, Showroom provides seamless user interaction and robust data management.

---

## **Features**

- **User Authentication**: Secure login and registration system.
- **Dynamic Collections**: Users can create, share, and explore collections.
- **Pin Management**: Save and organize favorite items.
- **Search Functionality**: Effortlessly find users and collections.
- **Responsive Design**: Optimized for desktop and mobile devices.

---

## **Tech Stack**

### **Frontend**
- **Framework**: React (Vite for development)
- **Styling**: TailwindCSS for sleek, modern designs
- **Routing**: React Router for seamless navigation
- **State Management**: React Context API

### **Backend**
- **Framework**: Express.js
- **Database**: Sanity CMS for flexible content management
- **APIs**: Vercel express API for efficient backend operations

### **Deployment**
- **Frontend**: Netlify
- **Backend**: Hosted as Vercel serverless functions

---

## **Installation**

### **Clone the Repository**
```bash
git clone https://github.com/ariaodoh/showroom-app.git
cd showroom-app
```

### **Install Dependencies**
For both the frontend and backend:
```bash
npm install
```

### **Environment Setup**
Create a `.env` file for both the React frontend and backend:
```plaintext
# .env (frontend)
VITE_GOOGLE_OAUTH_TOKEN=<your-sanity-project-id>
VITE_API_BASE_URL=<your-backend-api-url>

# .env (backend)
SANITY_PROJECT_ID=<your-sanity-project-id>
SANITY_DATASET=<your-sanity-dataset>
SANITY_API_TOKEN=<your-sanity-token>
```

### **Run Locally**
Start the development server for the frontend:
```bash
npm run dev
```
Start the development server for the backend:
```bash
npm run dev-start
```

---

## **Deployment**

### **Frontend**
Deploy the React app to Vercel:
1. Push your code to GitHub or another repository.
2. Import the project to Netlify.
3. Set the required environment variables in the Netlify Dashboard.

### **Backend**
Deploy the Express API on Vercel:
1. Ensure API routes are configured correctly in the `api` folder.
2. Deploy via the Vercel CLI:
   ```bash
   vercel deploy
   ```

---

## **Usage**

1. **Create an Account**: Register and log in to access all features.
2. **Explore Collections**: Browse trending collections from the community.
3. **Pin and Save**: Manage your inspirations by pinning them to your account.
4. **Search**: Find users and collections with advanced filters.

---

## **Folder Structure**

```plaintext
showroom-app/
├── api/                # Backend (Express API)
│   ├── index.js        # Serverless functions entry point
│   ├── routes/         # API routes
│   └── config/         # Sanity configuration
├── src/                # Frontend (React)
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── utils/          # Helper functions
│   └── App.jsx         # Main React component
├── public/             # Static files
├── .env                # Environment variables
├── package.json        # Project dependencies
└── README.md           # Project documentation
```

---

## **Contributing**

Contributions are welcome! If you'd like to contribute:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch-name`.
3. Commit your changes: `git commit -m "Add new feature"`.
4. Push to the branch: `git push origin feature-branch-name`.
5. Open a Pull Request.

---

## **License**

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## **Contact**

For questions or support, please contact:
- **GitHub**: [ariaodoh/showroom-app](https://github.com/ariaodoh/showroom-app) 
