import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CalculatorController } from './calculator/calculator.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Static file path
    }),
  ],
  controllers: [CalculatorController],
})
export class AppModule {}
