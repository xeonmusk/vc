# API Documentation

## Authentication

### POST /api/auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "role": "string"
  }
}
```

## Products

### GET /api/products
Get all products.

**Headers:**
- Authorization: Bearer {token}

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "price": "number",
    "available": "boolean"
  }
]
```

## Farm Management

### GET /api/farm/stats
Get farm statistics and analytics.

**Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
  "productionData": {
    "labels": ["Jan", "Feb", "Mar"],
    "datasets": [{
      "label": "Production",
      "data": [1000, 1200, 1100]
    }]
  },
  "inventoryTrends": {
    "labels": ["Week 1", "Week 2", "Week 3"],
    "datasets": [{
      "label": "Stock Levels",
      "data": [500, 450, 480]
    }]
  }
}
```

### POST /api/farm/tasks
Create new farm task.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "assignedTo": "string",
  "priority": "high|medium|low",
  "dueDate": "date"
}
```
