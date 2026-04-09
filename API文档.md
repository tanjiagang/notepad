# 记事本 API 文档

## 基础信息

- **基础 URL**: `http://localhost:3000/api`
- **数据格式**: JSON
- **认证方式**: JWT Bearer Token

---

## 接口列表

### 1. 健康检查

#### 接口信息
- **URL**: `/health`
- **方法**: `GET`
- **认证**: 不需要

#### 请求参数
无

#### 响应示例

**成功响应 (200)**
```json
{
  "status": "ok",
  "message": "服务运行正常"
}
```

---

### 2. 用户注册

#### 接口信息
- **URL**: `/users/register`
- **方法**: `POST`
- **认证**: 不需要

#### 请求参数

**Body (application/json)**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名 (3-20字符) |
| password | string | 是 | 密码 (至少6字符) |
| email | string | 否 | 邮箱 (可选) |

#### 请求示例
```json
{
  "username": "testuser",
  "password": "123456",
  "email": "test@example.com"
}
```

#### 响应示例

**成功响应 (201)**
```json
{
  "status": "success",
  "message": "注册成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65f7b2c3d4e5f67890abc123",
      "username": "testuser",
      "email": "test@example.com"
    }
  }
}
```

**错误响应 (400)**
```json
{
  "status": "error",
  "message": "用户名已存在"
}
```

---

### 3. 用户登录

#### 接口信息
- **URL**: `/users/login`
- **方法**: `POST`
- **认证**: 不需要

#### 请求参数

**Body (application/json)**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

#### 请求示例
```json
{
  "username": "testuser",
  "password": "123456"
}
```

#### 响应示例

**成功响应 (200)**
```json
{
  "status": "success",
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65f7b2c3d4e5f67890abc123",
      "username": "testuser",
      "email": "test@example.com"
    }
  }
}
```

**错误响应 (401)**
```json
{
  "status": "error",
  "message": "用户名或密码错误"
}
```

---

### 4. 笔记管理

#### 4.1 获取所有笔记

##### 接口信息
- **URL**: `/notes`
- **方法**: `GET`
- **认证**: 需要

##### 请求参数
无

##### 响应示例

