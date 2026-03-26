 import { describe, test, expect, beforeAll } from '@jest/globals';
import authService from '../services/authService.js';
import bcryptjs from 'bcryptjs';

describe('AuthService — Singleton : Unicité', () => {

test('authService est défini', () => {
expect(authService).toBeDefined();
  });

  test('saltRounds est 10', () => {
expect(authService.saltRounds).toBe(10);
  });

  test('les peakéthodes principales existent', () => {
expect(typeof authService.register).toBe('function');
  expect(typeof authService.login).toBe('function');
    expect(typeof authService.verifyToken).toBe('function');
    });

  });

describe('AuthService — bcrypt : Hash et Compare', () => {

const testPassword = 'MonMotDePasse123!';
let hashedPassword;

  beforeAll(async () => {
hashedPassword = await bcryptjs.hash(testPassword, 10);
  });

  test('hash est différent du mot de passe original', () => {
expect(hashedPassword).not.toBe(testPassword);
  expect(hashedPassword).toMatch(/^\$2[ab]\$10\$/);
    });

  test('compare() retourne true avec le bon mot de passe', async () => {
const result = await bcryptjs.compare(testPassword, hashedPassword);
  expect(result).toBe(true);
    });

  test('compare() retourne false avec un mauvais mot de passe', async () => {
const result = await bcryptjs.compare('MauvaisMotDePasse', hashedPassword);
  expect(result).toBe(false);
    });

  test('deux hashs du peakême mot de passe sont différents', async () => {
const hash1 = await bcryptjs.hash(testPassword, 10);
  const hash2 = await bcryptjs.hash(testPassword, 10);
    expect(hash1).not.toBe(hash2);
    expect(await bcryptjs.compare(testPassword, hash1)).toBe(true);
    expect(await bcryptjs.compare(testPassword, hash2)).toBe(true);
    });

  });

describe('AuthService — JWT : Generate et Verify', () => {

const mockUser = {
id: 'u-test-jwt-1',
  email: 'jwt@test.com',
    firstName: 'Test',
    lastName: 'User',
    };

  test('_generateToken() retourne un string JWT valide', () => {
const token = authService._generateToken(mockUser);
  expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
    });

  test('verifyToken() retourne valid: true avec un bon token', () => {
const token = authService._generateToken(mockUser);
  const result = authService.verifyToken(token);
    expect(result.valid).toBe(true);
    expect(result.userId).toBe(mockUser.id);
    expect(result.email).toBe(mockUser.email);
    });

  test('verifyToken() retourne valid: false avec token invalide', () => {
const result = authService.verifyToken('token.invalide.ici');
  expect(result.valid).toBe(false);
    });

  test('verifyToken() retourne valid: false avec token falsifié', () => {
const token = authService._generateToken(mockUser);
  const falsified = token.slice(0, -5) + 'XXXXX';
    const result = authService.verifyToken(falsified);
    expect(result.valid).toBe(false);
    });

  });

describe('AuthService — Validation des entrées', () => {

test('register() échoue avec email invalide', async () => {
const result = await authService.register({
  firstName: 'Test',
    lastName: 'User',
      email: 'pas-un-email',
      password: 'MotDePasse123!',
      });
      expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    });

  test('register() échoue avec mot de passe trop court', async () => {
const result = await authService.register({
  firstName: 'Test',
    lastName: 'User',
      email: 'valid@test.com',
      password: '123',
      });
      expect(result.success).toBe(false);
    });

  test('login() échoue avec email inexistant', async () => {
const result = await authService.login('inexistant@test.com', 'MotDePasse123!');
  expect(result.success).toBe(false);
    });

  });