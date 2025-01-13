import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as net from 'net';
import { exec } from 'child_process';

async function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', () => {
      // If the port is busy, try the following port
      resolve(findAvailablePort(startPort + 1));
    });

    server.once('listening', () => {
      // If the port is available, close it and use this port.
      server.close(() => resolve(startPort));
    });

    server.listen(startPort);
  });
}

function openBrowser(url: string) {
  const platform = process.platform;
  let command = '';

  if (platform === 'win32') {
    command = `start ${url}`;
  } else if (platform === 'darwin') {
    command = `open ${url}`;
  } else if (platform === 'linux') {
    command = `xdg-open ${url}`;
  }

  exec(command, (error) => {
    if (error) {
      console.error('Failed to open browser:', error);
    }
  });
}

async function bootstrap() {
  const startPort = parseInt(process.env.PORT, 10) || 3000; // Initial port
  const port = await findAvailablePort(startPort); // Find an available port

  const app = await NestFactory.create(AppModule);
  await app.listen(port);

  const url = `http://localhost:${port}`;
  console.log(`Application is running on: ${url}`);

  // Open browser automatically
  openBrowser(url);
}
bootstrap();