**成功响应 (200)**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "65f7b2c3d4e5f67890abc123",
      "title": "测试笔记",
      "content": "这是一个测试笔记",
      "userId": "65f7b2c3d4e5f67890abc123",
      "filePath": "/notes/user1/65f7b2c3d4e5f67890abc123.txt",
      "isPinned": false,
      "category": "工作",
      "tags": ["测试", "工作"],
      "isEncrypted": false,
      "createdAt": "2024-03-15T08:30:00Z",
      "updatedAt": "2024-03-15T08:30:00Z"
    }
  ]
}
```

#### 4.2 创建笔记

##### 接口信息
- **URL**: `/notes`
- **方法**: `POST`
- **认证**: 需要

##### 请求参数

**Body (application/json)**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| title | string | 否 | 笔记标题 (默认: Untitled) |
| content | string | 否 | 笔记内容 (默认: 空) |
| isPinned | boolean | 否 | 是否置顶 (默认: false) |
| category | string | 否 | 分类 (默认: 空) |
| tags | array | 否 | 标签 (默认: []) |
| isEncrypted | boolean | 否 | 是否加密 (默认: false) |

##### 请求示例
```json
{
  "title": "新笔记",
  "content": "这是一个新笔记",
  "category": "个人",
  "tags": ["新", "个人"]
}
```

##### 响应示例

**成功响应 (201)**
```json
{
  "status": "success",
  "message": "笔记创建成功",
  "data": {
    "_id": "65f7b2c3d4e5f67890abc123",
    "title": "新笔记",
    "content": "这是一个新笔记",
    "userId": "65f7b2c3d4e5f67890abc123",
    "filePath": "/notes/user1/65f7b2c3d4e5f67890abc123.txt",
    "isPinned": false,
    "category": "个人",
    "tags": ["新", "个人"],
    "isEncrypted": false,
    "createdAt": "2024-03-15T08:30:00Z",
    "updatedAt": "2024-03-15T08:30:00Z"
  }
}
```

#### 4.3 获取单个笔记

##### 接口信息
- **URL**: `/notes/{id}`
- **方法**: `GET`
- **认证**: 需要

##### 请求参数

**Path 参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 笔记ID |

##### 响应示例

**成功响应 (200)**
```json
{
  "status": "success",
  "data": {
    "_id": "65f7b2c3d4e5f67890abc123",
    "title": "测试笔记",
    "content": "这是一个测试笔记",
    "userId": "65f7b2c3d4e5f67890abc123",
    "filePath": "/notes/user1/65f7b2c3d4e5f67890abc123.txt",
    "isPinned": false,
    "category": "工作",
    "tags": ["测试", "工作"],
    "isEncrypted": false,
    "createdAt": "2024-03-15T08:30:00Z",
    "updatedAt": "2024-03-15T08:30:00Z"
  }
}
```

**错误响应 (404)**
```json
{
  "status": "error",
  "message": "笔记不存在"
}
```

#### 4.4 更新笔记

##### 接口信息
- **URL**: `/notes/{id}`
- **方法**: `PUT`
- **认证**: 需要

##### 请求参数

**Path 参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 笔记ID |

**Body (application/json)**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| title | string | 否 | 笔记标题 |
| content | string | 否 | 笔记内容 |
| isPinned | boolean | 否 | 是否置顶 |
| category | string | 否 | 分类 |
| tags | array | 否 | 标签 |
| isEncrypted | boolean | 否 | 是否加密 |

##### 请求示例
```json
{
  "title": "更新后的笔记",
  "content": "这是更新后的笔记内容"
}
```

##### 响应示例

**成功响应 (200)**
```json
{
  "status": "success",
  "message": "笔记更新成功",
  "data": {
    "_id": "65f7b2c3d4e5f67890abc123",
    "title": "更新后的笔记",
    "content": "这是更新后的笔记内容",
    "userId": "65f7b2c3d4e5f67890abc123",
    "filePath": "/notes/user1/65f7b2c3d4e5f67890abc123.txt",
    "isPinned": false,
    "category": "工作",
    "tags": ["测试", "工作"],
    "isEncrypted": false,
    "createdAt": "2024-03-15T08:30:00Z",
    "updatedAt": "2024-03-15T09:00:00Z"
  }
}
```

**错误响应 (404)**
```json
{
  "status": "error",
  "message": "笔记不存在"
}
```

#### 4.5 删除笔记

##### 接口信息
- **URL**: `/notes/{id}`
- **方法**: `DELETE`
- **认证**: 需要

##### 请求参数

**Path 参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 笔记ID |

##### 响应示例

**成功响应 (200)**
```json
{
  "status": "success",
  "message": "笔记删除成功"
}
```

**错误响应 (404)**
```json
{
  "status": "error",
  "message": "笔记不存在"
}
```

---

## 数据模型

### User (用户)

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| _id | ObjectId | 自动生成 | 用户ID |
| username | string | 是 | 用户名，唯一 |
| email | string | 否 | 邮箱，唯一 (可选) |
| password | string | 是 | 密码 (加密存储) |
| phone | string | 否 | 手机号，唯一 (可选) |
| createdAt | Date | 自动生成 | 创建时间 |
| updatedAt | Date | 自动生成 | 更新时间 |

### Note (笔记)

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| _id | ObjectId | 自动生成 | 笔记ID |
| title | string | 是 | 笔记标题 (默认: Untitled) |
| content | string | 否 | 笔记内容 (默认: 空) |
| userId | string | 是 | 用户ID，关联到User |
| filePath | string | 是 | 笔记内容存储路径 |
| isPinned | boolean | 否 | 是否置顶 (默认: false) |
| category | string | 否 | 分类 (默认: 空) |
| tags | array | 否 | 标签 (默认: []) |
| isEncrypted | boolean | 否 | 是否加密 (默认: false) |
| createdAt | Date | 自动生成 | 创建时间 |
| updatedAt | Date | 自动生成 | 更新时间 |

---

## 认证说明

### 使用 JWT Token

1. 在登录或注册成功后，会返回一个 `token`
2. 在后续需要认证的请求中，将 token 放在请求头中：

```
Authorization: Bearer <token>
```

### Token 过期

- Token 有效期为 7 天
- Token 过期后需要重新登录获取新的 token

---

## 错误码说明

| HTTP 状态码 | 说明 |
|-------------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权或认证失败 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 注意事项

1. 所有请求和响应均使用 UTF-8 编码
2. 密码必须使用 bcrypt 加密存储
3. 所有时间格式使用 ISO 8601 标准
4. 建议在生产环境中使用 HTTPS
