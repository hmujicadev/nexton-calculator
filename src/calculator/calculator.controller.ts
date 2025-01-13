import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { CalculateDto } from './dto/calculate.dto';

@Controller('api')
export class CalculatorController {
  @Post('calculate')
  calculate(@Body('expression') expression: CalculateDto): { result: string } {
    try {
      // Validate that it contains only allowed characters
      if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
        throw new Error('Invalid characters in expression');
      }

      // Evaluating the expression safely
      const result = eval(expression);
      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Invalid result');
      }

      return { result: result.toString() };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
