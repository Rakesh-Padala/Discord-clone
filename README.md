<body>

  <h1>🚀 Getting Started with Discord Clone</h1>
  <p>Follow the steps below to get your project up and running smoothly.</p>

  <h2>🔧 Installation</h2>
  <ol>
    <li><strong>Install backend dependencies:</strong>
      <pre>
        <code>cd backend</code>
        <code>npm install</code>
      </pre>
    </li>
    <li><strong>Navigate to the frontend directory and install dependencies:</strong>
      <pre><code>
        cd frontend
        npm install --force
        </code>
      </pre>
    </li>
  </ol>

  <h2>🛠️ Environment Setup</h2>
  <p>Create a <code>.env</code> file in the root directory and add the following:</p>
  <pre><code>PORT=5000
MONGODB_URI=mongodb+srv://&lt;user&gt;:&lt;password&gt;@cluster0.ghpubri.mongodb.net/?retryWrites=true&amp;w=majority&amp;appName=Cluster0
JWT_SECRET=vamshi</code></pre>
  <div class="tip">
    ⚠️ <strong>Note:</strong> Replace <code>&lt;user&gt;</code> and <code>&lt;password&gt;</code> with your actual MongoDB credentials.
  </div>

  <h2>▶️ Running the Project</h2>
  <ol>
    <li><strong>Start the backend server:</strong>
      <pre>
        <code>
          cd backend
          npm run dev
        </code>
      </pre>
    </li>
    <li><strong>In a new terminal, start the frontend server:</strong>
      <pre><code>
        cd frontend
        npm start</code>
      </pre>
    </li>
  </ol>

  <div class="success">
    ✅ <strong>You're Good to Go!</strong><br>
    The application should now be running on:<br>
    • <strong>Frontend:</strong> <code>http://localhost:3000</code><br>
    • <strong>Backend:</strong> <code>http://localhost:5000</code>
  </div>

  <p>Enjoy building your Discord clone! 🎉</p>

</body>
