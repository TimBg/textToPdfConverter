import { createPdf } from './pdfApi';

const API_URL = 'http://95.217.134.12:4010';
const API_KEY = '78684310-850d-427a-8432-4a6487f6dbc4';

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => 'mock-url');
});

describe('PDF API', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
  });

  describe('createPdf', () => {
    it('should successfully create PDF from valid text', async () => {
      const mockBlob = new Blob(['test'], { type: 'application/pdf' });
      const mockResponse = {
        ok: true,
        blob: () => Promise.resolve(mockBlob)
      };

      global.fetch = jest.fn().mockResolvedValueOnce(mockResponse);

      const result = await createPdf('Test PDF content');
      
      expect(result).toEqual(expect.objectContaining({
        id: expect.any(String),
        title: 'Test PDF content',
        pdfUrl: expect.any(String),
        createdAt: expect.any(String)
      }));
      
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
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 400
      });

      await expect(createPdf('')).rejects.toThrow('Failed to create PDF');
    });

    it('should handle very long text', async () => {
      const longText = 'a'.repeat(10000);
      const mockBlob = new Blob(['test'], { type: 'application/pdf' });
      const mockResponse = {
        ok: true,
        blob: () => Promise.resolve(mockBlob)
      };

      global.fetch = jest.fn().mockResolvedValueOnce(mockResponse);

      const result = await createPdf(longText);
      expect(result.title.length).toBeLessThanOrEqual(53);
    });

    it('should handle special characters', async () => {
      const specialText = '!@#$%^&*()_+{}|:"<>?';
      const mockBlob = new Blob(['test'], { type: 'application/pdf' });
      const mockResponse = {
        ok: true,
        blob: () => Promise.resolve(mockBlob)
      };

      global.fetch = jest.fn().mockResolvedValueOnce(mockResponse);

      const result = await createPdf(specialText);
      expect(result.title).toBe(specialText);
    });

    it('should handle multiple concurrent requests', async () => {
      const texts = ['Test 1', 'Test 2', 'Test 3'];
      const mockBlob = new Blob(['test'], { type: 'application/pdf' });
      const mockResponse = {
        ok: true,
        blob: () => Promise.resolve(mockBlob)
      };

      global.fetch = jest.fn()
        .mockResolvedValueOnce(mockResponse)
        .mockResolvedValueOnce(mockResponse)
        .mockResolvedValueOnce(mockResponse);

      const results = await Promise.all(texts.map(text => createPdf(text)));
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toEqual(expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          pdfUrl: expect.any(String),
          createdAt: expect.any(String)
        }));
      });
    });
  });
}); 