import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { CalculateDto } from './dto/calculate.dto';

@Controller('api')
export class CalculatorController {

  @Post('calculate')
  calculate(@Body('expression') expression: CalculateDto) {
    try {
      if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
        throw new BadRequestException('Invalid characters in expression');
      }

      const result = this.evaluate(expression);
      return { result: result.toString() };
    } catch (error) {
      throw new BadRequestException('Invalid expression');
    }
  }

  private evaluate(expression: string): number {
    expression = expression.replace(/\s+/g, '');
    return this.evaluateExpression(expression);
  }

  private evaluateExpression(expression: string): number {
    let openIndex = expression.lastIndexOf('(');
    
    if (openIndex !== -1) {
      let closeIndex = expression.indexOf(')', openIndex);
      if (closeIndex === -1) throw new Error('Mismatched parentheses');
      
      let result = this.evaluateSimpleExpression(
        expression.substring(openIndex + 1, closeIndex)
      );
      expression = 
        expression.substring(0, openIndex) + 
        result + 
        expression.substring(closeIndex + 1);
      return this.evaluateExpression(expression);
    }
    
    return this.evaluateSimpleExpression(expression);
  }

  private evaluateSimpleExpression(expression: string): number {
    const numbers: number[] = [];
    const operators: string[] = [];
    let currentNumber = '';

    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];
      if (['+', '-', '*', '/'].includes(char)) {
        if (currentNumber) {
          numbers.push(parseFloat(currentNumber));
          currentNumber = '';
        }
        if (char === '-' && (i === 0 || ['+', '-', '*', '/'].includes(expression[i - 1]))) {
          currentNumber = '-';
        } else {
          operators.push(char);
        }
      } else {
        currentNumber += char;
      }
    }
    if (currentNumber) {
      numbers.push(parseFloat(currentNumber));
    }

    // Multiply and divide first
    for (let i = 0; i < operators.length; i++) {
      if (operators[i] === '*' || operators[i] === '/') {
        const a = numbers[i];
        const b = numbers[i + 1];
        const result = operators[i] === '*' ? a * b : (b === 0 ? 
          (() => { throw new Error('Division by zero'); })() : a / b);
        
        numbers.splice(i, 2, result);
        operators.splice(i, 1);
        i--;
      }
    }

    // Then add and subtract
    let result = numbers[0];
    for (let i = 0; i < operators.length; i++) {
      const b = numbers[i + 1];
      result = operators[i] === '+' ? result + b : result - b;
    }

    return Number(result.toFixed(10));
  }

}