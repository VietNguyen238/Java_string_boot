# Project Setup with Docker

This guide will help you set up and run the project using Docker. Follow the steps below to get started.

## Prerequisites
- Install [Git](https://git-scm.com/)
- Install [Docker](https://www.docker.com/)
- Install [Docker Compose](https://docs.docker.com/compose/)

## Steps to Run the Project

### 1. Clone the Repository
Clone the project repository from GitHub:
```bash
git clone https://github.com/HaiNam1408/java2-final-project.git
cd java2-final-project
```

### 2. Directory Structure
Ensure the project directory is structured as follows:
```
project/
├── backend/
│   ├── Dockerfile
│   ├── src/
│   └── ...
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   └── ...
├── docker-compose.yml
└── .env
```

### 3. Configure Environment Variables
Edit the `.env` file to ensure correct API and database configurations:
```
VITE_API_URL=http://backend-java2:8080/api
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/java2
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=admin
```

### 4. Build and Run the Project
Run the following command to build and start all services:
```bash
docker-compose up --build
```

### 5. Access the Application
- **Frontend**: Open your browser and navigate to [http://localhost:3000](http://localhost:3000)
- **Backend API**: Access the API at [http://localhost:8080/api](http://localhost:8080/api)

### 6. Stop the Project
To stop all services, run:
```bash
docker-compose down
```

## Additional Information

### Docker Services
The project uses the following services:
- **frontend**: React application built with Vite.
- **backend**: Java Spring Boot API.
- **db**: PostgreSQL database.

### Dependencies
- **Frontend** dependencies include:
  - `react`
  - `vite`
  - `@chakra-ui/react`
  - `@mui/material`
  - ... (full list in `package.json`)
- **Backend** dependencies are defined in the `backend/pom.xml` or equivalent configuration file.

### Troubleshooting
1. **Port Issues**: Ensure no other services are running on ports `3000`, `8080`, or `5432`.
2. **Docker Errors**: Check Docker logs for detailed error messages:
   ```bash
   docker-compose logs
   ```
3. **Database Issues**: Ensure the PostgreSQL container is properly initialized and accessible.

### Cleaning Up
To remove all containers, volumes, and networks created by the project:
```bash
docker-compose down -v
```

## Contributing
Feel free to submit issues or pull requests for enhancements.

## License
This project is licensed under the [MIT License](LICENSE).

---
Happy coding!

