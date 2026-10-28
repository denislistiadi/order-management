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
      CustomerItem: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' },
          customer_name: { type: 'string', example: 'Budi Santoso' },
          customer_address: { type: 'string', example: 'Jl. Sudirman No. 45, Jakarta Selatan' },
          gender: { type: 'string', enum: ['Pria', 'Wanita'], example: 'Pria' },
          birth_date: { type: 'string', format: 'date', example: '1990-05-14' },
          phone: { type: 'string', nullable: true, example: '081234567890' },
          deleted_at: { type: 'string', nullable: true, example: null },
        },
      },
      CreateCustomerInput: {
        type: 'object',
        required: ['customer_name', 'customer_address', 'gender', 'birth_date'],
        properties: {
          customer_name: { type: 'string', example: 'Budi Santoso' },
          customer_address: { type: 'string', example: 'Jl. Sudirman No. 45, Jakarta Selatan' },
          gender: { type: 'string', enum: ['Pria', 'Wanita'], example: 'Pria' },
          birth_date: { type: 'string', format: 'date', example: '1990-05-14' },
          phone: { type: 'string', nullable: true, example: '081234567890' },
        },
      },
      UpdateCustomerInput: {
        type: 'object',
        properties: {
          customer_name: { type: 'string', example: 'Budi Santoso Updated' },
          customer_address: { type: 'string', example: 'Jl. Thamrin No. 88, Jakarta Pusat' },
          gender: { type: 'string', enum: ['Pria', 'Wanita'], example: 'Pria' },
          birth_date: { type: 'string', format: 'date', example: '1990-05-14' },
          phone: { type: 'string', nullable: true, example: '081987654321' },
        },
      },
      OrderItem: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          product_id: { type: 'integer', example: 3 },
          product_name: { type: 'string', example: 'Logitech MX Master 3S' },
          product_code: { type: 'string', example: 'PRD-001' },
          quantity: { type: 'integer', example: 2 },
          unit_price: { type: 'string', example: '1650000.00' },
          subtotal: { type: 'string', example: '3300000.00' },
        },
      },
      OrderResponse: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          order_number: { type: 'string', example: 'INV-20261028-0001' },
          customer_id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' },
          customer_name: { type: 'string', example: 'Budi Santoso' },
          created_by: { type: 'string', format: 'uuid', example: 'd3f1a2b4-c5e6-7890-abcd-ef1234567890' },
          order_date: { type: 'string', format: 'date-time', example: '2026-10-28T10:30:00.000Z' },
          total_amount: { type: 'string', example: '3300000.00' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/OrderItem' },
          },
        },
      },
      CreateOrderItemInput: {
        type: 'object',
        required: ['product_id', 'quantity'],
        properties: {
          product_id: { type: 'integer', example: 3 },
          quantity: { type: 'integer', example: 2 },
        },
      },
      CreateOrderInput: {
        type: 'object',
        required: ['customer_id', 'items'],
        properties: {
          customer_id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' },
          items: {
            type: 'array',
            minItems: 1,
            items: { $ref: '#/components/schemas/CreateOrderItemInput' },
          },
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
    '/customers': {
      get: {
        tags: ['Customers'],
        summary: 'Daftar Pelanggan',
        description: 'Mengambil daftar pelanggan aktif dengan pagination, pencarian nama pelanggan, dan multi-field sorting.',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
            description: 'Nomor halaman yang ingin diambil',
          },
          {
            name: 'per_page',
            in: 'query',
            schema: { type: 'integer', default: 10 },
            description: 'Jumlah pelanggan per halaman',
          },
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
            description: 'Kata kunci pencarian untuk nama pelanggan (case-insensitive)',
          },
          {
            name: 'sort',
            in: 'query',
            schema: { type: 'string', default: 'customer_name' },
            description: 'Kolom pengurutan (misal: customer_name:asc,birth_date:desc)',
          },
          {
            name: 'order',
            in: 'query',
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
            description: 'Arah pengurutan default',
          },
        ],
        responses: {
          '200': {
            description: 'Daftar pelanggan berhasil diambil.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Daftar pelanggan berhasil diambil' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/CustomerItem' },
                    },
                    meta: { $ref: '#/components/schemas/PaginationMeta' },
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
        },
      },
      post: {
        tags: ['Customers'],
        summary: 'Tambah Pelanggan Baru',
        description: 'Mendaftarkan profil pelanggan baru dengan nama, alamat, gender, tanggal lahir, dan nomor telepon opsional.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateCustomerInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Pelanggan berhasil ditambahkan.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Pelanggan berhasil ditambahkan' },
                    data: { $ref: '#/components/schemas/CustomerItem' },
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
          '422': {
            description: 'Validasi input gagal.',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
    },
    '/customers/{id}': {
      get: {
        tags: ['Customers'],
        summary: 'Detail Pelanggan',
        description: 'Mengambil informasi lengkap profil pelanggan berdasarkan ID UUID.',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'UUID Pelanggan',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Detail pelanggan berhasil diambil.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Detail pelanggan berhasil diambil' },
                    data: { $ref: '#/components/schemas/CustomerItem' },
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
            description: 'Pelanggan tidak ditemukan.',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          '422': {
            description: 'Format ID bukan UUID valid.',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
      put: {
        tags: ['Customers'],
        summary: 'Perbarui Data Pelanggan',
        description: 'Memperbarui profil pelanggan yang sudah ada berdasarkan ID UUID.',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'UUID Pelanggan',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateCustomerInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Data pelanggan berhasil diperbarui.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Data pelanggan berhasil diperbarui' },
                    data: { $ref: '#/components/schemas/CustomerItem' },
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
            description: 'Pelanggan tidak ditemukan.',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          '422': {
            description: 'Validasi input gagal.',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
      delete: {
        tags: ['Customers'],
        summary: 'Hapus Pelanggan (Soft Delete)',
        description: 'Menghapus pelanggan secara lunak dengan mencatat waktu deleted_at.',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'UUID Pelanggan',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Pelanggan berhasil dihapus.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Pelanggan berhasil dihapus' },
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
            description: 'Pelanggan tidak ditemukan atau sudah dihapus sebelumnya.',
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
    '/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Daftar Riwayat Transaksi',
        description: 'Mengambil riwayat order penjualan dengan paginasi, pencarian invoice/nama pelanggan, dan rentang tanggal.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Nomor halaman' },
          { name: 'per_page', in: 'query', schema: { type: 'integer', default: 10 }, description: 'Jumlah transaksi per halaman' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Pencarian nomor invoice atau nama pelanggan' },
          { name: 'customer_id', in: 'query', schema: { type: 'string', format: 'uuid' }, description: 'Filter berdasarkan ID pelanggan' },
          { name: 'from', in: 'query', schema: { type: 'string', format: 'date' }, description: 'Filter mulai tanggal (YYYY-MM-DD)' },
          { name: 'to', in: 'query', schema: { type: 'string', format: 'date' }, description: 'Filter sampai tanggal (YYYY-MM-DD)' },
          { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }, description: 'Arah pengurutan berdasarkan tanggal transaksi' },
        ],
        responses: {
          '200': {
            description: 'Daftar order berhasil diambil.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Daftar riwayat transaksi berhasil diambil' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/OrderResponse' } },
                    meta: { $ref: '#/components/schemas/PaginationMeta' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Tidak terotentikasi.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
      post: {
        tags: ['Orders'],
        summary: 'Buat Transaksi Penjualan (Atomic)',
        description: 'Membuat transaksi penjualan baru secara atomik. Validasi stok semua item dilakukan di server. Jika stok kurang, seluruh transaksi otomatis dibatalkan (rollback) dengan format error dot-notation.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateOrderInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Transaksi berhasil dibuat dan stok produk berhasil diperbarui.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Transaksi order berhasil dibuat' },
                    data: { $ref: '#/components/schemas/OrderResponse' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Tidak terotentikasi.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          '404': {
            description: 'Pelanggan tidak ditemukan atau sudah dihapus.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          '422': {
            description: 'Validasi gagal atau stok tidak mencukupi (dot-notation errors).',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Stok tidak mencukupi' },
                    errors: {
                      type: 'object',
                      example: {
                        'items.0.quantity': ['Stok Logitech MX Master 3S tersisa 5, diminta 10'],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Detail Transaksi Penjualan',
        description: 'Mengambil detail satu order berdasarkan ID numerik, beserta item barang dan informasi harga snapshot.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID numerik order' },
        ],
        responses: {
          '200': {
            description: 'Detail order berhasil diambil.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Detail transaksi berhasil diambil' },
                    data: { $ref: '#/components/schemas/OrderResponse' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Tidak terotentikasi.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          '404': {
            description: 'Order tidak ditemukan.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          '422': {
            description: 'Format ID tidak valid.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },

  },
};

export default swaggerDocument;
