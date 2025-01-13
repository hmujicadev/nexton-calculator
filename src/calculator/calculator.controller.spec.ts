import { Test, TestingModule } from '@nestjs/testing';
import { CalculatorController } from './calculator.controller';
import { BadRequestException } from '@nestjs/common';

describe('CalculatorController', () => {
  let controller: CalculatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalculatorController],
    }).compile();

    controller = module.get<CalculatorController>(CalculatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('calculate', () => {
    it('should return the correct result for a valid expression', () => {
      const result = controller.calculate('2 + 3 * 4');
      expect(result).toEqual({ result: '14' });
    });

    it('should handle decimal calculations', () => {
      const result = controller.calculate('2.5 * 4');
      expect(result).toEqual({ result: '10' });
    });

    it('should handle parentheses correctly', () => {
      const result = controller.calculate('(2 + 3) * 4');
      expect(result).toEqual({ result: '20' });
    });

    it('should throw BadRequestException for invalid characters', () => {
      expect(() => controller.calculate('2 + abc')).toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for invalid result', () => {
      expect(() => controller.calculate('1 / 0')).toThrow(BadRequestException);
    });

    it('should handle whitespace in the expression', () => {
      const result = controller.calculate('  2   +   2 ');
      expect(result).toEqual({ result: '4' });
    });

    it('should throw BadRequestException for an empty expression', () => {
      expect(() => controller.calculate('')).toThrow(BadRequestException);
    });
  });
});
