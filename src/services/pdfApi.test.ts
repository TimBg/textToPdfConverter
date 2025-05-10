import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPdf, downloadPdf } from './pdfApi';

const API_URL = 'http://95.217.134.12:4010';
const API_KEY = '78684310-850d-427a-8432-4a6487f6dbc4';

describe('PDF API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('createPdf', () => {
    it('should successfully create PDF from valid text', async () => {
      const mockResponse = {
        id: '123',
        title: 'Test PDF content',
        pdfUrl: `${API_URL}/pdf/123`,
        createdAt: new Date().toISOString()
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await createPdf('Test PDF content');
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/create-pdf?apiKey=${API_KEY}`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: 'Test PDF content' })
        })
      );
    });

    it('should handle empty text', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400
      });

      await expect(createPdf('')).rejects.toThrow('Failed to create PDF');
    });

    it('should handle very long text', async () => {
      const longText = 'a'.repeat(100000);
      const mockResponse = {
        id: '123',
        title: longText.slice(0, 50) + '...',
        pdfUrl: `${API_URL}/pdf/123`,
        createdAt: new Date().toISOString()
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await createPdf(longText);
      expect(result.title.length).toBeLessThanOrEqual(100);
    });

    it('should handle special characters', async () => {
      const specialText = '!@#$%^&*()_+{}|:"<>?';
      const mockResponse = {
        id: '123',
        title: specialText,
        pdfUrl: `${API_URL}/pdf/123`,
        createdAt: new Date().toISOString()
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await createPdf(specialText);
      expect(result.title).toBe(specialText);
    });

    it('should handle multiple concurrent requests', async () => {
      const texts = ['Test 1', 'Test 2', 'Test 3'];
      const mockResponses = texts.map((text, index) => ({
        id: `id-${index}`,
        title: text,
        pdfUrl: `${API_URL}/pdf/id-${index}`,
        createdAt: new Date().toISOString()
      }));

      global.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponses[0])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponses[1])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponses[2])
        });

      const results = await Promise.all(texts.map(text => createPdf(text)));
      expect(results).toEqual(mockResponses);
    });
  });

  describe('downloadPdf', () => {
    it('should successfully download PDF', async () => {
      const mockBlob = new Blob(['test'], { type: 'application/pdf' });
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(mockBlob)
      });

      const result = await downloadPdf('123');
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('application/pdf');
      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/create-pdf?apiKey=${API_KEY}`
      );
    });

    it('should handle invalid ID', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(downloadPdf('invalid-id')).rejects.toThrow('Помилка при завантаженні PDF');
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));
      await expect(downloadPdf('123')).rejects.toThrow('Network error');
    });

    it('should handle server errors', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(downloadPdf('123')).rejects.toThrow('Помилка при завантаженні PDF');
    });

    it('should handle multiple concurrent downloads', async () => {
      const mockBlob = new Blob(['test'], { type: 'application/pdf' });
      global.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          blob: () => Promise.resolve(mockBlob)
        })
        .mockResolvedValueOnce({
          ok: true,
          blob: () => Promise.resolve(mockBlob)
        })
        .mockResolvedValueOnce({
          ok: true,
          blob: () => Promise.resolve(mockBlob)
        });

      const results = await Promise.all(['id1', 'id2', 'id3'].map(id => downloadPdf(id)));
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toBeInstanceOf(Blob);
        expect(result.type).toBe('application/pdf');
      });
    });
  });
}); 