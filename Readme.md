step1 : clone the repository 

step2:follow the intruction to run the project separatly 


1.Run Backend
  step1: get into the backend folder ex: cd backend
  step 2: enter npm install
  step 3 : setup the .env file
  step 4: enter npm start to run the node js backend on port 5000



  2.Run remote-fde 
  step1: get into the backend folder ex: cd remote-fde
  step 2: enter npm install
  step 3 : setup the .env file ex:VITE_BASE_URL=http://localhost:5000
  step 4: enter npm run build
   step 4: after the successful build enter -  npm run serve


     2.Run task-management-host 

       step1: get into the task-management-host folder ex: cd task-management-host
  step 2: enter npm install
  step 3 : setup the .env file ex:VITE_BASE_URL=http://localhost:5000 , VITE_GOOGLE_MAPS_API_KEY
   step 4: after the successful build enter -  npm run dev




# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Set up the environment file (.env)
# Example:
# PORT=5000
# DATABASE_URL=<your_database_url>

# Start the backend server
npm start


# Navigate to the remote frontend folder
cd remote-fde

# Install dependencies
npm install

# Set up the environment file (.env)
# Example:
VITE_BASE_URL=http://localhost:5000

# Build the project
npm run build

# Serve the built project
npm run serve




# Navigate to the task management host folder
cd task-management-host

# Install dependencies
npm install

# Set up the environment file (.env)
# Example:
VITE_BASE_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=<your_google_maps_api_key>

# Start the development server
npm run dev


