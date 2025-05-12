// src/auth/seed-user.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class SeedUser implements OnModuleInit {
  constructor(private readonly authService: AuthService) {}

  // Esta función se ejecuta automáticamente cuando se carga el módulo
  async onModuleInit() {
    try {
      const defaultUser = {
        email: 'demo@demo.com',
        password: '123456',
        fullName: 'Demo User',
      };

      await this.authService.create(defaultUser); // crea usuario si no existe
      console.log('✅ Usuario demo creado o ya existente');
    } catch (error) {
      console.log('⚠️ Error creando usuario demo:', error.message);
    }
  }
}

