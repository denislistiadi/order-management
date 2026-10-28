/**
 * OpenAPI 3.0 specification definition for Order Management API.
 */

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Order Management API',
    version: '1.0.0',
    description: 'RESTful API documentation for Order Management System with JWT Access & Refresh Token Authentication.',
  },
  servers: [
    {
      url: '/api',
      description: 'API base path',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Masukkan JWT Access Token dengan format: Bearer <token>',
      },
    },
    schemas: {
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'admin@example.com',
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'password123',
          },
        },
      },
      RefreshTokenInput: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
      UserProfile: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
          },
          name: {
            type: 'string',
            example: 'System Administrator',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'admin@example.com',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      LoginResponseData: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          user: {
            $ref: '#/components/schemas/UserProfile',
          },
        },
      },
      RefreshResponseData: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Operasi berhasil',
          },
          data: {
            type: 'object',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Pesan kegagalan operasi',
          },
          errors: {
            type: 'object',
            additionalProperties: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            example: {
              'email': ['Format email tidak valid'],
            },
          },
        },
      },
      ProductItem: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          product_code: { type: 'string', example: 'PRD-001' },
          product_name: { type: 'string', example: 'Logitech MX Master 3S Wireless Mouse' },
          stock: { type: 'integer', example: 45 },
          price: { type: 'string', example: '1650000.00' },
          deleted_at: { type: 'string', nullable: true, example: null },
        },
      },
      CreateProductInput: {
        type: 'object',
        required: ['product_name', 'price'],
        properties: {
          product_code: {
            type: 'string',
            description: 'Kode produk unik (opsional, jika tidak disediakan akan di-generate otomatis oleh server)',
            example: 'PRD-021',
          },
          product_name: { type: 'string', example: 'Wireless Mechanical Numpad' },
          price: { type: 'number', example: 550000 },
          stock: { type: 'integer', example: 20 },
        },
      },
      UpdateProductInput: {
        type: 'object',
        properties: {
          product_code: {
            type: 'string',
            description: 'Kode produk unik (opsional, jika diubah akan diverifikasi keunikannya)',
            example: 'PRD-021',
          },
          product_name: { type: 'string', example: 'Wireless Mechanical Numpad RGB' },
          price: { type: 'number', example: 590000 },
          stock: { type: 'integer', example: 25 },
        },
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          per_page: { type: 'integer', example: 10 },
          total: { type: 'integer', example: 20 },
          total_pages: { type: 'integer', example: 2 },
        },
      },
    },
  },
  paths: {
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Otentikasi Administrator',
        description: 'Memverifikasi email dan password admin, mengembalikan access token dan refresh token JWT.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login berhasil, access token dan refresh token JWT diberikan.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Login berhasil' },
                    data: { $ref: '#/components/schemas/LoginResponseData' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Email atau kata sandi tidak cocok.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '422': {
            description: 'Validasi input gagal.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Authentication'],
        summary: 'Pembaruan Access Token (Refresh Token)',
        description: 'Menukar refresh token yang valid untuk mendapatkan access token baru.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RefreshTokenInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Token berhasil diperbarui.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Token berhasil diperbarui' },
                    data: { $ref: '#/components/schemas/RefreshResponseData' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Refresh token tidak valid atau telah dicabut.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '422': {
            description: 'Payload tidak lengkap.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Profil Administrator Aktif',
        description: 'Mengambil profil detail admin yang sedang terotentikasi dari Bearer token.',
        security: [
          {
            BearerAuth: [],
          },
        ],
        responses: {
          '200': {
            description: 'Profil berhasil dimuat.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Profil pengguna berhasil diambil' },
                    data: { $ref: '#/components/schemas/UserProfile' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Token tidak valid, kedaluwarsa, atau tidak disediakan.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'Logout Sesi Administrator',
        description: 'Mengakhiri sesi autentikasi pengguna dan mencabut access serta refresh token.',
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RefreshTokenInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Logout berhasil.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '401': {
            description: 'Tidak terotentikasi.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'Daftar Katalog Produk',
        description: 'Mengambil daftar produk aktif dengan pagination, pencarian fleksibel, dan multi-field sorting.',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Nomor halaman (1-based)',
            required: false,
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'per_page',
            in: 'query',
            description: 'Jumlah data per halaman (maksimal 100)',
            required: false,
            schema: { type: 'integer', default: 10 },
          },
          {
            name: 'search',
            in: 'query',
            description: 'Kata kunci pencarian nama atau kode produk (case-insensitive)',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'sort',
            in: 'query',
            description: 'Kolom pengurutan (dapat berupa multi-sort seperti price:desc,product_name:asc)',
            required: false,
            schema: { type: 'string', default: 'product_name' },
          },
          {
            name: 'order',
            in: 'query',
            description: 'Arah pengurutan default jika tidak ditentukan pada sort parameter',
            required: false,
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
          },
        ],
        responses: {
          '200': {
            description: 'Daftar produk berhasil dimuat.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'OK' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/ProductItem' },
                    },
                    meta: { $ref: '#/components/schemas/PaginationMeta' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Token tidak valid atau tidak disediakan.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Tambah Produk Baru',
        description: 'Mendaftarkan produk baru ke katalog dengan validasi keunikan product_code, price > 0, dan stock >= 0.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateProductInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Produk baru berhasil didaftarkan.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Produk berhasil ditambahkan' },
                    data: { $ref: '#/components/schemas/ProductItem' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Tidak terotentikasi.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '409': {
            description: 'Kode produk sudah digunakan oleh produk lain.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '422': {
            description: 'Validasi input gagal.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Detail Produk',
        description: 'Mengambil detail produk aktif berdasarkan ID integer.',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID produk integer',
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'Data produk berhasil diambil.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Data produk berhasil diambil' },
                    data: { $ref: '#/components/schemas/ProductItem' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Tidak terotentikasi.',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          '404': {
            description: 'Produk tidak ditemukan atau telah dihapus.',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          '422': {
            description: 'Format ID tidak valid.',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
      put: {
        tags: ['Products'],
        summary: 'Pembaruan Data Produk',
        description: 'Memperbarui informasi produk tertentu (nama, harga, stok). Kode produk bersifat tetap (immutable).',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID produk integer',
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateProductInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Produk berhasil diperbarui.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Produk berhasil diperbarui' },
                    data: { $ref: '#/components/schemas/ProductItem' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Tidak terotentikasi.',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          '404': {
            description: 'Produk tidak ditemukan.',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          '409': {
            description: 'Kode produk bentrok dengan produk lain.',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          '422': {
            description: 'Validasi gagal.',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
      delete: {
        tags: ['Products'],
        summary: 'Soft Delete Produk',
        description: 'Menghapus produk secara logis (soft delete). Catatan order historis tetap aman.',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID produk integer',
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'Produk berhasil dihapus.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Produk berhasil dihapus' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Tidak terotentikasi.',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          '404': {
            description: 'Produk tidak ditemukan atau sudah dihapus sebelumnya.',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          '422': {
            description: 'Format ID tidak valid.',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
    },
  },
};

export default swaggerDocument;
