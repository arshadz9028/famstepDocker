import fs from 'fs/promises';
import path from 'path';

export async function deleteTempDire() {
    const tempDir = path.join(process.cwd(), 'temp');
    const containsFiles = await directoryContainsFiles(tempDir);
    const containsDirectories = await directoryContainsDirectories(tempDir);
    
    if (containsFiles && containsDirectories) {
      await deleteTempFiles(tempDir);
      await deleteDirectory(tempDir);
    } else if (containsFiles) {
      await deleteTempFiles(tempDir);
    } else if (containsDirectories) {
      await deleteDirectory(tempDir);
    }
}

async function directoryContainsFiles(dir) {
    try {
      const items = await fs.readdir(dir, { withFileTypes: true });
      return items.some(item => item.isFile());
    } catch (err) {
      console.error('Error reading directory for files:', err);
      return false;
    }
  }
  
  async function directoryContainsDirectories(dir) {
    try {
      const items = await fs.readdir(dir, { withFileTypes: true });
      return items.some(item => item.isDirectory());
    } catch (err) {
      console.error('Error reading directory for directories:', err);
      return false;
    }
  }
  
  async function deleteTempFiles(dir) {
    try {
      const items = await fs.readdir(dir, { withFileTypes: true });
      for (const item of items) {
        if (item.isFile()) {
          await fs.unlink(path.join(dir, item.name));
        }
      }
    } catch (err) {
      console.error('Error deleting files in directory:', err);
    }
  }
  
  async function deleteDirectory(dir) {
    try {
      const items = await fs.readdir(dir, { withFileTypes: true });
      for (const item of items) {
        const itemPath = path.join(dir, item.name);
        if (item.isDirectory()) {
          await deleteDirectory(itemPath);
          await fs.rmdir(itemPath);
        }
      }
    } catch (err) {
      console.error('Error deleting directories:', err);
    }
  }