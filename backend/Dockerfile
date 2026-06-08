
# ---------------------------------------------------------
# Lightweight Python 3.11 base image
# ---------------------------------------------------------
FROM python:3.11-slim


# ---------------------------------------------------------
# Prevent Python from writing .pyc files
# ---------------------------------------------------------
ENV PYTHONDONTWRITEBYTECODE=1

# ---------------------------------------------------------
# Force stdout/stderr flushing immediately
# Useful for Railway logs
# ---------------------------------------------------------
ENV PYTHONUNBUFFERED=1


# ---------------------------------------------------------
# Set working directory inside container
# ---------------------------------------------------------
WORKDIR /app


# ---------------------------------------------------------
# Install system dependencies
# ---------------------------------------------------------
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*


# ---------------------------------------------------------
# Copy dependency configuration first
# Improves Docker build caching
# ---------------------------------------------------------
COPY pyproject.toml .


# ---------------------------------------------------------
# Install Python dependencies
# ---------------------------------------------------------
RUN pip install --upgrade pip && \
    pip install .


# ---------------------------------------------------------
# Copy application source code
# ---------------------------------------------------------
COPY . .


# ---------------------------------------------------------
# Expose FastAPI port
# Railway automatically detects this
# ---------------------------------------------------------
EXPOSE 8000


# ---------------------------------------------------------
# Start FastAPI server
# ---------------------------------------------------------
CMD [
    "uvicorn",
    "src.api.main:app",
    "--host",
    "0.0.0.0",
    "--port",
    "8000"
]
